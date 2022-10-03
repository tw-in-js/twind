/**
 * [[include:packages/cdn/README.md]]
 *
 * @packageDocumentation
 * @module
 */

// Fix exported global variable from `twindCdn` to `twind`
/* @distilt-global-name twind */

import type {
  Twind,
  BaseTheme,
  TwindConfig,
  TwindUserConfig,
  Preset,
  ExtractThemes,
  Sheet,
} from 'twind'

import type { TailwindPresetOptions, TailwindTheme } from '@twind/preset-tailwind'

import { twind, observe, auto, cssom, asArray } from 'twind'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

export * as presetTailwind_colors from '@twind/preset-tailwind/colors'
export { default as presetTailwind_defaultTheme } from '@twind/preset-tailwind/defaultTheme'

// If we run in the browser as `<script src="..."></script>` auto call setup once the body starts rendering
const cancelAutoSetup = /* #__PURE__ */ auto(setup)

export function setup<Theme extends BaseTheme = TailwindTheme, SheetTarget = unknown>(
  config?: TwindConfig<Theme> & TailwindPresetOptions,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme & TailwindTheme, SheetTarget>

export function setup<
  Theme = TailwindTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = unknown,
>(
  config?: TwindUserConfig<Theme, Presets> & TailwindPresetOptions,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<TailwindTheme & ExtractThemes<Theme, Presets>, SheetTarget>

export function setup(
  { disablePreflight, ...config }: (TwindConfig | TwindUserConfig) & TailwindPresetOptions = {},
  sheet: Sheet = cssom(),
  target?: HTMLElement,
): Twind {
  cancelAutoSetup()

  return observe(
    twind(
      {
        ...(config as TwindUserConfig),
        presets: [
          presetAutoprefix(),
          presetTailwind({ disablePreflight }),
          ...asArray((config as TwindUserConfig).presets),
        ],
      } as any,
      sheet,
    ),
    target,
  ) as unknown as Twind
}
