import type { BaseTheme, ColorValue, Context } from '@twind/core'

export default function darkColor<Theme extends BaseTheme = BaseTheme>(
  section: string,
  key: string,
  { theme }: Context<Theme>,
): ColorValue | undefined {
  return theme(section, key.replace(/^([a-z]+)($|[.-])/, '$1Dark$2')) as ColorValue
}
