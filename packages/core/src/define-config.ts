/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseTheme, Preset, TwindConfig, TwindUserConfig, ExtractThemes } from './types'
import { asArray } from './utils'

export function defineConfig<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>({
  presets = [] as unknown as Presets,
  preflight,
  theme = {} as TwindUserConfig<Theme, Presets>['theme'],
  variants = [],
  rules = [],
  hash,
  ignorelist = [],
  stringify = noprefix,
}: TwindUserConfig<Theme, Presets>): TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>> {
  let result: TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>> = {
    preflight: preflight != false && asArray(preflight),
    theme: theme as TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>>['theme'],
    variants,
    rules,
    ignorelist: asArray(ignorelist),
    hash,
    stringify,
  }

  for (const preset of presets) {
    result = preset(result) as TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>>
  }

  return result
}

function noprefix(property: string, value: string): string {
  return property + ':' + value
}
