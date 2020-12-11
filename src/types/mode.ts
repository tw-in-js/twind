import type { Context } from './context'
import type { Theme, ThemeSectionType } from './theme'

export type ReportInfo =
  | { id: 'LATE_SETUP_CALL' }
  | { id: 'UNKNOWN_DIRECTIVE'; rule: string }
  | { id: 'UNKNOWN_THEME_VALUE'; key: string | undefined }
  | { id: 'INJECT_CSS_ERROR'; error: Error; css: string }

export interface Mode {
  /** Called for unknown theme values */
  unknown: <Section extends keyof Theme>(
    section: Section,
    key: string[] | undefined,
    optional: boolean,
    context: Context,
  ) => ThemeSectionType<Theme[Section]> | undefined | void

  /**
   * Notify error (missing plugin, duplicate directives? )
   *
   * Why id?
   * - can generate an url with more info
   * - reduce bundle size by omitting large error messages
   */
  report(info: ReportInfo, context: Context): void
}
