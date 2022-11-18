import { defineConfig } from "@twind/core"
import presetAutoprefix from "@twind/preset-autoprefix"
// import presetExt from '@twind/preset-ext'
// import presetTypography from "@twind/preset-typography"
import presetTailwind from "@twind/preset-tailwind"
// import presetTailwindForms from "@twind/preset-tailwind-forms"
// import presetLineClamp from "@twind/preset-line-clamp"

export default defineConfig({
  presets: [
    presetAutoprefix(),
    // presetExt(),
    // presetTypography(/* options */),
    presetTailwind(/* options */),
    // presetTailwindForms(/* options */),
    // presetLineClamp(/* options */),
  ],
})
