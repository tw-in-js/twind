import type { Mode } from './types'

export const mode = (report: (message: string) => void): Mode => ({
  unknown(section, keypath, optional, context) {
    if (!optional) {
      // TODO hint about possible values, did you mean ...
      // TODO stacktrace from callee [message, new Error().stack.split('at ').pop()].join(' ');
      this.report({ id: 'UNKNOWN_THEME_VALUE', section, keypath }, context)
    }
  },

  report(info) {
    // TODO message based on info
    report(`${info.id}: ${JSON.stringify(info)}`)
  },
})

export const warn = mode((message) => console.warn(message))

export const strict = mode((message) => {
  throw new Error(message)
})
