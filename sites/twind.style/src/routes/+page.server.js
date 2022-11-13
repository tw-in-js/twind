import { transformFile } from '$lib/markdown/transform'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const content = await transformFile('../../documentation/introduction.md')

  return { content }
}
