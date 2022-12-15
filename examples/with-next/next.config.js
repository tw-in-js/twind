/* eslint-env node */
// @ts-check
// THIS IS ONLY NEEDED WHEN USED INSIDE THE TWIND MONOREPO
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withPlugins(
  [
    withTM([
      '@twind/core',
      '@twind/preset-autoprefix',
      '@twind/preset-tailwind',
      '@twind/with-next',
    ]),
  ],
  {
    /* regular next.js config options here */
    reactStrictMode: true,
  },
)
