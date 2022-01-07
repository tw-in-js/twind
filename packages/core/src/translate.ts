import type { BaseTheme, Twind } from './types'

export interface TranslateResult<Target = unknown> {
  className: string
  css: Target
}

export function translate<Theme extends BaseTheme = BaseTheme, Target = unknown>(
  tokens: string,
  twind: Twind<Theme, Target>,
): TranslateResult {
  twind.clear()

  return { className: twind.inject(tokens), css: twind.target }
}
