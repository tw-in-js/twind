import type { Context, Injector, Mode } from '../types'

import { sortedInsertionIndex } from '../internal/util'

import type { RuleWithPresedence } from './serialize'

// Insert css rules using presedence to find the correct position within the sheet
export const inject = (
  injector: Injector,
  mode: Mode,
  context: Context,
): ((rule: RuleWithPresedence) => void) => {
  // An array of presedence by index within the sheet
  // always sorted
  const sortedPrecedences: number[] = []

  // Cache for already insert css rules
  // to prevent double insertions
  const insertedRules = new Set<string>()

  return ({ r: css, p: presedence }) => {
    // If not already inserted
    if (!insertedRules.has(css)) {
      // Find the correct position
      const index = sortedInsertionIndex(sortedPrecedences, presedence)

      try {
        // Insert
        injector.insert(css, index)

        // Mark rule as inserted
        insertedRules.add(css)

        // Update sorted index
        sortedPrecedences.splice(index, 0, presedence)
      } catch (error) {
        // Some thrown error a because of specific pseudo classes
        // let filter them to prevent unnecessary warnings
        // ::-moz-focus-inner
        // :-moz-focusring
        if (!/:-[mwo]/.test(css)) {
          mode.report({ id: 'INJECT_CSS_ERROR', css, error: error as Error }, context)
        }
      }
    }
  }
}
