import flexsearch, { type CreateOptions } from 'flexsearch'

export type IndexOptions = { data?: (string | null)[][] } & CreateOptions

export function createIndex({ data = [], ...options }: IndexOptions = {}) {
  const index = new flexsearch.Document({
    preset: 'memory',
    // optimize: true,
    // resolution: 9,
    charset: 'latin:simple',
    language: 'en',
    // encode: 'extra',
    fastupdate: false,
    ...options,
    document: {
      id: 'id',
      // tag: 'category',
      index: [
        {
          field: 'title',
          tokenize: 'forward',
        },
        {
          field: 'content',
          tokenize: 'strict',
          minlength: 2,
        },
      ],
    },
  })

  for (const [key, value] of data) {
    index.import(key, value)
  }

  return index
}

export function createSearch({
  dev,
  store,
  currentVersion = typeof __SVELTEKIT_APP_VERSION__ === 'string'
    ? __SVELTEKIT_APP_VERSION__
    : undefined,
  ...options
}: {
  dev?: boolean
  currentVersion?: string
  store: {
    href: string
    section: string
    label: string
    category: string
    title: string
    content: string
  }[]
} & IndexOptions) {
  const index = createIndex({ cache: 50, ...options })

  // const categories = ['guides', 'packages', 'api']

  return (request: Request) => {
    const term = new URL(request.url).searchParams.get('q') || ''
    const expectedVersion = request.headers.get('x-app-version')
    const matchingVersion = expectedVersion && currentVersion && expectedVersion === currentVersion
    const needsUpdate = expectedVersion && currentVersion && expectedVersion !== currentVersion

    const results = term
      ? index
          .searchCache(term, 35, { suggest: true })
          .flatMap((x) => x.result)
          .slice(0, 35)
          .map((id) => {
            const value = store[id]

            return {
              href: value.href,
              section: value.section,
              label: value.label === value.title ? undefined : value.label,
              category: value.category,
              title: excerpt(value.title, term),
              excerpt: excerpt(value.content, term),
            }
          })
      : // TODO: sort by section?
        // title:guides
        // content:guides
        // title:packages
        // content:packages
        // title:api
        // content:api
        // .sort((a, b) => {
        //   const byCategory = categories.indexOf(a.category) - categories.indexOf(b.category)
        //   if (byCategory) return byCategory
        //   return 0
        // })
        []

    return new Response(JSON.stringify({ term, results, needsUpdate: needsUpdate || undefined }), {
      headers: {
        'content-type': 'application/json',
        vary: 'x-app-version',
        'cache-control': dev
          ? 'private, no-store'
          : matchingVersion
          ? // if current app version matches the client app version the response is immutable
            'public, max-age=604800, immutable'
          : // if different versions clients must re-validate
            'public, max-age=0, must-revalidate',
      },
    })
  }
}

function escape(text: string) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function excerpt(content: string, query: string) {
  if (!query) {
    return escape(content)
  }

  const index = content.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) {
    return escape(content.slice(0, 100))
  }

  const startIndex = index <= 20 ? 0 : content.lastIndexOf(' ', index - 15)
  const prefix = startIndex <= 5 ? content.slice(0, index) : `…${content.slice(startIndex, index)}`

  const lastIndex = index + query.length + (80 - (prefix.length + query.length))
  const endIndex = content.indexOf(' ', lastIndex)

  const suffix = content.slice(index + query.length, endIndex > 0 ? endIndex : lastIndex)

  return (
    escape(prefix) +
    `<mark>${escape(content.slice(index, index + query.length))}</mark>` +
    escape(suffix)
  )
}
