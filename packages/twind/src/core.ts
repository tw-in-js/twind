/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
export { tw, theme } from '@twind/runtime'

const cancelAutoInit = autoInit(setup)

export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = CSSStyleSheet | string[]>(
  config?: TwindConfig<Theme>,
  target?: HTMLElement,
  sheet?: Sheet<SheetTarget>,
): Twind<Theme, SheetTarget>

export function setup<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = CSSStyleSheet | string[],
>(
  config?: TwindUserConfig<Theme, Presets>,
  target?: HTMLElement,
  sheet?: Sheet<SheetTarget>,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, SheetTarget>

export function setup(
  config: TwindConfig<any> | TwindUserConfig<any> = {},
  target?: HTMLElement,
  sheet?: Sheet,
): Twind {
  cancelAutoInit()

  return init(config as TwindConfig<any>, target, sheet)
}
