/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Twind,
  BaseTheme,
  TwindConfig,
  TwindUserConfig,
  Preset,
  ExtractThemes,
  defineConfig,
  Sheet,
  asArray,
} from '@twind/core'

import { init, autoInit } from '@twind/runtime'

import autoprefix from '@twind/preset-autoprefix'
import mini from '@twind/preset-mini'

export * from '@twind/core'
export { tw } from '@twind/runtime'

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
      presets: [autoprefix(), ...asArray((config as TwindUserConfig<any>).presets), mini()],
    } as TwindUserConfig<any>),
    sheet,
    target,
  )
}
