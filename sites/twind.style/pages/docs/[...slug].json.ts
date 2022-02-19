import { pages, hrefFromPath } from './[pages].json'

export function get({ params }: import('@sveltejs/kit').RequestEvent) {
  const href = hrefFromPath('./' + params.slug)
  const page = pages.get(href)

  if (!page) {
    return {
      status: 404,
    }
  }

  return {
    body: {
      title: page.title,
      excerpt: page.excerpt,
      editPath: page.editPath,
    },
  }
}

export interface Page {
  title: string
  excerpt?: string
  editPath: string
}
