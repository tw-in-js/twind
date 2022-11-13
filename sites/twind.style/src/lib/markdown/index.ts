import * as path from 'node:path'
import zlib from 'node:zlib'
import { promisify } from 'node:util'

import fg, { type Options as FastGlobOptions } from 'fast-glob'
import { findUpSync, pathExistsSync } from 'find-up'

import { createIndex } from '$lib/search'

import { readFile } from './read-cache'
import { sectionize } from './transform'

export interface Page {
  path: string
  href: string
  section: string | undefined
  label: string | undefined
  title: string | undefined
  description: string | undefined
  excerpt: string | undefined
  package: string | undefined
  playground: boolean | string | undefined
  example: boolean | string | undefined
  file: string
  /** include in nav */
  nav: boolean
  editLink: boolean
  prev?: string | undefined
  next: string | undefined
}

export interface ReadOptions extends FastGlobOptions {
  slug?: string
  root?: string
  pattern?: string | string[]
}

export async function read({
  slug = '/',
  cwd = process.cwd(),
  root = findUpSync(
    (directory) =>
      ['.git', 'pnpm-workspace.yaml', 'lerna.json'].some((file) =>
        pathExistsSync(path.join(directory, file)),
      )
        ? directory
        : undefined,
    { cwd, type: 'directory' },
  ) || cwd,
  pattern = '**/*.md',
  ignore = ['**/README.md'],
  caseSensitiveMatch = false,
  ...globOptions
}: ReadOptions = {}) {
  const pages = new Map<string | undefined, Page>()

  const index = createIndex()
  const store: {
    href: string
    section: string
    label: string
    category: string
    title: string
    content: string
  }[] = []

  await Promise.all(
    (
      await fg(pattern, { ...globOptions, cwd, ignore, absolute: true })
    ).map(async (filename) => {
      const href = toHref(cwd, filename, slug)

      const { data: frontmatter, content } = await readFile(filename)

      if (frontmatter.hidden) return
      if (frontmatter.draft && import.meta.env.PROD) return

      const {
        section = path.relative(cwd, filename).split('/')[0],
        package: packageName,
        label,
        title = packageName || label || path.relative(cwd, filename).replace(/\.md$/, ''),
        description,
        excerpt,
        playground,
        example,
        nav = true,
        editLink = true,
        next,
      } = frontmatter

      for (const block of (await sectionize(
        [`# ${title}`, description || excerpt || '', content].join('\n\n'),
      )) || []) {
        const id =
          store.push({
            href: block.rank === 1 ? href : `${href}#${block.anchor}`,
            section,
            label: label || title,
            category: section === 'Packages' ? (packageName ? 'packages' : 'api') : 'guides',
            title: block.title,
            content: block.content,
          }) - 1

        index.add({
          id,
          title: block.title,
          content: block.content,
        })
      }

      pages.set(href, {
        path: filename,
        href,
        section,
        label: label || title,
        title,
        description,
        excerpt: excerpt || description,
        package: packageName,
        playground,
        example,
        file: path.relative(root, filename),
        editLink,
        nav,
        next: next && toHref(cwd, path.resolve(path.dirname(filename), next), slug),
      })
    }),
  )

  // we can not really know when the export is finished
  // flexsearch uses setTimeout internally - just wait for a moment
  const exported = await new Promise<[key: string, data: string][]>((resolve) => {
    const exported: [key: string, data: string][] = []
    let doneRef = setTimeout(resolve, 50, exported)

    index.export((key: string, data: string) => {
      // you need to store both the key and the data!
      // e.g. use the key for the filename and save your data
      exported.push([key, data])
      clearTimeout(doneRef)
      doneRef = setTimeout(resolve, 250, exported)
    })
  })

  // console.debug(index.info())
  // console.time('suggest:t')
  // console.debug(...index.search('t', 100, { suggest: true, enrich: true }))
  // console.timeEnd('suggest:t')

  // console.time('suggest:tx')
  // console.debug(...index.search('tx', 100, { enrich: true }))
  // console.timeEnd('suggest:tx')

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
    if (current.nav === false) continue

    let section = sections.get(current.section)
    if (!section) {
      sections.set(current.section, (section = []))
    }

    section.push(current.href)
  }

  // collect those that are not linked
  for (const current of pages.values()) {
    if (seen.has(current)) continue
    if (current.nav === false) continue

    let section = sections.get(current.section)
    if (!section) {
      sections.set(current.section, (section = []))
    }

    section.push(current.href)
    section.sort()
  }

  return { startHref, pages, sections, search: { store, data: exported } }
}

function toHref(cwd: string, file: string, slug = '/') {
  return slug + path.relative(cwd, omitExtension(file)).replace(/\/index$/, '')
}

function omitExtension(file: string) {
  return file.replace(/\.[^.]+$/, '')
}
