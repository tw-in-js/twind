function withoutExtension(path: string) {
  // './reference.md' -> './reference'
  return path.replace(/\.(md|mdx|svx|svelte\.md)$/, '')
}

export function hrefFromPath(path: string) {
  // './reference.md' -> 'reference'
  return '/docs' + withoutExtension(path).slice(1)
}

interface Page {
  href: string
  section: string | undefined
  label: string | undefined
  title: string | undefined
  excerpt: string | undefined
  editPath: string
  prev?: string | undefined
  next: string | undefined
}

const pages = new Map<string | undefined, Page>()

for (const [path, { metadata = {} }] of Object.entries(
  import.meta.globEager(`./**/*.{md,mdx,svx,svelte.md}`),
)) {
  const href = hrefFromPath(path)

  // console.log(path, href, metadata)

  const { section, label, title, excerpt, next } = metadata

  pages.set(href, {
    href,
    section,
    label: label || title || href,
    title: title || label || href,
    excerpt,
    editPath: 'sites/twind.style/pages/docs' + path.slice(1),
    next: next && withoutExtension(new URL(next, 'http://x' + href).pathname),
  })
}

// update prev link
pages.forEach((value, href) => {
  const next = pages.get(value.next)

  if (next) {
    next.prev = href
  }
})

let startHref: string | undefined = undefined
for (const [href, entry] of pages) {
  if (entry.next && !entry.prev) {
    startHref = href
    break
  }
}

if (!startHref) startHref = pages.keys().next().value

const seen = new Set<Page>()
const sections = new Map<string | undefined, string[]>([[undefined, []]])
for (let current = pages.get(startHref); current; current = pages.get(current.next)) {
  seen.add(current)

  let section = sections.get(current.section)
  if (!section) {
    sections.set(current.section, (section = []))
  }

  section.push(current.href)
}

// collect those that are not linked
for (const current of pages.values()) {
  if (seen.has(current)) continue

  let section = sections.get(current.section)
  if (!section) {
    sections.set(current.section, (section = []))
  }

  section.push(current.href)
}

export { startHref, sections, pages }

export function get({ params }: import('@sveltejs/kit').RequestEvent) {
  if (params.pages == '$nav') {
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

  if (params.pages == '$start') {
    return {
      body: { startHref },
    }
  }

  return { fallthrough: true }
}

export interface Nav {
  sections: [section: string | null, hrefs: string[]][]
  pages: {
    [href: string]: { section?: string; label: string; prev?: string; next?: string }
  }
}
