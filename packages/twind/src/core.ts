/* eslint-disable @typescript-eslint/no-unsafe-return */
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

import { init, autoInit } from '@twind/runtime'

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

  return init(config as TwindConfig<any>, sheet, target)
}
