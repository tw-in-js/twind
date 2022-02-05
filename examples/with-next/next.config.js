/* eslint-env node */
// ONLY REQUIRED WITHIN THE TWIND MONOREPO
try {
  require('jiti/register')
} catch {
  // IGNORE
}

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
      'twind',
      '@twind/preset-autoprefix',
      '@twind/preset-ext',
      '@twind/preset-tailwind',
      '@twind/tailwind',
      '@twind/with-next',
    ]),
  ],
  {
    /* regular next.js config options here */
    reactStrictMode: true,
  },
)
