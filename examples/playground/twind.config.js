import { defineConfig } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetExt from '@twind/preset-ext'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

// `defineConfig` is not required, but adds types
export default defineConfig({
  presets: [presetAutoprefix(), presetExt(), presetTailwind(), presetTailwindForms()],
})
