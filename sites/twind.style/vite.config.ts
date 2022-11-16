import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import fg from 'fast-glob'

import { sveltekit } from '@sveltejs/kit/vite'
import { searchForWorkspaceRoot, defineConfig } from 'vite'

export default defineConfig((env) => {
  const docsPath = path.resolve('../../documentation')

  return {
    plugins: [
      sveltekit(),
      env.command === 'serve' && {
        name: 'watch-external', // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394#63548394
        async buildStart() {
          for (const file of await fg('**/*.md', {
            cwd: docsPath,
            ignore: ['**/README.md'],
            absolute: true,
          })) {
            this.addWatchFile(file)
          }

          if (!process.env.CI) {
            try {
              fs.watch(docsPath, { recursive: true, persistent: false }, (event, filename) => {
                this.addWatchFile(path.resolve(docsPath, filename))
              })
            } catch (error) {
              if ((error as NodeJS.ErrnoException).code === 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM') {
                console.warn('watching for changes is not supported on this platform')
              } else {
                throw error
              }
            }
          }
        },

        handleHotUpdate({ file, timestamp, server }) {
          if (file.startsWith(docsPath)) {
            server.ws.send({
              type: 'custom',
              event: 'docs-update',
              data: { file },
            })
            return []
          }
        },
      },
    ],

    resolve: {
      // no browser condition because this is sometimes used for umd builds
      exportConditions: [
        env.mode,
        'esnext',
        'modern',
        'esmodules',
        'es2015',
        'module',
        'import',
        'require',
        'default',
        env.ssrBuild && 'node',
      ].filter(Boolean),
    },

    clearScreen: false,

    build: {
      sourcemap: !process.env.CI,
    },

    server: {
      fs: {
        // search up for workspace root
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
    },
  }
})
