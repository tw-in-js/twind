import type { Mode } from './types'

export const mode = (report: (message: string) => void): Mode => ({
  unknown(section, keypath, optional, context) {
    if (!optional) {
      // TODO hint about possible values, did you mean ...
      this.report({ id: 'UNKNOWN_THEME_VALUE', section, keypath }, context)
    }
  },

  report({id, ...info}) {
    // TODO message based on info
    let message = `[${id}] ${JSON.stringify(info)}`

    // Generate a stacktrace that starts at callee site
    const stack = (new Error(message).stack || message).split('at ')

    // Grap the message header - this includes line break and "at " indentation
    message = stack.shift() as string

    // Drop all frames until we hit the first `tw` or `setup` call
    for (let frame: string | undefined; (frame = stack.shift()) && !/(^|\.)(tw|setup) /.test(frame); ) {
      /* no-op */
    }

    // Put it back together
    report([message, ...stack].join('at '))
  },
})

export const warn = mode((message) => console.warn(message))

export const strict = mode((message) => {
  throw new Error(message)
})
