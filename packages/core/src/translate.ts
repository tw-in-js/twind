import type { BaseTheme, Twind } from './types'

export interface TranslateResult<Target = unknown> {
  className: string
  css: Target
}

export function translate<Theme extends BaseTheme = BaseTheme, Target = unknown>(
  tokens: string,
  tw: Twind<Theme, Target>,
): TranslateResult {
  tw.clear()

  return { className: tw(tokens), css: tw.target }
}
