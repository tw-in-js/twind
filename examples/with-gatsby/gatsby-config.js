/* eslint-env node */

// ONLY REQUIRED WITHIN THE TWIND MONOREPO
try {
  require('jiti/register')
} catch {
  // IGNORE
}

const { white, green } = require('@twind/preset-tailwind/colors')

module.exports = {
  siteMetadata: {
    title: `Gatsby Starter Twind`,
    description: `Gatsby starter styled with Twind`,
    author: `@taylorbryant`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-twind`,
        short_name: `starter`,
        start_url: `/`,
        background_color: white,
        theme_color: green['500'],
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
    `gatsby-plugin-twind`,
    // {
    //   resolve: `gatsby-plugin-twind`,
    //   options: {
    //     config: `./path/to/twind.config`
    //   }
    // },
    `gatsby-plugin-offline`,
  ],
}
