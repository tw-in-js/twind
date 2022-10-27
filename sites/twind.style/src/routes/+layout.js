import '$lib/twind'

import { invalidateAll } from '$app/navigation'

export const prerender = true

if (import.meta.hot) {
  import.meta.hot.on('docs-update', () => {
    invalidateAll()
  })
}
