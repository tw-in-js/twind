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
const toId = (rule: Rule, directive = rule.d): string => {
  if (is.function(directive)) return ''

  const base = join(rule.v, '')

  return (base && tail(base) + ':') + (rule.n ? '-' : '') + directive
}

export const configure = (
  config: Configuration = {},
): { init: () => void; process: (tokens: unknown[]) => string } => {
  const theme = makeThemeResolver(config.theme)

  const mode = config.mode || warn

  const hash = sanitize<Hasher | false>(config.hash, false, false, cyrb32)

  // Used to detect if a theme value should be negated
  let negate: boolean | undefined

  // The context that is passed to functions to access the theme, ...
  const context: Context = {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    tw: (...tokens: unknown[]) => process(tokens),

    theme: ((section: keyof Theme, key?: string | string[], defaultValue?: unknown): unknown => {
      // Empty key us ethe standard tailwind default key
      // eslint-disable-next-line unicorn/explicit-length-check
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
      return negate && value && is.string(value) ? `calc(${value} * -1)` : value
    }) as ThemeResolver,

    tag: (value) => (hash ? hash(value) : value),
  }

  // Used to translate a rule using plugins
  const translate = makeTranslate({ ...corePlugins, ...config.plugins }, context)

  // Apply variants to a translation
  const decorate = makeDecorate(config.darkMode || 'media', context)

  // Serialize a translation to css
  const serialize = makeSerialize(sanitize(config.prefix, autoprefix, noprefix), context)

  // Inject css into the target enviroment
  const inject = makeInject(
    config.injector || (typeof window === 'undefined' ? noOpInjector() : cssomInjector(config)),
    mode,
    context,
  )

  // Track active variants for nested `tw()` calls
  // `sm:hover:${({ tw }) => tw`underline`}`
  // == 'sm:hover:underline`
  const activeVariants: string[][] = []

  // Cache rule ids and their generated class name
  const idToClassName = Object.create(null) as Record<string, string>

  // Cache generated inline directive names by their function identity
  const inlineDirectiveName = new WeakMap<InlineDirective, string>()

  // Responsible for converting (translate, decorate, serialize, inject) a rule
  const convert = (rule: Rule): string | undefined | void => {
    // A rule id is the tailwind rule including variants, negate and directive

    // For inline rules (functions) `toId` returns an empty string
    // in that case we check if we already have a name for the function
    // and use that one to generate the id
    let id = toId(rule) || toId(rule, inlineDirectiveName.get(rule.d as InlineDirective))

    // Check if we already have a class name for this rule
    let className = idToClassName[id]

    // We check for nullish because we put an empty string into `idToClassName`
    // if a rule did not generate a class name
    // This way we report the unknown directives onyl once
    if (className == null) {
      // `context.theme()` needs know if it should negate the theme value
      negate = rule.n

      // Keep track of active variants for nested `tw` calls
      activeVariants.unshift(rule.v)

      // 2. translate each rule using plugins
      let translation = translate(rule)

      // Reset translate state variables to not interfere with other calls
      activeVariants.shift()
      negate = false

      // If this is a unknown inline directive
      if (!id) {
        // We can now generate a unique name based on the created translation
        // This id does not include the variants as a directive is always independent of variants
        // Variants are applied below using `decorate()`
        id = cyrb32(JSON.stringify(translation))

        // Remember it
        inlineDirectiveName.set(rule.d as InlineDirective, id)

        // Generate an id including the current variants
        id = toId(rule, id)
      }

      // CSS class names have been returned
      if (is.string(translation)) {
        // Use as is
        className = translation
      } else if (translation) {
        // 3. decorate: apply variants
        translation = decorate(translation, rule)

        className = hash ? hash(JSON.stringify(translation)) : id

        // 4. serialize: convert to css string with precedence
        // 5. inject: add to dom
        serialize(translation, className, rule).forEach(inject)
      } else {
        // No plugin or plugin did not return something
        mode.report({ id: 'UNKNOWN_DIRECTIVE', rule: id }, context)
        className = ''
      }

      // Remember the generated class name
      idToClassName[id] = className
    }

    return className
  }

  // This function is called from `tw(...)`
  // it parses, translates, decorates, serializes and injects the tokens
  const process = (tokens: unknown[]): string =>
    parse(tokens, activeVariants[0]).map(convert).filter(Boolean).join(' ')

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
  }
}
