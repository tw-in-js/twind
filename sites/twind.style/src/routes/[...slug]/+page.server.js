import { error } from '@sveltejs/kit'
import { data } from '$lib/documentation'
import { transform, transformFile, extractExcerpt } from '$lib/markdown/transform'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const { pages } = await data

  const href = '/' + params.slug
  const page = pages.get(href)

  if (!page) {
    throw error(401, 'Not found')
  }

  const prev = pages.get(page.prev)
  const next = pages.get(page.next)

  const [description, excerpt, content, badges] = await Promise.all([
    page.description || (page.excerpt && extractExcerpt(page.excerpt)),
    (page.excerpt && transform(page.excerpt)) || page.description,
    transformFile(page.path),
    page.package && renderBadges(page.package),
  ])

  const folder = page.package && getFolder(page.package)

  return {
    section: page.section,
    label: page.label,
    title: page.title,
    description,
    excerpt,
    badges,
    content,
    package: page.package,
    folder,
    playground: page.playground === true ? folder : page.playground,
    example: page.example === true ? folder : page.example,
    file: page.file,
    editLink: page.editLink,
    prev: prev && { href: prev.href, label: prev.label, section: prev.section },
    next: next && { href: next.href, label: next.label, section: next.section },
  }
}

/**
 * @param {string} pkg
 */
function renderBadges(pkg) {
  const folder = getFolder(pkg)

  return transform(
    [
      `[![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/main/LICENSE)`,
      `[![Latest Release](https://flat.badgen.net/npm/v/${pkg}?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/${pkg})`,
      `[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23${folder}?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/packages/${folder})`,
    ].join(' '),
  )
}

/**
 * @param {string} pkg
 */
function getFolder(pkg) {
  return pkg
    .replace(/^([^-]+)-plugin-twind$/, '@twind/with-$1')
    .split('/')
    .pop()
}
