import { transformFile } from '$/server/markdown/transform'
import { pages } from './index.json'

export async function get({ params }: import('@sveltejs/kit').RequestEvent) {
  const href = '/docs/' + params.slug
  const page = pages.get(href)

  if (!page) {
    return {
      status: 404,
    }
  }

  const prev = pages.get(page.prev)
  const next = pages.get(page.next)

  return {
    body: {
      section: page.section,
      title: page.title,
      excerpt: page.excerpt,
      content: await transformFile(page.path),
      file: page.file,
      prev: prev && { href: prev.href, label: prev.label },
      next: next && { href: next.href, label: next.label },
    },
  }
}

export interface Body {
  section?: string | undefined
  title: string
  excerpt?: string | undefined
  content: string
  file: string
  prev?: PageInfo | undefined
  next?: PageInfo | undefined
}

export interface PageInfo {
  href: string
  label: string
}
