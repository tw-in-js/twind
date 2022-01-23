/* eslint-env node */

const { white, green } = require('@twind/tailwind/colors')

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
    `@twind/gatsby-plugin`,
    // {
    //   resolve: `@twind/gatsby-plugin`,
    //   options: {
    //     config: `./path/to/twind.config`
    //   }
    // },
    `gatsby-plugin-offline`,
  ],
}
