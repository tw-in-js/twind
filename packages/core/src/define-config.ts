/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BaseTheme,
  Preset,
  TwindConfig,
  TwindUserConfig,
  ExtractThemes,
  TwindPresetConfig,
} from './types'
import { asArray } from './utils'

export function defineConfig<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>({
  presets = [] as unknown as Presets,
  ...userConfig
}: TwindUserConfig<Theme, Presets>): TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>> {
  // most user config values go first to have precendence over preset config
  // only `preflight` and `theme` are applied as last preset to override all presets
  let config: TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>> = {
    preflight: userConfig.preflight !== false && [],
    theme: {},
    variants: asArray(userConfig.variants),
    rules: asArray(userConfig.rules),
    ignorelist: asArray(userConfig.ignorelist),
    hash: userConfig.hash,
    stringify: userConfig.stringify || noprefix,
  }

  for (const preset of asArray([
    ...presets,
    {
      preflight: userConfig.preflight !== false && asArray(userConfig.preflight),
      theme: userConfig.theme as TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>>['theme'],
    } as TwindPresetConfig<Theme>,
  ])) {
    const {
      preflight,
      theme,
      variants,
      rules,
      hash = config.hash,
      ignorelist,
      stringify = config.stringify,
    } = typeof preset == 'function' ? preset(config) : (preset as TwindPresetConfig<Theme>)

    config = {
      // values defined by user or previous presets take precedence
      preflight: config.preflight && preflight !== false && [...config.preflight, preflight],

      theme: {
        ...config.theme,
        ...theme,
        extend: {
          ...config.theme.extend,
          ...theme?.extend,
        },
      },

      variants: [...config.variants, ...asArray(variants)],
      rules: [...config.rules, ...asArray(rules)],
      ignorelist: [...config.ignorelist, ...asArray(ignorelist)],

      hash,
      stringify,
    } as TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>>
  }

  return config
}

function noprefix(property: string, value: string): string {
  return property + ':' + value
}
