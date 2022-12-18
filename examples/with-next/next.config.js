/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  reactStrictMode: true,
  experimental: {
    // THIS IS ONLY NEEDED WHEN USED INSIDE THE TWIND MONOREPO
    transpilePackages: [
      '@twind/core',
      '@twind/preset-autoprefix',
      '@twind/preset-tailwind',
      '@twind/with-next',
    ],
  },
}
