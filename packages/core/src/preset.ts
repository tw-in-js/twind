import type { BaseTheme, Preset, TwindConfig, TwindPresetConfig } from './types'

export function preset<Theme extends BaseTheme = BaseTheme>(
  presetConfig:
    | TwindPresetConfig<Theme>
    | ((config: TwindConfig<Theme & BaseTheme>) => TwindPresetConfig<Theme>),
): Preset<Theme> {
  return (config) => {
    const {
      preflight,
      theme,
      variants = [],
      rules = [],
      hash = config.hash,
      ignorelist = [],
      stringify = config.stringify,
    } = typeof presetConfig == 'function' ? presetConfig(config) : presetConfig

    return {
      preflight: config.preflight && preflight != false && [preflight, ...config.preflight],

      theme: {
        ...theme,
        ...config.theme,
        extend: {
          ...theme?.extend,
          ...config.theme.extend,
        },
      },
      variants: [...config.variants, ...variants],
      rules: [...config.rules, ...rules],

      ignorelist: [...config.ignorelist, ...ignorelist],

      hash,
      stringify,
    }
  }
}
