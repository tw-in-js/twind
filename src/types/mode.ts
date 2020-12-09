import type { Context } from './context'
import type { Rule } from './rule'
import type { Theme, ThemeSectionType } from './theme'

export type ReportInfo =
  | { id: 'LATE_SETUP_CALL' }
  | { id: 'UNKNOWN_DIRECTIVE'; rule: Rule }
  | { id: 'UNKNOWN_THEME_VALUE'; section: keyof Theme; keypath: string[] | undefined }
  | { id: 'INJECT_CSS_ERROR'; rule: string; error: Error }

export interface Mode {
  /** Called for unknown theme values */
  unknown: <Section extends keyof Theme>(
    section: Section,
    keypath: string[] | undefined,
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
