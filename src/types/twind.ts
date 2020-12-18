import type { CSSRules } from './css'
import type { Theme, ThemeResolver, ThemeSectionType } from './theme'
import type { Falsy } from './util'

export interface TW {
  (strings: TemplateStringsArray, ...interpolations: Token[]): string
  (...tokens: Token[]): string
}

export interface Context {
  /** Allow composition */
  readonly tw: TW

  /** Access to theme values */
  readonly theme: ThemeResolver

  /** Create unique identifier (group, custom properties) */
  readonly tag: (key: string) => string
}

export interface Instance {
  readonly tw: TW
  readonly setup: (options?: Configuration) => void
  readonly theme: ThemeResolver
}

export interface Preflight {
  (preflight: CSSRules, context: Context): CSSRules | undefined | void
}

export interface ThemeConfiguration extends Partial<Theme> {
  extend?: Partial<Theme>
}

export interface InjectorConfig<T = unknown> {
  /**
   * Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.
   *
   * Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).
   */
  nonce?: string

  /** Target to insert rules into. */
  target?: T
}

export interface Injector {
  insert: (rule: string, index: number) => void
  // delete: (index: number) => void
}

export interface VirtualInjector extends Injector {
  target: string[]
}

export interface CSSOMInjector extends Injector {
  target: CSSStyleSheet
}

export type Prefixer = (property: string, value: string) => string

export type Hasher = (value: string) => string

export type DarkMode = 'media' | 'class' | false

export interface Configuration {
  /**
   * Determines the dark mode strategy (default: `"media"`).
   */
  darkMode?: DarkMode

  theme?: ThemeConfiguration

  plugins?: Plugins

  /**
   * Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.
   *
   * Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).
   */
  nonce?: string

  /** Style insertion methodology to be used. */
  injector?: Injector

  /** Called right before the first rule is injected. */
  preflight?: Preflight | boolean

  /** Auto-prefixer method for CSS property–value pairs. */
  prefix?: Prefixer | boolean

  hash?: Hasher | boolean

  mode?: Mode
}

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

export type Plugin = string | CSSRules | DirectiveHandler

export type Plugins = Record<string, Plugin | undefined>

export interface DirectiveHandler {
  /**
   * Creates CSSRules based on `parameters`
   */
  (parameters: string[], context: Context, id: string): CSSRules | string | Falsy
}

export interface Rule {
  /**
   * The variants: `[":sm", ":dark", ":hover"]`
   */
  v: string[]

  /**
   * The directive: `"text-sm"`, `"rotate-45"`
   */
  d: string | InlineDirective

  /** Is this rule negated: `"-rotate-45"` =\> `true` */
  n: boolean | undefined

  /**
   * The id is the tailwind rule including variants, negate and directive
   *
   * Initialy this is set to an empty string.
   *
   * This is used to cache the id of static rules (from template literals).
   */
  $: string
}

export interface InlineDirective {
  (context: Context): CSSRules | string | Falsy
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TokenGrouping extends Record<string, Token> {
  /* for recusive types */
}

export type TypescriptCompat = boolean | number

export type Token = string | TokenGrouping | InlineDirective | Token[] | Falsy | TypescriptCompat
