import { install } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

// You must call install at least once, but can call it multiple times
install({
  /* config */
  presets: [presetAutoprefix(), presetTailwind()],
})
