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
} from '@twind/core'

import { setup as init, auto, defineConfig, asArray } from '@twind/runtime'

import autoprefix from '@twind/preset-autoprefix'
import tailwind from '@twind/preset-tailwind'

const cancelAutoSetup = auto(setup)

export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = unknown>(
  config?: TwindConfig<Theme>,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget>

export function setup<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = unknown,
>(
  config?: TwindUserConfig<Theme, Presets>,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, SheetTarget>

export function setup(
  config: TwindConfig<any> | TwindUserConfig<any> = {},
  sheet?: Sheet,
  target?: HTMLElement,
): Twind {
  cancelAutoSetup()

  return init(
    defineConfig({
      ...config,
      presets: [autoprefix(), tailwind(), ...asArray((config as TwindUserConfig<any>).presets)],
    } as TwindUserConfig<any>),
    sheet,
    target,
  )
}
