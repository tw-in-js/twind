/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: {
    example: '/',
    src: '/_dist_',
  },
  install: ['uvu', 'uvu/assert', 'snoop'],
  installOptions: {
    externalPackage: ['dlv', 'tailwindcss', 'jsdom', 'async_hooks'],
  },
  experiments: {
    routes: [
      // Prevent type only exports (eg empty modules) to break snowpack
      {
        src: '/_dist_/types/index.js',
        dest: (request, response) => {
          response.writeHead(200, { 'Content-Type': 'application/javascript' })
          response.end('')
        },
      },
    ],
  },
}
