/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

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

import { defineConfig as defineConfig$, setup as setup$, auto, asArray } from 'twind'

import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

export function defineConfig<Theme extends BaseTheme = TailwindTheme>(
  config?: TwindConfig<Theme> & TailwindPresetOptions,
): TwindConfig<Theme & TailwindTheme>

export function defineConfig<Theme = TailwindTheme, Presets extends Preset<any>[] = Preset[]>(
  config?: TwindUserConfig<Theme, Presets> & TailwindPresetOptions,
): TwindConfig<TailwindTheme & ExtractThemes<Theme, Presets>>

export function defineConfig<Theme = TailwindTheme, Presets extends Preset<any>[] = Preset[]>({
  darkMode,
  enablePreflight,
  ...config
}: (TwindConfig | TwindUserConfig) & TailwindPresetOptions = {}): TwindConfig {
  return defineConfig$({
    ...config,
    presets: [
      presetAutoprefix(),
      presetTailwind({ darkMode, enablePreflight }),
      ...asArray((config as TwindUserConfig<Theme, Presets>).presets),
    ],
  } as TwindUserConfig)
}

// If we run in the browser as `<script src="..."></script>` auto call setup once the body starts rendering
const cancelAutoSetup = /* @__PURE__ */ auto(setup)

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
  config?: (TwindConfig | TwindUserConfig) & TailwindPresetOptions,
  sheet?: Sheet,
  target?: HTMLElement,
): Twind {
  cancelAutoSetup()

  return setup$(defineConfig(config as TwindUserConfig), sheet, target)
}

// If we run in the browser as `<script src="..."></script>` patch twind to use our setup and defineConfig
if (typeof document != 'undefined' && document.currentScript) {
  self.twind.setup = setup
  self.twind.defineConfig = defineConfig
}

declare global {
  interface Window {
    twind: typeof import('twind')
  }
}
