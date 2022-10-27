// ensure any twind methods are called after twind has been setup
export * from 'twind'

import install from '@twind/with-sveltekit'
import config from '../twind.config'

install(config, import.meta.env.PROD)
