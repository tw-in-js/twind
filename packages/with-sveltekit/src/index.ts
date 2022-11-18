import type {
  Twind,
  BaseTheme,
  TwindConfig,
  TwindUserConfig,
  Preset,
  ExtractThemes,
} from '@twind/core'

import { install as install$ } from '@twind/core'

export default install

function install<Theme extends BaseTheme = BaseTheme>(
  config: TwindConfig<Theme>,
  isProduction?: boolean,
): Twind<Theme & BaseTheme>

function install<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>(
  config: TwindUserConfig<Theme, Presets>,
  isProduction?: boolean,
): Twind<BaseTheme & ExtractThemes<Theme, Presets>>

function install(
  config: TwindConfig | TwindUserConfig,
  isProduction = process.env.NODE_ENV == 'production',
): Twind {
  return install$(config as TwindConfig, isProduction)
}
