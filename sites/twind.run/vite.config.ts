import { fileURLToPath } from 'node:url'
import { sveltekit } from '@sveltejs/kit/vite'
import { searchForWorkspaceRoot, defineConfig } from 'vite'

import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'

export default defineConfig((env) => {
  return {
    plugins: [sveltekit()],

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

    worker: {
      format: env.mode === 'development' ? 'es' : 'iife',
      plugins: [
        {
          name: 'fix-umd-imports',
          enforce: 'pre',
          resolveId(source, importer, options) {
            return this.resolve(source, importer, { ...options, skipSelf: true }).then(
              (resolved) => {
                if (resolved.id?.includes('/@jridgewell/') && resolved.id.endsWith('.umd.js')) {
                  resolved.id = resolved.id.replace(/\.umd\.js$/, '.mjs')
                }
                return resolved
              },
            )
          },
        },
        env.mode !== 'development' &&
          commonjs({
            sourceMap: false,
          }),
        env.mode !== 'development' &&
          nodePolyfills({
            // transform all files, including all files including any source files
            include: null,
          }),
        {
          name: 'resolve-to-location',
          resolveFileUrl({ fileName }) {
            return `new URL('${fileName}',location.href).href`
          },
        },
      ].filter(Boolean),
      rollupOptions: {
        output: {
          inlineDynamicImports: env.mode !== 'development',
        },
      },
    },

    clearScreen: false,

    server: {
      fs: {
        // search up for workspace root
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
      watch: {
        ignored: [fileURLToPath(new URL('.mf/**', import.meta.url))],
      },
    },
  }
})
