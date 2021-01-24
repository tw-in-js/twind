/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: {
    '../example': '/',
    '../src': '/_src_',
    '../dist': '/_dist_',
  },
  packageOptions: {
    knownEntrypoints: ['uvu', 'uvu/assert', 'snoop'],
    external: ['dlv', 'tailwindcss', 'jsdom', 'async_hooks', 'node:async_hooks'],
  },
  alias: {
    twind: '../src',
  },
  routes: [
    // Prevent type only exports (eg empty modules) to break snowpack
    {
      src: '/_src_/types/index.js',
      dest: (request, response) => {
        response.writeHead(200, { 'Content-Type': 'application/javascript' })
        response.end('')
      },
    },
  ],
}
