/* eslint-env node */

// esbuild-register is used to support ES modules like `twind.config.js`
require('esbuild-register/dist/node').register({ target: 'node14' })

const { default: twindConfig } = require('./twind.config')

module.exports = {
  siteMetadata: {
    title: `Gatsby Starter Twind`,
    description: `Gatsby starter styled with Twind`,
    author: `@taylorbryant`,
  },
  flags: {
    // FAST_DEV: true,
    // DEV_SSR: true,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-twind`,
        short_name: `starter`,
        start_url: `/`,
        background_color: twindConfig.theme.colors.white,
        theme_color: twindConfig.theme.colors.green['500'],
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
    // {
    //   resolve: `@twind/gatsby-plugin`,
    //   options: {
    //     config: twindConfig,
    //   },
    // },
    `gatsby-plugin-offline`,
  ],
}
