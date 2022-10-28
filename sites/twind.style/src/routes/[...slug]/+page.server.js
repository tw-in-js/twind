import { error } from '@sveltejs/kit'

import { transformFile } from '$lib/markdown/transform'
import { pages } from './+layout.server'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const href = '/' + params.slug
  const page = pages.get(href)

  if (!page) {
    throw error(401, 'Not found')
  }

  const prev = pages.get(page.prev)
  const next = pages.get(page.next)

  return {
    section: page.section,
    title: page.title,
    excerpt: page.excerpt,
    content: await transformFile(page.path),
    file: page.file,
    prev: prev && { href: prev.href, label: prev.label },
    next: next && { href: next.href, label: next.label },
  }
}

// export interface Body {
//   section?: string | undefined
//   title: string
//   excerpt?: string | undefined
//   content: string
//   file: string
//   prev?: PageInfo | undefined
//   next?: PageInfo | undefined
// }

// export interface PageInfo {
//   href: string
//   label: string
// }
