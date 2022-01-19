/* eslint-disable @typescript-eslint/no-explicit-any */

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
} from './api'

import type { TailwindPresetOptions } from '@twind/preset-tailwind'

import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

import { init, auto, defineConfig, asArray } from './api'

const cancelAutoSetup = /* @__PURE__ */ auto(setup)

export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = unknown>(
  config?: TwindConfig<Theme> & TailwindPresetOptions,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget>

export function setup<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = unknown,
>(
  config?: TwindUserConfig<Theme, Presets> & TailwindPresetOptions,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, SheetTarget>

export function setup(
  {
    darkMode,
    enablePreflight,
    ...config
  }: (TwindConfig<any> | TwindUserConfig<any>) & TailwindPresetOptions = {},
  sheet?: Sheet,
  target?: HTMLElement,
): Twind {
  cancelAutoSetup()

  return init(
    defineConfig({
      ...config,
      presets: [
        presetAutoprefix(),
        presetTailwind({ darkMode, enablePreflight }),
        ...asArray((config as TwindUserConfig<any>).presets),
      ],
    } as TwindUserConfig<any>),
    sheet,
    target,
  )
}
