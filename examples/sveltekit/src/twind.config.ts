import { defineConfig } from 'twind'
import presetExt from '@twind/preset-ext'
import presetTailwindForms from '@twind/preset-tailwind-forms'

// `defineConfig` is no required, but adds types
export default defineConfig({
  presets: [presetTailwindForms(), presetExt()],
})
