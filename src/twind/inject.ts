import type { Context, Sheet, Mode, SheetInit } from '../types'

import { sortedInsertionIndex } from '../internal/util'

import type { RuleWithPresedence } from './serialize'

// Insert css rules using presedence to find the correct position within the sheet
export const inject = (
  sheet: Sheet,
  mode: Mode,
  init: SheetInit,
  context: Context,
): ((rule: RuleWithPresedence) => void) => {
  // An array of presedence by index within the sheet
  // always sorted
  let sortedPrecedences: number[]
  init<number[]>((value = []) => (sortedPrecedences = value))

  // Cache for already inserted css rules
  // to prevent double insertions
  let insertedRules: Set<string>
  init<Set<string>>((value = new Set()) => (insertedRules = value))

  return ({ r: css, p: presedence }) => {
    // If not already inserted
    if (!insertedRules.has(css)) {
      // Mark rule as inserted
      insertedRules.add(css)

      // Find the correct position
      const index = sortedInsertionIndex(sortedPrecedences, presedence)

      try {
        // Insert
        sheet.insert(css, index)

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
