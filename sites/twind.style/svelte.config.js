import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      origin: 'https://twind.style',
    },
    serviceWorker: {
      // We are registering the service worker ourself in pages/_layout.svelte
      // to delay the registration and reducing Time to Interactive
      register: false,
    },
    csrf: {
      checkOrigin: true,
    },
  },
}

export default config
