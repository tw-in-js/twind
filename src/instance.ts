import type { Configuration, Instance } from './types'

import { configure } from './process'

export const create = (config?: Configuration): Instance => {
  // We are using lazy variables to trigger setup either
  // on first `setup` or `process` (`tw`) call
  //
  // This allows to provide one-time lazy configuration

  // Used by `tw`
  let process = (tokens: unknown[]): string => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setup()
    return process(tokens)
  }

  let setup = (config?: Configuration): void => {
    // Replace implementation with configured ones
    // `process`: the real one
    // `setup`: is no op and invokes `mode.report` with `LATE_SETUP_CALL`
    ;({ process, setup } = configure(config))
  }

  // If we got a config, start right away
  if (config) setup(config)

  // The instance methods delegate to the lazy ones.
  // This ensures that after setup we use the configured
  // `process` and `setup` fails.
  return {
    tw: (...tokens: unknown[]) => process(tokens),

    setup: (config) => setup(config),
  }
}
