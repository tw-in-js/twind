import type {
  Configuration,
  Context,
  Preflight,
  ThemeResolver,
  Theme,
  Rule,
  Hasher,
  InlineDirective,
  CSSRules,
  Mode,
  Falsy,
  TypescriptCompat,
} from '../types'

import { corePlugins } from './plugins'
import { createPreflight } from './preflight'
import { coreVariants } from './variants'

import { cssomSheet, voidSheet } from './sheets'
import { silent, strict, warn } from './modes'
import { autoprefix, noprefix } from './prefix'
import { makeThemeResolver } from './theme'

import { cyrb32, identity, tail, merge, evalThunk, ensureMaxSize } from '../internal/util'

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

const loadMode = (mode: Configuration['mode']): Mode =>
  (typeof mode == 'string'
    ? ({ t: strict, a: warn, i: silent } as Record<string, Mode>)[mode[1]]
    : mode) || warn

const stringifyVariant = (selector: string, variant: string): string =>
  selector + (variant[1] === ':' ? tail(variant, 2) + ':' : tail(variant)) + ':'

// Creates rule id including variants, negate and directive
// which is exactly like a tailwind rule
const stringify = (rule: Rule, directive = rule.d): string =>
  typeof directive == 'function'
    ? ''
    : rule.v.reduce(stringifyVariant, '') + (rule.n ? '-' : '') + directive + (rule.i ? '!' : '')

// Use hidden '_' property to collect class names which have no css translation like hashed twind classes
const COMPONENT_PROPS = { _: { value: '', writable: true } }

export const configure = (
  config: Configuration = {},
): {
  init: () => void
  process: (tokens: unknown[]) => string
} => {
  const theme = makeThemeResolver(config.theme)

  const mode = loadMode(config.mode)

  const hash = sanitize<Hasher | false>(config.hash, false, false, cyrb32)

  // Track the active rule
  // 1. to detect if a theme value should be negated
  // 2. for nested `tw()` calls
  //    `sm:hover:${({ tw }) => tw`underline`}`
  //    ==> 'sm:hover:underline`
  // Start with an "empty" rule, to always have value to use
  let activeRule: { v: string[]; n?: boolean } = { v: [] }

  let translateDepth = 0
  const lastTranslations: (CSSRules | string | Falsy)[] = []

  // The context that is passed to functions to access the theme, ...
  const context: Context = {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    tw: (...tokens: unknown[]) => process(tokens),

    theme: ((section: keyof Theme, key?: string | string[], defaultValue?: unknown): unknown => {
      // Empty key use the standard tailwind default key
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
      return activeRule.n && value && typeof value == 'string' ? `calc(${value} * -1)` : value
    }) as ThemeResolver,

    tag: (value) => (hash ? hash(value) : value),

    css: (rules) => {
      translateDepth++
      const lastTranslationsIndex = lastTranslations.length

      try {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(typeof rules == 'string' ? parse([rules]) : rules).forEach(convert)

        const css = Object.create(null, COMPONENT_PROPS)

        for (let index = lastTranslationsIndex; index < lastTranslations.length; index++) {
          const translation = lastTranslations[index]

          if (translation) {
            switch (typeof translation) {
              case 'object':
                merge(css, translation, context)
                break
              case 'string':
                css._ += (css._ && ' ') + translation
            }
          }
        }

        return css
      } finally {
        lastTranslations.length = lastTranslationsIndex
        translateDepth--
      }
    },
  }

  // Used to translate a rule using plugins
  const translate = makeTranslate({ ...corePlugins, ...config.plugins }, context)

  // Wrap `translate()` to keep track of the active rule
  // we need to use try-finally as mode.report may throw
  // and we must always reset the active rule
  const doTranslate = (rule: Rule): CSSRules | string | Falsy | TypescriptCompat => {
    // Keep track of active variants for nested `tw` calls
    const parentRule = activeRule
    activeRule = rule

    try {
      return evalThunk(translate(rule), context)
    } finally {
      activeRule = parentRule
    }
  }

  const variants = { ...coreVariants, ...config.variants }

  // Apply variants to a translation
  const decorate = makeDecorate(config.darkMode || 'media', variants, context)

  // Serialize a translation to css
  const serialize = makeSerialize(sanitize(config.prefix, autoprefix, noprefix), variants, context)

  const sheet = config.sheet || (typeof window == 'undefined' ? voidSheet() : cssomSheet(config))

  const { init = (callback) => callback() } = sheet

  // Inject css into the target enviroment
  const inject = makeInject(sheet, mode, init, context)

  // Cache rule ids and their generated class name
  let idToClassName: Map<string, string>
  init<Map<string, string>>((value = new Map()) => (idToClassName = value))

  // Cache generated inline directive names by their function identity
  const inlineDirectiveName = new WeakMap<InlineDirective, string>()

  // Used as replacer for JSON.stringify to calculate the hash for a inline function
  const evaluateFunctions = (key: string, value: unknown): unknown =>
    typeof value == 'function' ? JSON.stringify(value(context), evaluateFunctions) : value

  // Responsible for converting (translate, decorate, serialize, inject) a rule
  const convert = (rule: Rule): string | undefined | void => {
    // If there is a active rule this one is nested
    // we must add the variants and need to reset the id
    if (!translateDepth && activeRule.v.length) {
      rule = { ...rule, v: [...activeRule.v, ...rule.v], $: '' }
    }

    // Static rules (from template literals) can cache their id
    // this greatly improves performance
    if (!rule.$) {
      // For inline directives (functions) `stringify` returns an empty string
      // in that case we check if we already have a name for the function
      // and use that one to generate the id
      rule.$ = stringify(rule, inlineDirectiveName.get(rule.d as InlineDirective))
    }

    // Check if we already have a class name for this rule id
    let className = translateDepth ? null : idToClassName.get(rule.$)

    if (className == null) {
      // 2. translate each rule using plugins
      let translation = doTranslate(rule)

      // If this is a unknown inline directive
      if (!rule.$) {
        // We can now generate a unique name based on the created translation
        // This id does not include the variants as a directive is always independent of variants
        // Variants are applied below using `decorate()`
        // JSON.stringify ignores functions - by using a custom replace
        // we can calculate a hash based on the value returned by these functions
        // eslint-disable-next-line no-var
        rule.$ = cyrb32(JSON.stringify(translation, evaluateFunctions))

        // Remember it
        inlineDirectiveName.set(rule.d as InlineDirective, rule.$)

        // Generate an id including the current variants
        rule.$ = stringify(rule, rule.$)
      }

      if (translation && typeof translation == 'object') {
        // 3. decorate: apply variants
        translation = decorate(translation, rule)

        if (translateDepth) {
          lastTranslations.push(translation)
        } else {
          // - components: layer.components = 1
          // - plugins: layer.utilities = 2
          // - inline directive: layer.css = 3
          const layer = typeof rule.d == 'function' ? (typeof translation._ == 'string' ? 1 : 3) : 2

          className =
            hash || typeof rule.d == 'function' ? (hash || cyrb32)(layer + rule.$) : rule.$

          // 4. serialize: convert to css string with precedence
          // 5. inject: add to dom
          serialize(translation, className, rule, layer).forEach(inject)

          if (translation._) {
            className += ' ' + translation._
          }
        }
      } else {
        // CSS class names have been returned
        if (typeof translation == 'string') {
          // Use as is
          className = translation
        } else {
          // No plugin or plugin did not return something
          className = rule.$
          mode.report({ id: 'UNKNOWN_DIRECTIVE', rule: className }, context)
        }

        if (translateDepth && typeof rule.d !== 'function') {
          lastTranslations.push(className)
        }
      }

      if (!translateDepth) {
        // Remember the generated class name
        idToClassName.set(rule.$, className as string)

        // Ensure the cache does not grow unlimited
        ensureMaxSize(idToClassName, 30000)
      }
    }

    return className as string
  }

  // This function is called from `tw(...)`
  // it parses, translates, decorates, serializes and injects the tokens
  const process = (tokens: unknown[]): string =>
    parse(tokens).map(convert).filter(Boolean).join(' ')

  // Determine if we should inject the preflight (browser normalize)
  const preflight = sanitize<Preflight | false | CSSRules>(config.preflight, identity, false)

  if (preflight) {
    // Create the base tailwind preflight css rules
    const css = createPreflight(theme)

    // Call the preflight handler, serialize and inject the result
    const styles = serialize(
      typeof preflight == 'function'
        ? evalThunk(preflight(css, context), context) || css
        : { ...css, ...preflight },
    )

    init<boolean>((injected = (styles.forEach(inject), true)) => injected)
  }

  return {
    init: () => mode.report({ id: 'LATE_SETUP_CALL' }, context),
    process,
  }
}
