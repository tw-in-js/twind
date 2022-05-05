import fs from 'fs'

import { read } from '$/server/markdown'

// relative to the working directory (sites/twind.style)
const docsPath = '../../documentation'

export let { startHref, pages, sections } = read({ slug: '/docs/', cwd: docsPath })

fs.watch(docsPath, { recursive: true, persistent: false }, (event, filename) => {
  ;({ startHref, pages, sections } = read({ slug: '/docs/', cwd: docsPath }))
})

export function get() {
  return {
    body: {
      sections: [...sections].filter(([, entries]) => entries.length),
      pages: Object.fromEntries(
        Array.from(pages, ([href, { section, label, prev, next }]) => [
          href,
          { section, label, prev, next },
        ]),
      ),
    },
  }
}

export interface Body {
  sections: [section: string | null, hrefs: string[]][]
  pages: {
    [href: string]: { section?: string; label: string; prev?: string; next?: string }
  }
}
