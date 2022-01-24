/* eslint-env browser */

import { setup, cssom, dom, Sheet } from 'twind'
import config from '@twind/gatsby-plugin/config'

setup(
  {
    ...config,
    // in production use short hashed class names
    hash: config.hash ?? process.env.NODE_ENV == 'production',
  },
  (process.env.NODE_ENV == 'development' ? dom() : cssom()) as Sheet<HTMLStyleElement>,
)
