import { defineConfig } from '@twind/tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

// `defineConfig` is required as it adds the default tailwind presets
export default defineConfig({
  presets: [presetTailwindForms()],
  /* config */
})
