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
} from '@twind/core'

import { init, autoInit } from '@twind/runtime'

import autoprefix from '@twind/preset-autoprefix'
import mini from '@twind/preset-mini'

export * from '@twind/core'
export { tw, theme } from '@twind/runtime'

const cancelAutoInit = autoInit(setup)

export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = CSSStyleSheet>(
  config?: TwindConfig<Theme>,
  target?: HTMLElement,
  sheet?: Sheet<SheetTarget>,
): Twind<Theme, CSSStyleSheet>

export function setup<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = CSSStyleSheet,
>(
  config?: TwindUserConfig<Theme, Presets>,
  target?: HTMLElement,
  sheet?: Sheet<SheetTarget>,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, CSSStyleSheet>

export function setup(
  config: TwindConfig<any> | TwindUserConfig<any> = {},
  target?: HTMLElement,
  sheet?: Sheet,
): Twind {
  cancelAutoInit()

  return init(
    defineConfig({
      ...config,
      presets: [autoprefix(), ...((config as TwindUserConfig<any>).presets || []), mini()],
    } as TwindUserConfig<any>),
    target,
    sheet,
  )
}
