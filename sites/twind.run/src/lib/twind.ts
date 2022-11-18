// ensure any twind methods are called after twind has been setup
export * from '@twind/core'

import install from '@twind/with-sveltekit'
import config from '../twind.config'

// in production this file is in same chunk as the preview.api and will be loaded in the preview iframe
// by checking if this script is NOT loaded in the iframe we prevent installing in the preview
if (typeof top !== 'object' || top === self) {
  install(config, import.meta.env.PROD)
}
