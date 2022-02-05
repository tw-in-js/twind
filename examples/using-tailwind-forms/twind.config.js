import { defineConfig } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms()],
  /* config */
})
