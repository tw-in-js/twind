import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      origin: 'https://twind.style',
    },
    version: {
      // every 5 minutes
      pollInterval: 5 * 60 * 1000,
    },
    serviceWorker: {
      // We are registering the service worker ourself in pages/_layout.svelte
      // to delay the registration, reducing Time to Interactive, and show a notification
      register: false,
      files(file) {
        return !['.cache.json', '_headers', '_redirects'].includes(file)
      },
    },
    csrf: {
      checkOrigin: true,
    },
  },
}

export default config
