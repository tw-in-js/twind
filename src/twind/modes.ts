import type { Mode } from '../types'

import { join, noop } from './util'

export const mode = (report: (message: string) => void): Mode => ({
  unknown(section, key = [], optional, context) {
    if (!optional) {
      // TODO hint about possible values, did you mean ...
      this.report({ id: 'UNKNOWN_THEME_VALUE', key: join([section, ...key], '.') }, context)
    }
  },

  report({ id, ...info }) {
    const message = `[${id}] ${JSON.stringify(info)}`
    // Generate a stacktrace that starts at callee site
    const stack = (new Error(message).stack || message).split('at ')

    // Drop all frames until we hit the first `tw` or `setup` call
    // We are using splice(1, 1) to keep the message header - this includes line break and "at " indentation
    for (
      let frame: string | undefined;
      (frame = stack.splice(1, 1)[0]) && !/(^|\.)(tw|setup) /.test(frame);

    ) {
      /* no-op */
    }

    // Put it back together
    return report(stack.join('at '))
  },
})

export const warn = mode((message) => console.warn(message))

export const strict = mode((message) => {
  throw new Error(message)
})

export const silent = mode(noop)
