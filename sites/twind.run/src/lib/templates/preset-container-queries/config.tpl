import { defineConfig } from "@twind/core"
import presetAutoprefix from "@twind/preset-autoprefix"
import presetTailwind from "@twind/preset-tailwind"
import presetContainerQueries from "@twind/preset-container-queries"

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetContainerQueries(),
    presetTailwind(/* options */),
  ],
})
