import type { Context } from "./context";
import type { CSSRules } from "./css";
import type { Falsy } from "./util";

export type Plugin = string | CSSRules | DirectiveHandler

export type Plugins = Record<string, Plugin | undefined>

export interface DirectiveHandler {
  /**
   * Creates CSSRules based on `parameters`
   */
  (parameters: string[], context: Context, id: string): CSSRules | string | Falsy
}
