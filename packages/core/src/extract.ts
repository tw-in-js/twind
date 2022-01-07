import type { BaseTheme, Twind } from './types'

export interface ExtractResult {
  html: string
  css: string
}

export function extract<Theme extends BaseTheme = BaseTheme>(
  html: string,
  twind: Twind<Theme, string[]>,
): ExtractResult {
  twind.clear()

  return { html /* shim(html, twind)*/, css: twind.target.join('') }
}
