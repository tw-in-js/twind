import { data } from '$lib/documentation'

export const prerender = true

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const { search } = await data

  return new Response(JSON.stringify(search), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
