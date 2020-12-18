import type {
  Configuration,
  Context,
  Preflight,
  ThemeResolver,
  Theme,
  Rule,
  Hasher,
  InlineDirective,
} from '../types'

import { corePlugins } from '../tailwind/plugins'
import { createPreflight } from '../tailwind/preflight'
import { coreVariants } from '../tailwind/variants'

import { cssomInjector, noOpInjector } from '../injectors'
import { warn } from '../modes'
import { autoprefix, noprefix } from '../prefix'

import * as is from '../internal/is'
import { makeThemeResolver } from '../internal/theme'
import { cyrb32, identity, join, tail } from '../internal/util'

import { parse } from './parse'
import { translate as makeTranslate } from './translate'
import { decorate as makeDecorate } from './decorate'
import { serialize as makeSerialize } from './serialize'
import { inject as makeInject } from './inject'

const sanitize = <T>(
  value: T | boolean | undefined,
  defaultValue: T,
  disabled: T,
  enabled = defaultValue,
): T => (value === false ? disabled : value === true ? enabled : value || defaultValue)

// Creates rule id including variants, negate and directive
// which is exactly like a tailwind rule
const toString = (rule: Rule, directive = rule.d): string => {
  if (is.function(directive)) return ''

  const base = join(rule.v, '')

  return (base && tail(base) + ':') + (rule.n ? '-' : '') + directive
}

export const configure = (
  config: Configuration = {},
): { init: () => void; process: (tokens: unknown[]) => string; theme: ThemeResolver } => {
  const theme = makeThemeResolver(config.theme)

  const mode = config.mode || warn

  const hash = sanitize<Hasher | false>(config.hash, false, false, cyrb32)

  // Track the active rule
  // 1. to detect if a theme value should be negated
  // 2. for nested `tw()` calls
  //    `sm:hover:${({ tw }) => tw`underline`}`
  //    ==> 'sm:hover:underline`
  // Start with an "empty" rule, to always have value to use
  let activeRule: { v: string[]; n?: boolean } = { v: [] }

  // The context that is passed to functions to access the theme, ...
  const context: Context = {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    tw: (...tokens: unknown[]) => process(tokens),

    theme: ((section: keyof Theme, key?: string | string[], defaultValue?: unknown): unknown => {
      // Empty key us ethe standard tailwind default key
      if (key != null && !key.length) {
        key = 'DEFAULT'
      }

      // If no theme value is found, notify 'mode', it may be able to resolve a value
      const value =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        theme(section, key as string, defaultValue as any) ||
        mode.unknown(
          section,
          key == null || Array.isArray(key) ? key : key.split('.'),
          defaultValue != null,
          context,
        )

      // Add negate to theme value using calc to support complex values
      return activeRule.n && value && is.string(value) ? `calc(${value} * -1)` : value
    }) as ThemeResolver,

    tag: (value) => (hash ? hash(value) : value),
  }

  // Used to translate a rule using plugins
  const translate = makeTranslate({ ...corePlugins, ...config.plugins }, context)

  // Wrap `translate()` to keep track of the active rule
  // we need to use try-finally as mode.report may throw
  // and we must always reset the active rule
  const tryTranslate = (rule: Rule): ReturnType<typeof translate> => {
    // Keep track of active variants for nested `tw` calls
    const parentRule = activeRule
    activeRule = rule

    try {
      return translate(rule)
    } finally {
      activeRule = parentRule
    }
  }

  const variants = { ...coreVariants, ...config.variants }

  // Apply variants to a translation
  const decorate = makeDecorate(config.darkMode || 'media', variants, context)

  // Serialize a translation to css
  const serialize = makeSerialize(sanitize(config.prefix, autoprefix, noprefix), variants, context)

  // Inject css into the target enviroment
  const inject = makeInject(
    config.injector || (typeof window === 'undefined' ? noOpInjector() : cssomInjector(config)),
    mode,
    context,
  )

  // Cache rule ids and their generated class name
  const idToClassName = new Map<string, string>()

  // Cache generated inline directive names by their function identity
  const inlineDirectiveName = new WeakMap<InlineDirective, string>()

  // Responsible for converting (translate, decorate, serialize, inject) a rule
  const convert = (rule: Rule): string | undefined | void => {
    // If there is a active rule this one is nested
    // we must add the variants and need to reset the id
    if (activeRule.v.length) {
      rule = { ...rule, v: [...activeRule.v, ...rule.v], $: '' }
    }

    // Static rules (from template literals) can cache their id
    // this greatly improves performance
    if (!rule.$) {
      // For inline directives (functions) `toString` returns an empty string
      // in that case we check if we already have a name for the function
      // and use that one to generate the id
      rule.$ = toString(rule) || toString(rule, inlineDirectiveName.get(rule.d as InlineDirective))
    }

    // Check if we already have a class name for this rule id
    let className = idToClassName.get(rule.$)

    // We check for nullish because we put an empty string into `idToClassName`
    // if a rule did not generate a class name
    // This way we report the unknown directives only once
    if (className == null) {
      // 2. translate each rule using plugins
      let translation = tryTranslate(rule)

      // If this is a unknown inline directive
      if (!rule.$) {
        // We can now generate a unique name based on the created translation
        // This id does not include the variants as a directive is always independent of variants
        // Variants are applied below using `decorate()`
        rule.$ = cyrb32(JSON.stringify(translation))

        // Remember it
        inlineDirectiveName.set(rule.d as InlineDirective, rule.$)

        // Generate an id including the current variants
        rule.$ = toString(rule, rule.$)
      }

      // CSS class names have been returned
      if (is.string(translation)) {
        // Use as is
        className = translation
      } else if (translation) {
        // 3. decorate: apply variants
        translation = decorate(translation, rule)

        className = hash ? hash(JSON.stringify(translation)) : rule.$

        // 4. serialize: convert to css string with precedence
        // 5. inject: add to dom
        serialize(translation, className, rule).forEach(inject)
      } else {
        // No plugin or plugin did not return something

        // Ignore hashed class names
        if (rule.$.slice(0, 3) !== 'tw-') {
          mode.report({ id: 'UNKNOWN_DIRECTIVE', rule: rule.$ }, context)
        }

        className = rule.$
      }

      // Remember the generated class name
      idToClassName.set(rule.$, className)
    }

    return className
  }

  // This function is called from `tw(...)`
  // it parses, translates, decorates, serializes and injects the tokens
  const process = (tokens: unknown[]): string =>
    parse(tokens).map(convert).filter(Boolean).join(' ')

  // Determine if we should inject the preflight (browser normalize)
  const preflight = sanitize<Preflight | false>(config.preflight, identity, false)

  if (preflight) {
    // Create the base tailwind preflight css rules
    const css = createPreflight(theme)

    // Call the preflight handler, serialize and inject the result
    serialize(preflight(css, context) || css).forEach(inject)
  }

  return {
    init: () => mode.report({ id: 'LATE_SETUP_CALL' }, context),
    process,
    theme,
  }
}
