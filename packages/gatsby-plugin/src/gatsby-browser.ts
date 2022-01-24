/* eslint-env browser */

import { setup, cssom, dom, Sheet } from 'twind'
import config from '@twind/gatsby-plugin/config'

setup(
  {
    // in production use short hashed class names
    hash: process.env.NODE_ENV == 'production',
    ...config,
  },
  (process.env.NODE_ENV == 'development' ? dom() : cssom()) as Sheet<HTMLStyleElement>,
)
