/* eslint-env serviceworker */
/// env serviceworker
/// <reference no-default-lib="true"/>
/// <reference lib="es2020" />
/// <reference lib="WebWorker" />

const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis

import { build as immutables, version } from '$service-worker'

const CACHE_PREFIX = 'app-cache-'
const cacheName = `${CACHE_PREFIX}${version}`
const cachePromise = caches.open(cacheName)

// Precaching
//   - immutables
// Runtime caching
//   - /_app/version.json: network first - to detect new versions
//   - *: cache first

const NETWORK_FIRST = new Set(['/' + __SVELTEKIT_APP_VERSION_FILE__])

sw.addEventListener('install', (event) => {
  event.waitUntil(
    cachePromise.then((cache) =>
      // re-use from existing cache for hashed files
      Promise.all(
        immutables.map((file) =>
          caches.match(file).then((response) => {
            if (response) {
              return cache.put(file, response)
            }

            return cache.add(file)
          }),
        ),
      ),
    ),
  )
})

// Activate the worker after notification from client
sw.addEventListener('message', (event) => {
  if (event.data?.type === 'activate') {
    sw.skipWaiting()

    if (event.data.prefetch) {
      cachePromise
        .then((cache) => cache.addAll(event.data.prefetch))
        .catch((error) => console.warn(`Failed to prefetch`, event.data.prefetch, error))
    }
  }
})

// On version update, remove old cached files
sw.addEventListener('activate', (event) => {
  // event.waitUntil(
  //   (async function () {
  //     // Feature-detect
  //     if (sw.registration.navigationPreload) {
  //       // Enable navigation preloads!
  //       await sw.registration.navigationPreload.enable()
  //     }
  //   })(),
  // )

  sw.caches
    .keys()
    .then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== cacheName)
          .map((key) => caches.delete(key)),
      ),
    )
    .catch((error) => console.warn('Failed to cleanup old caches', error))
})

// Cache falling back to network strategy
sw.addEventListener('fetch', (event) => {
  let { request } = event

  if (request.method !== 'GET' || request.headers.has('range')) return

  const url = new URL(request.url)

  // only cache our resources
  if (url.origin === location.origin) {
    if (url.pathname === '/-/search') {
      // include x-app-version to create immutable response which can be cached
      request = new Request(request, { headers: { 'x-app-version': version } })
    }

    event.respondWith(NETWORK_FIRST.has(url.pathname) ? networkFirst(request) : cacheFirst(request))
  }
})

function networkFirst(request: Request) {
  return load(request).catch(async (error) => {
    // If the network is unavailable

    // Respond from the cache if we can
    const cached = await fromCache(request)
    if (cached) return cached

    throw error
  })
}

async function cacheFirst(request: Request) {
  const cached = await fromCache(request)
  if (cached) return cached

  return load(request)
}

async function fromCache(request: Request) {
  // If the network is unavailable, get

  // Respond from the cache if we can
  const cached = await (await cachePromise).match(request)
  if (cached) return cached

  // // Else, use the preloaded response, if it's there
  // const preloaded = await event.preloadResponse
  // if (preloaded) return preloaded
}

async function load(request: Request) {
  const response = await fetch(request)

  if (response.ok && response.type === 'basic') {
    await (await cachePromise).put(request, response.clone())
  }

  return response
}
