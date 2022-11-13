// ensure any twind methods are called after twind has been installed

import install from '@twind/with-sveltekit'
import config from '../twind.config'

export const tw = install(config, import.meta.env.PROD)
export * from 'twind'
