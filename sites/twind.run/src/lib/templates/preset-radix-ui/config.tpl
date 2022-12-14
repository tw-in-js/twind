import { defineConfig } from "@twind/core"
import presetAutoprefix from "@twind/preset-autoprefix"
// Using @twind/preset-tailwind/base to exclude the default tailwind colors
import presetTailwind from "@twind/preset-tailwind/base"

// Following https://www.radix-ui.com/docs/colors/palette-composition/composing-a-palette
import {
  mint as brand,
  mintDark as brandDark,
  violet as accent,
  violetDark as accentDark,
  mauve as neutral,
  mauveDark as neutralDark,

  // Error: Red/Tomato/Crimson
  tomato as error,
  tomatoDark as errorDark,

  // Success: Teal/Green/Grass/Mint
  teal as success,
  tealDark as successDark,

  // Warning: Yellow/Amber
  amber as warning,
  amberDark as warningDark,

  // Info: Blue/Sky/Cyan
  cyan as info,
  cyanDark as infoDark,
} from "@twind/preset-radix-ui/colors"

// Optional: enable automatic dark colors
import darkColor from "@twind/preset-radix-ui/darkColor"

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind({
      colors: {
        brand,
        brandDark,
        accent,
        accentDark,
        neutral,
        neutralDark,

        // Error: Red/Tomato/Crimson
        error,
        errorDark,

        // Success: Teal/Green/Grass/Mint
        success,
        successDark,

        // Warning: Yellow/Amber
        warning,
        warningDark,

        // Info: Blue/Sky/Cyan
        info,
        infoDark,
      },
    }),
  ],
  // auto dark colors
  darkColor,
})
