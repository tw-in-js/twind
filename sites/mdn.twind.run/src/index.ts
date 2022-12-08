/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

// clear previous cache
;(async (cache) => {
  for (const key of await cache.keys()) {
    await cache.delete(key)
  }
})((caches as CacheStorage & { readonly default: Cache }).default)

const MDN = 'https://developer.mozilla.org'
const ALLOWED_ORIGINS = [
  new URL('https://twind.run'),
  new URL('https://twind-run.pages.dev'),
  new URL('http://localhost'),
]

function isAllowed(originHeaderValue: string | null): originHeaderValue is string {
  if (!originHeaderValue) return false

  try {
    const origin = new URL(originHeaderValue)
    for (const allowedOrigin of ALLOWED_ORIGINS) {
      if (
        origin.protocol === allowedOrigin.protocol &&
        (origin.hostname === allowedOrigin.hostname ||
          origin.hostname.endsWith(`.${allowedOrigin.hostname}`))
      ) {
        return true
      }
    }
  } catch (error) {
    console.warn(`Invalid origin: ${origin}`, error)
  }

  return false
}

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext) {
    // Only GET requests work with this proxy.
    if (request.method !== 'GET') return MethodNotAllowed(request)

    const origin = request.headers.get('origin')
    if (!isAllowed(origin)) {
      return new Response(null, {
        status: 204,
        headers: {
          Vary: 'Origin',
        },
      })
    }

    const url = new URL(request.url)
    let { pathname } = url

    if (!(pathname.endsWith('index.json') || pathname === '/favicon.ico')) {
      return NotFound(request)
    }

    // Construct the target request
    const target = new Request(new URL(pathname, MDN), request)

    const cache = (caches as CacheStorage & { readonly default: Cache }).default

    // Check whether the value is already available in the cache
    // if not, you will need to fetch it from origin, and store it in the cache
    // for future access
    let response = await cache.match(target)

    if (!response) {
      console.log(`Cache miss for ${request.url} - fetching from ${target.url}`)

      // If not in cache, get it from origin
      response = await fetch(target, { redirect: 'follow' })

      // Store the fetched response
      // Use waitUntil so you can return the response without blocking on
      // writing to cache
      context.waitUntil(cache.put(target, response.clone()))
    } else {
      console.log(`Cache hit for: ${request.url} - fetched from ${target.url}`)
    }

    // Must use Response constructor to inherit all of response's fields
    response = new Response(response.body, response)

    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.append('Vary', 'Origin')

    return response
  },
}

function MethodNotAllowed(request: Request) {
  return new Response(`Method ${request.method} not allowed.`, {
    status: 405,
    headers: {
      Allow: 'GET',
    },
  })
}

function NotFound(request: Request) {
  return new Response(`Path ${new URL(request.url).pathname} not found.`, {
    status: 400,
  })
}
