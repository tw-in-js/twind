import { defineConfig } from "twind"
import presetAutoprefix from "@twind/preset-autoprefix"
import presetTypography from "@twind/preset-typography"
import presetTailwind from "@twind/preset-tailwind"

export default defineConfig({
  presets: [presetAutoprefix(), presetTypography(/* options */), presetTailwind(/* options */)],
})
