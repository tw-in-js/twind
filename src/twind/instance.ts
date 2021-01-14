import type { Configuration, Instance, ThemeResolver, Theme, TWApply, TW, Context } from '../types'

import { configure } from './configure'
import { parse } from './parse'

export const create = (config?: Configuration): Instance => {
  // We are using lazy variables to trigger setup either
  // on first `setup` or `tw` call
  //
  // This allows to provide one-time lazy configuration
  //
  // These variables are not named `tw` and `setup`
  // as we use `tw` and `setup` to find the callee site
  // during stacktrace generation
  // This allows the error stacktrace to start at the call site.

  // Used by `tw`
  let process = (tokens: unknown[]): string => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    init()
    return process(tokens)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let theme = ((section: keyof Theme, key?: string | string[], defaultValue?: any) => {
    init()
    return theme(section, key as string, defaultValue)
  }) as ThemeResolver

  // Used by `setup`
  let init = (config?: Configuration): void => {
    // Replace implementation with configured ones
    // `process`: the real one
    // `init`: invokes `mode.report` with `LATE_SETUP_CALL`
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;({ process, init, theme } = configure(config))
  }

  // If we got a config, start right away
  if (config) init(config)

  // The instance methods delegate to the lazy ones.
  // This ensures that after setup we use the configured
  // `process` and `setup` fails.
  const tw = ((...tokens: unknown[]) => process(tokens)) as TW

  function toString(this: TWApply): string {
    return tw(this)
  }

  tw.apply = (...tokens: unknown[]): TWApply => {
    return Object.defineProperties(({ css }: Context) => css(parse(tokens)), {
      valueOf: {
        value: toString,
      },
      toString: {
        value: toString,
      },
      // Allow twind to generate a unique id for this directive
      // twind uses JSON.stringify which returns undefined for functions like this directive
      // providing a toJSON function allows to include this directive in the id generation
      toJSON: {
        value: () => tokens,
      },
    })
  }

  return {
    tw,

    setup: (config) => init(config),

    theme,
  }
}
