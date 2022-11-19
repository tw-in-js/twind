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

const CDN_ORIGIN = 'https://cdn.jsdelivr.net'
const DEFAULT_VERSION = 'latest'

const WELL_KNOWN_PRESETS: Record<string, string> = {
  ext: '@twind/preset-ext',
  'container-queries': '@twind/preset-container-queries',
  'line-clamp': '@twind/preset-line-clamp',
  'tailwind-forms': '@twind/preset-tailwind-forms',
  // compat for Tailwind CSS Play CDN
  forms: '@twind/preset-tailwind-forms',
  typography: '@twind/preset-typography',
}

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext) {
    // Only GET requests work with this proxy.
    if (request.method !== 'GET') return MethodNotAllowed(request)

    const url = new URL(request.url)

    let targetURL: string | undefined
    let { pathname } = url

    // Cache API respects Cache-Control headers.
    // jsdelivr sends something like: `public, max-age=604800, s-maxage=43200`
    // we may need to adjust the value if a tag like latest, next or canary is used
    // other version are very specific
    let cacheControl: string | undefined

    if (pathname === '/favicon.ico') {
      targetURL = 'https://twind.style/favicon.ico'
    } else if (pathname.startsWith('/sm/') && pathname.endsWith('.map')) {
      // forward source map requests
      // /sm/6a8adc00c50122db980fa39db2d4346cd3483a7ac903c53b1246d9b9a1427158.map
      // sourcemap urls are very specific -> use cache-control from jsdelivr response
      targetURL = CDN_ORIGIN + pathname
    } else {
      // default version
      // /
      // /?presets=forms,typography,line-clamp
      // /forms,typography,line-clamp
      // explicit version
      // /@canary
      // /@canary?presets=forms,typography,line-clamp
      // /@canary/forms,typography,line-clamp
      const match = pathname.match(
        /^\/(?:@(latest|next|canary|dev|(?:0|[1-9]\d{0,9}?)(?:\.(?:0|[1-9]\d{0,9})){2}(?:-[^/]+)?)(?=$|\/))/,
      )
      let version = DEFAULT_VERSION

      if (match) {
        // versioned
        version = match[1]
        pathname = pathname.slice(match[0].length)
      }

      let hasTagVersion = !/^\d/.test(version)

      const modules = [
        `@twind/cdn${version && version !== 'latest' ? '@' + version : ''}`,
        pathname.slice(1),
        url.searchParams.get('presets') || '',
      ]
        .filter(Boolean)
        .join(',')
        .split(',')
        .map((specifier) => {
          const match = specifier.match(/^((?:@[^/]+\/)?[^/@]+)(?:@([^/]+))?(\/.+)?$/)

          if (match) {
            const { 1: id, 2: version = DEFAULT_VERSION, 3: path } = match

            hasTagVersion ||= !/^\d/.test(version)

            const preset = WELL_KNOWN_PRESETS[id]

            if (preset) {
              return (
                preset +
                (version && version !== 'latest' ? '@' + version : '') +
                (path ? '/' + path : '')
              )
            }
          } else {
            // no match just be sure to not cache forever
            hasTagVersion = true
          }

          return specifier
        })

      // -> https://cdn.jsdelivr.net/npm/twind
      // -> https://cdn.jsdelivr.net/combine/npm/@twind/cdn,npm/@twind/preset-ext
      targetURL =
        CDN_ORIGIN +
        (modules.length > 1 ? '/combine/' : '/') +
        modules.map((module) => `npm/${module}`).join(',')

      if (hasTagVersion) {
        // clients can cache for 4 hours, shared caches for 1 hour
        cacheControl = 'public, max-age=14400, s-maxage=3600'
      }
    }

    if (!targetURL) return NotFound(request)

    // Construct the target request
    const target = new Request(targetURL, request)

    const cache = (caches as CacheStorage & { readonly default: Cache }).default

    // Check whether the value is already available in the cache
    // if not, you will need to fetch it from origin, and store it in the cache
    // for future access
    let response = await cache.match(target)

    if (!response) {
      console.log(`Cache miss for ${request.url} - fetching from ${target.url}`)

      // If not in cache, get it from origin
      response = await fetch(target)

      if (cacheControl) {
        // Must use Response constructor to inherit all of response's fields
        response = new Response(response.body, response)

        // Any changes made to the response here will be reflected in the cached value
        response.headers.set('Cache-Control', cacheControl)
      }

      // Store the fetched response
      // Use waitUntil so you can return the response without blocking on
      // writing to cache
      context.waitUntil(cache.put(target, response.clone()))
    } else {
      console.log(`Cache hit for: ${request.url} - fetched from ${target.url}`)
    }

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
