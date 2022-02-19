/* eslint-env node */

import * as path from 'path'
import adapter from '@sveltejs/adapter-static'
import { searchForWorkspaceRoot } from 'vite'
import md from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.html', ...mdsvexConfig.extensions],
  preprocess: [md.mdsvex(mdsvexConfig)],

  kit: {
    // TODO: csp — https://kit.svelte.dev/docs/configuration#csp
    // TODO: https://kit.svelte.dev/docs/service-workers
    files: {
      // a place to put static files that should have stable URLs and undergo no processing,
      // such as favicon.ico or manifest.json
      assets: 'static',
      routes: 'pages',
    },
    adapter: adapter(),
    prerender: {
      concurrency: 1,
      entries: ['*', '/manifest.json', '/msapplication-config.xml'],
      onError({ path, referenceType, referrer, status }) {
        if (path.startsWith('/cdn-cgi/image/')) {
          return
        }

        throw new Error(
          `${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`,
        )
      },
    },
    serviceWorker: {
      // We are registering the service worker ourself in pages/_layout.svelte
      // to delay the registration and reducing Time to Interactive
      register: false,
    },
    vite: {
      resolve: {
        alias: {
          $: path.resolve('src'),
          '@': path.resolve('pages'),
          '#': path.resolve('assets'),
        },
      },

      optimizeDeps: {
        esbuildOptions: {
          resolveExtensions: ['.tsx', '.ts', '.jsx', '.mjs', '.js', '.css', '.json'],
        },
      },

      server: {
        fs: {
          strict: false,
          allow: [
            // search up for workspace root
            searchForWorkspaceRoot(process.cwd()),
            path.resolve('assets'),
          ],
        },
      },
    },
  },
}

export default config
