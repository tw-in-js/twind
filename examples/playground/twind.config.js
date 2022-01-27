import { defineConfig } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetExt from '@twind/preset-ext'
import presetLineClamp from '@twind/preset-line-clamp'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

// `defineConfig` is not required, but adds types
export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetExt(),
    presetLineClamp(),
    presetTailwind(),
    presetTailwindForms(),
  ],
})
