import { defineConfig } from "twind"
import presetAutoprefix from "@twind/preset-autoprefix"
// import presetExt from '@twind/preset-ext'
// import presetTypography from '@twind/preset-typography'
import presetTailwind from "@twind/preset-tailwind"

export default defineConfig({
  presets: [
    presetAutoprefix(),
    // presetExt(),
    // presetTypography(/* options */),
    presetTailwind(/* options */),
  ],
})
