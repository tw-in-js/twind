import type { Rule } from 'twind'

const rules: Rule[] = [
  // short css feature that allows any css properties to be added
  // `background-color[#1da1f1]` -> `{ background-color: #1da1f1 }`
  // TODO arbitrary values
  // TODO $ prefix for variables
  /^([-\w]+\w)\[(.+)]$/,
]

export default rules
