import fs from 'node:fs'

import { read } from '$lib/markdown'

// relative to the working directory (sites/twind.style)
const docsPath = '../../documentation'

export let data = read({ slug: '/', cwd: docsPath })

fs.watch(docsPath, { recursive: true, persistent: false }, () => {
  data = read({ slug: '/', cwd: docsPath })
})
