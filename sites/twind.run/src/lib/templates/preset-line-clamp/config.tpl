import { defineConfig } from "@twind/core"
import presetAutoprefix from "@twind/preset-autoprefix"
import presetTailwind from "@twind/preset-tailwind"
import presetLineClamp from "@twind/preset-line-clamp"

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetLineClamp(),
    presetTailwind(/* options */),
  ],
})
