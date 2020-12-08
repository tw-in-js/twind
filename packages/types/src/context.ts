import type { TW } from './instance'
import type { ThemeResolver } from './theme'

export interface Context {
  /** Allow composition */
  readonly tw: TW

  /** Access to theme values */
  readonly theme: ThemeResolver

  /** Create unique identifier (group, custom properties) */
  readonly tag: (key: string) => string
}
