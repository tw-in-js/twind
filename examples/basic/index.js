import { setup } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

// You must call setup at least once, but can call it multiple times
setup({
  /* config */
  presets: [presetAutoprefix(), presetTailwind()],
})
