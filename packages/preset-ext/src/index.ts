import type { Preset } from '@twind/core'
import { preset } from '@twind/core'

import rules from './rules'
import variants from './variants'

export default function presetExt(): Preset {
  return preset({ rules, variants })
}
