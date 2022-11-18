import type { CSSObject, Rule } from '@twind/core'
import { arbitrary } from '@twind/core'

const rules: Rule[] = [
  // short css feature that allows any css properties to be added
  // `background-color[#1da1f1]` -> `{ background-color: #1da1f1 }`
  // TODO arbitrary values
  // TODO $ prefix for variables
  [
    /^([-\w]+\w)\[([^ ]+)]$/,
    ({ 1: $1, 2: $2 }, context) =>
      ({
        [$1]: arbitrary(`[${$2}]`, $1, context),
      } as CSSObject),
  ],
]

export default rules
