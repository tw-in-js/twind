import adapter from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // default options are shown
      out: 'build',
      precompress: true,
      env: {
        host: 'HOST',
        port: 'PORT',
      },
    }),
  },
}

export default config
