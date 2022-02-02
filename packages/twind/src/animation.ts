import type { CSSObject, CSSProperties, StringLike } from './types'

import { css } from './css'

export interface AnimationFunction {
  (animation: string | CSSProperties, waypoints: StringLike): StringLike
}

export type Animation = AnimationFunction & {
  [label: string]: AnimationFunction
}

export const animation = /* @__PURE__ */ new Proxy(
  function animation(animation: string | CSSProperties, waypoints: StringLike): StringLike {
    return animation$('animation', animation, waypoints)
  } as Animation,
  {
    get(target, name) {
      if (name in target) return target[name as string]

      return function namedAnimation(
        animation: string | CSSProperties,
        waypoints: StringLike,
      ): StringLike {
        return animation$(name as string, animation, waypoints)
      }
    },
  },
)

function animation$(
  label: string,
  animation: string | CSSProperties,
  waypoints: StringLike,
): StringLike {
  return {
    toString() {
      return css({
        label,
        ...(typeof animation == 'object' ? animation : { animation }),
        animationName: '' + waypoints,
      } as CSSObject)
    },
  } as StringLike
}
