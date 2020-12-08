import type {
  Configuration,
  Context,
  Preflight,
  ThemeResolver,
  Theme,
  Rule,
  Hasher,
} from '@tw-in-js/types'

import { corePlugins } from '../tailwind/plugins'
import { createPreflight } from '../tailwind/preflight'

import { cssomInjector, noOpInjector } from '../injectors'
import { warn } from '../modes'
import { autoprefix, noprefix } from '../prefix'

import * as is from '../internal/is'
import { makeThemeResolver } from '../internal/theme'
import { cyrb32, identity, toClassName } from '../internal/util'

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

export const configure = (
  config: Configuration = {},
): { setup: () => void; process: (tokens: unknown[]) => string } => {
  const theme = makeThemeResolver(config.theme)

  const mode = config.mode || warn

  const hash = sanitize<Hasher | false>(config.hash, false, false, cyrb32)

  let negate: boolean

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
          key == null || is.array(key) ? key : key.split('.'),
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
    config.injector || (is.browser ? cssomInjector({ nonce: config.nonce }) : noOpInjector()),
    mode,
    context,
  )

  const ruleToClassNameCache = Object.create(null) as Record<string, string>

  const convert = (rule: Rule): string | undefined | void => {
    const id = toClassName(rule)

    let className = ruleToClassNameCache[id]

    if (!className) {
      // `context.theme()` needs know if it should negate the theme value
      negate = rule.negate

      // 2. translate each rule to css object using plugins
      let translation = translate(rule)

      // Reset negate to not interfere with other theme() calls
      negate = false

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
        mode.report({ id: 'UNKNOWN_DIRECTIVE', rule }, context)
        className = ''
      }

      ruleToClassNameCache[id] = className
    }

    return className
  }

  const process = (tokens: unknown[]): string =>
    parse(tokens).map(convert).filter(Boolean).join(' ')

  const preflight = sanitize<Preflight | false>(config.preflight, identity, false)

  if (preflight) {
    const css = createPreflight(theme)

    serialize(preflight(css, context) || css).forEach(inject)
  }

  return {
    setup: () => mode.report({ id: 'LATE_SETUP_CALL' }, context),
    process,
  }
}
