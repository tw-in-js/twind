/* eslint-env serviceworker */

import { build } from '$service-worker'

// we are caching /_app/version.json because we want to use the cached version
// until we can safely update
const staticFiles = [
  '/_app/version.json',
  '/twind-logo-animated.svg',
  '/docs/$start.json',
  // not adding '/docs/$nav.json' as it is explicitly loaded to detect endpoints
]

// Do not cache images as they are/should be transform by cloudflare /cdn-cgi/image/
// they will be cached on first access
const hashedFiles = build.filter((file) => !/\.(jpe?g|png|gif|webp)$/.test(file))

const namePromise = crypto.subtle
  .digest(
    'sha-1',
    new TextEncoder().encode(JSON.stringify([...hashedFiles, ...staticFiles].sort())),
  )
  .then(
    (buffer) =>
      'app-cache-' +
      Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join(''),
  )

const cachePromise = namePromise.then((name) => caches.open(name))

addEventListener('install', (event) => {
  // @ts-expect-error
  event.waitUntil(
    cachePromise.then((cache) =>
      Promise.all([
        // re-use from existing cache
        Promise.all(
          hashedFiles.map((file) =>
            caches
              .match(file)
              .then((response) => (response ? cache.put(file, response) : cache.add(file))),
          ),
        ),

        // always load these
        cache.addAll(staticFiles),

        // load endpoints
        load('/docs/$nav.json', cache).then(async (response) => {
          if (response.ok && response.type === 'basic') {
            const nav = await response.json()

            await cache.addAll(Object.keys(nav?.pages || {}).map((href) => `${href}.json`))
          }
        }),
      ]),
    ),
  )
})

// Activate the worker after notification from client
addEventListener('message', (event) => {
  if (event.data?.type === 'activate') {
    // @ts-expect-error
    skipWaiting()

    if (event.data.prefetch) {
      cachePromise
        .then((cache) => cache.addAll(event.data.prefetch))
        .catch((error) => console.warn(`Failed to prefetch`, event.data.prefetch, error))
    }
  }
})

// On version update, remove old cached files
addEventListener('activate', (event) => {
  // @ts-expect-error
  event.waitUntil(
    Promise.all([namePromise, caches.keys()]).then(([name, keys]) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('app-cache-') && key !== name)
          .map((key) => caches.delete(key)),
      ),
    ),
  )
})

// Cache falling back to network strategy
addEventListener('fetch', (event) => {
  // @ts-expect-error
  const { request } = event

  if (request.method !== 'GET' || request.headers.has('range')) return

  const url = new URL(request.url)

  // only cache our resources
  if (url.origin === location.origin) {
    // @ts-expect-error
    event.respondWith(
      cachePromise.then(async (cache) => {
        // Respond from the cache if we can
        const cachedResponse = await cache.match(request)
        if (cachedResponse) return cachedResponse

        // Else, use the preloaded response, if it's there
        // @ts-expect-error
        const preloadResponse = await event.preloadResponse
        if (preloadResponse) return preloadResponse

        // Else try the network.
        return load(request, cache)
      }),
    )
  }
})

function load(request: RequestInfo, cache: Cache) {
  return fetch(request).then((response) => {
    if (response.ok && response.type === 'basic') {
      cache.put(request, response.clone())
    }
    return response
  })
}
