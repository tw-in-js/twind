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
    presetLineClamp(),
    presetTailwind(),
    presetTailwindForms(),

    // 'ext' must come after other presets,
    // as it includes a "Short CSS" feature which catches arbitrary CSS rules:
    // https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/README.md#short-css
    // https://github.com/tw-in-js/twind/blob/next/packages/preset-ext/src/rules.ts
    presetExt(),
  ],
})
