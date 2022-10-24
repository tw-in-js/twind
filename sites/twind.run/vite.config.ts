import { sveltekit } from '@sveltejs/kit/vite'
import { fileURLToPath } from 'url'
import { searchForWorkspaceRoot, type UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [sveltekit()],

  worker: {
    format: 'es',
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

export default config
