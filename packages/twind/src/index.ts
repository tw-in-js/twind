import { defineConfig, twind, cssom, observe } from '@twind/core'

import autoprefix from '@twind/preset-autoprefix'
import tailwind from '@twind/preset-tailwind'

// This would be in twind.config.js
const config = defineConfig({
  presets: [
    autoprefix(),
    tailwind(),
    // lineClamp(),
    // capsize(),
  ],
  // // TODO load from script block or __twindConfig
  // // TODO use twind-config script by default
})

export const tw = observe(twind(config, cssom()))
