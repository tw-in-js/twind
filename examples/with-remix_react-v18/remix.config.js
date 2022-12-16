/* eslint-env node */
// ONLY REQUIRED WITHIN THE TWIND MONOREPO
try {
  require('jiti/register')
} catch {
  // IGNORE
}

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  serverBuildPath: 'build/index.js',
  publicPath: '/build/',
  serverDependenciesToBundle: [
    '@twind/core',
    '@twind/preset-autoprefix',
    '@twind/preset-tailwind',
    '@twind/with-remix',
  ],
}
