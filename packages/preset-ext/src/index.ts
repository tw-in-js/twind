import type { Preset } from '@twind/core'

import rules from './rules'
import variants from './variants'

export default function presetExt(): Preset {
  return {
    rules,
    variants,
    // theme: {
    //   extend: {
    //     // TODO this currently only work if nobody else overwrites extend.screens
    //     // https://windicss.org/features/responsive-design.html#custom-range
    //     // lg  => greater or equal than this breakpoint
    //     // <lg => smaller than this breakpoint
    //     // @lg => exactly this breakpoint range
    //     screens({ theme }) {
    //       const screens = theme('screens')
    //       const breakpoints: { key: string; min?: string; max?: string }[] = []

    //       for (const key in screens) {
    //         // | string
    //         // | { raw: string }
    //         // | { min: string; max?: string }
    //         // | { min?: string; max: string }
    //         const value = screens[key]
    //         if (typeof value == 'string') {
    //           breakpoints.push({ key, min: value })
    //         } else if (!('raw' in value || Array.isArray(value))) {
    //           breakpoints.push({ ...value, key })
    //         }
    //       }

    //       // sort
    //       // 150rem or 2250px

    //       return {}
    //     },
    //   },
    // },
  }
}
