import type { Configuration, Instance, ThemeResolver, Theme } from '../types'

import { configure } from './configure'

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
  return {
    tw: (...tokens: unknown[]) => process(tokens),

    setup: (config) => init(config),

    theme,
  }
}
