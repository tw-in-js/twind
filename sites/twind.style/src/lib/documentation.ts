import fs from 'node:fs'
import process from 'node:process'

import { read } from '$lib/markdown'

// relative to the working directory (sites/twind.style)
const docsPath = '../../documentation'

export let data = read({ slug: '/', cwd: docsPath })

if (!process.env.CI) {
  try {
    fs.watch(docsPath, { recursive: true, persistent: false }, () => {
      data = read({ slug: '/', cwd: docsPath })
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM') {
      console.warn('watching for changes is not supported on this platform')
    } else {
      throw error
    }
  }
}
