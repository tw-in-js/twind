/**
 * [[include:packages/with-sveltekit/README.md]]
 *
 * @packageDocumentation
 * @module
 */

import type {
  Twind,
  BaseTheme,
  TwindConfig,
  TwindUserConfig,
  Preset,
  ExtractThemes,
  Sheet,
} from 'twind'

import { defineConfig as defineConfig$, setup as setup$, getSheet } from 'twind'

export function defineConfig<Theme extends BaseTheme = BaseTheme>(
  config?: TwindConfig<Theme>,
): TwindConfig<Theme & BaseTheme>

export function defineConfig<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>(
  config?: TwindUserConfig<Theme, Presets>,
): TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>>

export function defineConfig({
  hash = process.env.NODE_ENV == 'production',
  ...config
}: TwindConfig | TwindUserConfig = {}): TwindConfig {
  return defineConfig$({ ...config, hash } as TwindUserConfig)
}

export function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = unknown>(
  config?: TwindConfig<Theme>,
  sheet?: Sheet<SheetTarget>,
): Twind<Theme & BaseTheme, SheetTarget>

export function setup<
  Theme = BaseTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = unknown,
>(
  config?: TwindUserConfig<Theme, Presets>,
  sheet?: Sheet<SheetTarget>,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>, SheetTarget>

export function setup(
  config: TwindConfig | TwindUserConfig = {} as TwindUserConfig,
  sheet = getSheet(process.env.NODE_ENV != 'production'),
): Twind {
  return setup$(defineConfig(config as TwindUserConfig), sheet)
}
