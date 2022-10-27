import * as path from 'node:path'
import fg, { type Options as FastGlobOptions } from 'fast-glob'
import { findUpSync, pathExistsSync } from 'find-up'
import grayMatter from 'gray-matter'
const { read: readFile } = grayMatter

export interface Page {
  path: string
  href: string
  section: string | undefined
  label: string | undefined
  title: string | undefined
  excerpt: string | undefined
  file: string
  prev?: string | undefined
  next: string | undefined
}

export interface ReadOptions extends FastGlobOptions {
  slug?: string
  root?: string
  pattern?: string | string[]
}

export function read({
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

  for (const filename of fg.sync(pattern, { ...globOptions, cwd, ignore, absolute: true })) {
    const href = toHref(cwd, filename, slug)

    const { data: frontmatter } = readFile(filename)

    const { section, label, title, excerpt, next } = frontmatter

    pages.set(href, {
      path: filename,
      href,
      section,
      label: label || title || path.basename(filename),
      title: title || label || path.basename(filename),
      excerpt,
      file: path.relative(root, filename),
      next: next && toHref(cwd, path.resolve(path.dirname(filename), next), slug),
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

  return { startHref, pages, sections }
}

function toHref(cwd: string, file: string, slug = '/') {
  return slug + path.relative(cwd, omitExtension(file))
}

function omitExtension(file: string) {
  return file.replace(/\.[^.]+$/, '')
}
