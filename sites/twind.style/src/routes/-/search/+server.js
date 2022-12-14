import { dev, building } from '$app/environment'
import { createSearch } from '$lib/search'

export const prerender = true

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, fetch }) {
  if (building) {
    return new Response(JSON.stringify({ term: '', results: [] }), {
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  const data = await fetch('/-/search.json')

  if (!(data.ok && data.status === 200)) {
    throw new Error(`Loading search index failed: ${data.status}`)
  }

  return createSearch({ dev, ...(await data.json()) })(request)
}
