import { install as install$ } from 'twind'

import config from 'gatsby-plugin-twind/config'

export default function install() {
  return install$(config, process.env.NODE_ENV == 'production')
}
