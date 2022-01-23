/* eslint-env browser */

import { setup, cssom, dom, Sheet } from 'twind'
import config from '@twind/gatsby-plugin/config'

setup(config, (process.env.NODE_ENV == 'development' ? dom() : cssom()) as Sheet<HTMLStyleElement>)
