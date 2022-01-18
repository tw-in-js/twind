import type { Preset } from '@twind/core'

import rules from './rules'
import variants from './variants'

export default function presetExt(): Preset {
  return { rules, variants }
}
