import type { Context, CSSRules, Plugins, Rule, Falsy } from '../types'

import * as is from '../internal/is'

import { join, tail } from './util'

export const translate = (
  plugins: Plugins,
  context: Context,
): ((rule: Rule, isTranslating?: boolean) => CSSRules | string | Falsy) => (
  rule,
  isTranslating,
) => {
  // If this is a inline directive - called it right away
  if (is.function(rule.d)) {
    return rule.d(context)
  }

  const parameters = rule.d.split('-')

  // Bail early for already hashed class names
  // Only if there are no variants and no negation
  // If there are variants or negation unknown directive will be reported
  if (!isTranslating && parameters[0] === 'tw' && rule.$ === rule.d) {
    return rule.$
  }

  // Try to find a plugin to handle this directive
  // example 'bg-gradient-to-r'
  // 1. 'bg-gradient-to-r' -> parameters=['bg-gradient-to-r']
  // 2. 'bg-gradient-to'   -> parameters=['bg-gradient-to', 'r']
  // 4. 'bg-gradient'      -> parameters=['bg-gradient', 'to', 'r']
  // 5. 'bg'               -> parameters=['bg', 'gradient', 'to', 'r']
  for (let index = parameters.length; index; index--) {
    const id = join(parameters.slice(0, index))

    const plugin = plugins[id]

    if (plugin) {
      return is.function(plugin)
        ? plugin(tail(parameters, index), context, id)
        : is.string(plugin)
        ? context[isTranslating ? 'css' : 'tw'](plugin)
        : plugin
    }
  }
}
