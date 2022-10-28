import fs from 'node:fs'

import { read } from '$lib/markdown'

// relative to the working directory (sites/twind.style)
const docsPath = '../../documentation'

export let { startHref, pages, sections } = read({ slug: '/', cwd: docsPath })

fs.watch(docsPath, { recursive: true, persistent: false }, (event, filename) => {
  ;({ startHref, pages, sections } = read({ slug: '/', cwd: docsPath }))
})

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
  return {
    nav: {
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

// export interface Body {
//   sections: [section: string | null, hrefs: string[]][]
//   pages: {
//     [href: string]: { section?: string; label: string; prev?: string; next?: string }
//   }
// }
