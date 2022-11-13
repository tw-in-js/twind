import '$lib/twind'

import { invalidateAll } from '$app/navigation'

if (import.meta.hot) {
  import.meta.hot.on('docs-update', () => {
    invalidateAll()
  })
}
