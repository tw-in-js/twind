/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Twind,
  BaseTheme,
  TwindConfig,
  TwindUserConfig,
  Preset,
  ExtractThemes,
  defineConfig,
} from '@twind/core'

import autoprefix from '@twind/preset-autoprefix'
import tailwind from '@twind/preset-tailwind'

import { runtime } from './runtime'

export * from '@twind/core'
export { apply, tw, theme } from './runtime'

if (typeof document != 'undefined' && document.currentScript) {
  // running as global script eg non module
  // invoke on next tick to allow other setup methods to run
  // eslint-disable-next-line no-var
  var autoSetupTimeoutRef = setTimeout(setup)
}

export function setup<Theme extends BaseTheme = BaseTheme>(
  config: TwindConfig<Theme>,
  target?: HTMLElement,
): Twind<Theme, CSSStyleSheet>

export function setup<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>(
  config: TwindUserConfig<Theme, Presets>,
  target?: HTMLElement,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, CSSStyleSheet>

export function setup(
  config: TwindConfig<any> | TwindUserConfig<any> = {},
  target?: HTMLElement,
): Twind {
  clearTimeout(autoSetupTimeoutRef)

  return runtime(
    defineConfig({
      ...config,
      presets: [autoprefix(), ...((config as TwindUserConfig<any>).presets || []), tailwind()],
    } as TwindUserConfig<any>),
    target,
  )
}
