/* eslint-env serviceworker */

import { build, files, prerendered, version } from '$service-worker'

const CACHE_PREFIX = 'app-cache-'
const cacheName = `${CACHE_PREFIX}${version}`
const cachePromise = caches.open(cacheName)

addEventListener('install', (event) => {
  // @ts-expect-error
  event.waitUntil(
    cachePromise.then((cache) =>
      Promise.all([
        // re-use from existing cache for hashed files
        Promise.all(
          // immutable
          build.map((file) =>
            caches
              .match(file)
              .then((response) => (response ? cache.put(file, response) : cache.add(file))),
          ),
        ),

        // always force load these
        cache.addAll([
          // we are caching /_app/version.json because we want to use the cached version
          // until we can safely update
          '/_app/version.json',
          // within static
          // ...files.filter(file => !['_header', '_redirects'].includes(file)),
          // pathnames corresponding to prerendered pages and endpoints
          ...prerendered.map((path) => path.replace(/^\/$|(\/[^./]+)$/, '$1/index.html')),
        ]),
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
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== cacheName)
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
