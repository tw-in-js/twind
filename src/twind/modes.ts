import type { Mode } from '../types'

import { join, noop } from '../internal/util'

export const mode = (report: (message: string) => void): Mode => ({
  unknown(section, key = [], optional, context) {
    if (!optional) {
      // TODO hint about possible values, did you mean ...
      this.report({ id: 'UNKNOWN_THEME_VALUE', key: section + '.' + join(key) }, context)
    }
  },

  report({ id, ...info }) {
    return report(`[${id}] ${JSON.stringify(info)}`)
  },
})

export const warn = /*#__PURE__*/ mode((message) => console.warn(message))

export const strict = /*#__PURE__*/ mode((message) => {
  throw new Error(message)
})

export const silent = /*#__PURE__*/ mode(noop)
