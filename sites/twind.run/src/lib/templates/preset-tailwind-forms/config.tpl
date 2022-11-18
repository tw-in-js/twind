import { defineConfig } from "@twind/core"
import presetAutoprefix from "@twind/preset-autoprefix"
import presetTailwind from "@twind/preset-tailwind"
import presetTailwindForms from "@twind/preset-tailwind-forms"

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind(/* options */),
    presetTailwindForms(/* options */),
  ],
})
