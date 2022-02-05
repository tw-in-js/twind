/**
 * [[include:packages/with-remix/README.md]]
 *
 * @packageDocumentation
 * @module
 */
import type { Twind, BaseTheme, TwindConfig, TwindUserConfig, Preset, ExtractThemes } from 'twind'

import { install as install$ } from 'twind'

export default install

function install<Theme extends BaseTheme = BaseTheme>(
  config: TwindConfig<Theme>,
): Twind<Theme & BaseTheme>

function install<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>(
  config: TwindUserConfig<Theme, Presets>,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>>

function install(config: TwindConfig | TwindUserConfig): Twind {
  return install$(config as TwindConfig, process.env.NODE_ENV == 'production')
}
