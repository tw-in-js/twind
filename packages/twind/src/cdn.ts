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

import { defineConfig, asArray } from '@twind/core'

import { init, autoInit } from '@twind/runtime'

import autoprefix from '@twind/preset-autoprefix'
import tailwind from '@twind/preset-tailwind'

const cancelAutoInit = autoInit(setup)

export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = CSSStyleSheet | string[]>(
  config?: TwindConfig<Theme>,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme, SheetTarget>

export function setup<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = CSSStyleSheet | string[],
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
  cancelAutoInit()

  return init(
    defineConfig({
      ...config,
      presets: [autoprefix(), ...asArray((config as TwindUserConfig<any>).presets), tailwind()],
    } as TwindUserConfig<any>),
    sheet,
    target,
  )
}
