import type { Context, Injector, Mode } from '../types'

import { sortedInsertionIndex } from '../internal/util'

import type { RuleWithPresedence } from './serialize'

export const inject = (
  injector: Injector,
  mode: Mode,
  context: Context,
): ((rule: RuleWithPresedence) => void) => {
  const sortedPrecedences: number[] = []
  const insertedRules = Object.create(null) as Record<string, boolean>

  return ({ r: rule, p: presedence }) => {
    if (!insertedRules[rule]) {
      const index = sortedInsertionIndex(sortedPrecedences, presedence)

      try {
        injector.insert(rule, index)
        insertedRules[rule] = true
        sortedPrecedences.splice(index, 0, presedence)
      } catch (error) {
        // Filter out vendor specific pseudo classes to prevent unnecessary warnings
        // ::-moz-focus-inner
        // :-moz-focusring
        if (!/:-[mwo]/.test(rule)) {
          mode.report({ id: 'INJECT_CSS_ERROR', rule, error: error as Error }, context)
        }
      }
    }
  }
}
