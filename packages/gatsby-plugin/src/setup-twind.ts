import { setup, getSheet } from 'twind'

import config from '@twind/gatsby-plugin/config'

export default function () {
  setup(
    {
      ...config,
      // in production use short hashed class names
      hash: config.hash ?? process.env.NODE_ENV == 'production',
    },
    getSheet(process.env.NODE_ENV != 'production'),
  )
}
