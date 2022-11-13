import { data } from '$lib/documentation'

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  const { sections, pages } = await data

  return {
    nav: {
      sections: [...sections].filter(([, entries]) => entries.length),
      pages: Object.fromEntries(
        [...pages]
          .filter(([, page]) => page.nav)
          .map(([href, { section, label, prev, next }]) => [href, { section, label, prev, next }]),
      ),
    },
  }
}
