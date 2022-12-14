import type { Preset } from '@twind/core'

import theme from './defaultTheme'
import darkColor from './darkColor'

export default function presetRadixUI(): Preset {
  return { theme, darkColor }
}
