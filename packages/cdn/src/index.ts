// Fix exported global variable from `twindCdn` to `twind`
/* @distilt-global-name twind */

import { Twind, TwindConfig, TwindUserConfig, Preset, ExtractThemes, defineConfig } from 'twind'

import type { TailwindPresetOptions, TailwindTheme } from '@twind/preset-tailwind'

import { auto, install as install$, asArray } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

/** @hidden */
export * as presetTailwind_colors from '@twind/preset-tailwind/colors'

/** @hidden */
export { default as presetTailwind_defaultTheme } from '@twind/preset-tailwind/defaultTheme'

// If we run in the browser as `<script src="..."></script>` auto call setup once the body starts rendering
const cancelAutoInstall = /* #__PURE__ */ auto(install)

export function install<Theme extends TailwindTheme = TailwindTheme>(
  config?: TwindConfig<Theme> & TailwindPresetOptions,
  isProduction?: boolean,
): Twind<Theme & TailwindTheme>

export function install<Theme = TailwindTheme, Presets extends Preset<any>[] = Preset[]>(
  config?: TwindUserConfig<Theme, Presets> & TailwindPresetOptions,
  isProduction?: boolean,
): Twind<TailwindTheme & ExtractThemes<Theme, Presets>>

export function install(
  { disablePreflight, ...config }: (TwindConfig | TwindUserConfig) & TailwindPresetOptions = {},
  isProduction?: boolean,
): Twind {
  cancelAutoInstall()

  return install$(
    defineConfig({
      ...(config as TwindUserConfig),
      presets: [
        presetAutoprefix(),
        presetTailwind({ disablePreflight }),
        ...asArray((config as TwindUserConfig).presets),
      ],
    } as any),
    isProduction,
  )
}
