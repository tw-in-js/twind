import type * as CSS from 'csstype'

import type { CSSProperties } from './css'
import type { Theme, ThemeResolver, ThemeSectionType } from './theme'
import type { Falsy } from './util'

export interface TW {
  (strings: TemplateStringsArray, ...interpolations: Token[]): string
  (...tokens: Token[]): string

  apply(strings: TemplateStringsArray, ...interpolations: Token[]): TWApply
  apply(...tokens: Token[]): TWApply
}

export interface LazyInjected {
  valueOf(): string
  toString(): string

  toJSON(): unknown
}

export interface TWApply extends LazyInjected {
  (context: Context): CSSRules
}

export interface Context {
  /** Allow composition */
  readonly tw: TW

  /** Access to theme values */
  readonly theme: ThemeResolver

  /** Create unique identifier (group, custom properties) */
  readonly tag: (key: string) => string

  readonly css: (rule: Rule[] | string) => CSSRules
}

export interface Instance {
  readonly tw: TW
  readonly setup: (options?: Configuration) => void
}

export type MaybeThunk<T> = T | ((context: Context) => T)

export interface Preflight {
  (preflight: CSSRules, context: Context): MaybeThunk<CSSRules | undefined | void>
}

export interface ThemeConfiguration extends Partial<Theme> {
  extend?: Partial<Theme>
}

export interface SheetConfig<T = unknown> {
  /**
   * Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.
   *
   * Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).
   */
  nonce?: string

  /** Target to insert rules into. */
  target?: T
}

export interface Sheet<T = unknown> {
  readonly target: T

  insert: (rule: string, index: number) => void

  init?: SheetInit
}

export type SheetInitCallback<T = unknown> = (value?: T | undefined) => T

export interface SheetInit {
  /**
   * Register a function that should be called to use a snapshot state or create a new state.
   */
  <T>(callback: SheetInitCallback<T>): T
}

export type Prefixer = (property: string, value: string, important?: boolean) => string

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
   * ```js
   * {
   *   ':new-variant': '& .selector',
   * }
   * ```
   */
  variants?: Record<string, string>

  /**
   * Sets a cryptographic nonce (number used once) on the enclosing `<style>` tag when generating a page on demand.
   *
   * Useful for enforcing a [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP).
   */
  nonce?: string

  /** Style insertion methodology to be used. */
  sheet?: Sheet

  /** Called right before the first rule is injected. */
  preflight?: Preflight | boolean | CSSRules

  /** Auto-prefixer method for CSS property–value pairs. */
  prefix?: Prefixer | boolean

  hash?: Hasher | boolean

  mode?: Mode | 'strict' | 'warn' | 'silent'
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

  /** Is this rule marked as important: `"stroke-4!"` =\> `true` */
  i: boolean | undefined

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

/**
 * Pseudo class
 * watch out for ':root' - that could use '*' instead
 */
// [`:${string}`]: CSSRules
export type CSSSimplePseudos = { [K in CSS.SimplePseudos as `&${string & K}`]?: CSSRules }

export interface CSSPseudos extends CSSSimplePseudos {
  '&:nth-child(2n)'?: CSSRules
  '&:nth-child(odd)'?: CSSRules
}

export type CSSAtMedia = Record<string, CSSRules>
export type CSSAtSupports = Record<string, CSSRules>
export type CSSAtKeyframes = Record<string, CSSProperties | ((context: Context) => CSSProperties)>

/**
 * See: https://drafts.csswg.org/css-nesting/#nest-selector
 *
 * ```
 * "& > * + *": {
 *   marginLeft: 16
 * },
 *
 * // In a comma-separated list, each individual selector shall start with "&"
 * "&:focus, &:active": {
 *   outline: "solid"
 * },
 *
 * // Self-references are also supported
 * "& + &": {
 *   color: "green"
 * }
 * ```
 */
export interface CSSRules {
  // '@media (....)'?: CSSAtMedia
  // '@supports (...)'?: CSSAtSupports
  // '@keyframes name'?: CSSAtKeyframes

  // | '@font-face'
  // | '@counter-style'
  // | '@property'

  /** Global defaults */
  // ':root'?: CSSProperties
  // '*'?: CSSProperties

  // TODO it would be great if we could use CSS Properties with mapped types to typechecked CSS rules
  [key: string]:
    | CSSProperties
    | CSSAtMedia
    | CSSAtSupports
    | CSSAtKeyframes
    | CSSRules
    | string
    | string[]
    | Falsy
    | CSSRulesThunk
}

export interface CSSRulesThunk {
  (context: Context):
    | CSSProperties
    | CSSAtMedia
    | CSSAtSupports
    | CSSAtKeyframes
    | CSSRules
    | CSSRulesThunk
    | string
    | string[]
    | Falsy
}
