import adapter from '@sveltejs/adapter-cloudflare'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      concurrency: 1,
      entries: ['*', '/manifest.json', '/msapplication-config.xml'],
    },
    csrf: {
      checkOrigin: true,
    },
  },
}

export default config
