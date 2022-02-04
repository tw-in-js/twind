import { install as install$ } from 'twind'

import config from '@twind/gatsby-plugin/config'

export default function install() {
  return install$(config, process.env.NODE_ENV == 'production')
}
