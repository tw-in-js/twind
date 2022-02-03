// @ts-check
// THIS IS ONLY NEEDED WHEN USED INSIDE THE TWIND MONOREPO
import withPlugins from 'next-compose-plugins'
import withTM from 'next-transpile-modules'

/**
 * @type {import('next').NextConfig}
 **/
export default withPlugins(
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
