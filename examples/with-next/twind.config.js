import { defineConfig } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

export default defineConfig({
  /* config */
  presets: [presetAutoprefix(), presetTailwind()],
})
