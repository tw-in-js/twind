/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: ['@snowpack/plugin-svelte'],
  install: [
    /* ... */
  ],
  installOptions: {
    packageLookupFields: ['esnext'],
    installTypes: true,
    rollup: {
      context: 'self',
    },
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    baseUrl: '/',
  },
  proxy: {
    /* ... */
  },
  alias: {
    '@tw-in-js/core': '@tw-in-js/core/dist/esnext/core.js',
    '@tw-in-js/types': '@tw-in-js/types/dist/esnext/types.js',
  },
}
