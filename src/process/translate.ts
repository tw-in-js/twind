import type { Context, CSSRules, Plugins, Rule, Falsy } from '../types'

import * as is from '../internal/is'

import { join, tail } from '../internal/util'

export const translate = (
  plugins: Plugins,
  context: Context,
): ((rule: Rule) => CSSRules | string | Falsy) => (rule) => {
  const parameters = rule.directive.split('-')

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
        ? context.tw(plugin)
        : plugin
    }
  }
}
