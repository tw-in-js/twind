import type { Context } from './context'
import type { CSSRules } from './css'
import type { Mode } from './mode'
import type { Plugins } from './plugins'
import type { Theme } from './theme'

export interface Preflight {
  (preflight: CSSRules, context: Context): CSSRules | undefined
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

export interface Injector<T = unknown> {
  /** Target the rules are inserted into. */
  target: T

  insert: (rule: string, index: number) => void
  // delete: (index: number) => void
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
