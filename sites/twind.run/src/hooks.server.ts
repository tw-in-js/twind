import type { Handle, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import handleTwind from '@twind/with-sveltekit/hooks'

import { dev } from '$app/environment'

const handlers: Handle[] = [handleTwind()]

if (dev) {
  handlers.push(async ({ event, resolve }) => {
    if (!event.platform) {
      const { Miniflare, Log, LogLevel } = await import('miniflare')

      const mf = new Miniflare({
        log: new Log(LogLevel.INFO),
        liveReload: false,
        kvPersist: './.mf/kv',
        r2Persist: './.mf/r2',
        durableObjectsPersist: './.mf/do',
        cachePersist: './.mf/cache',
        // kvNamespaces: ['KVNamespace'],
        r2Buckets: ['WORKSPACES'],
        globalAsyncIO: true,
        globalTimers: true,
        globalRandom: true,

        script: `
          addEventListener("fetch", (event) => {
            event.waitUntil(Promise.resolve(event.request.url));
            event.respondWith(new Response(event.request.headers.get("X-Message")));
          });
          addEventListener("scheduled", (event) => {
            event.waitUntil(Promise.resolve(event.scheduledTime));
          });
        `,
      })

      event.platform = {
        env: {
          // KVNamespace: await mf.getKVNamespace('KVNamespace'),
          WORKSPACES: await mf.getR2Bucket('WORKSPACES'),
        },
      }
    }

    return resolve(event)
  })
}

export const handle = handlers.length > 1 ? sequence(...handlers) : handlers[0]

/** @type {import('@sveltejs/kit').HandleServerError} */
export const handleError: HandleServerError = ({ error, event }) => {
  return {
    message: 'Whoops!',
    stack: (error as Error).stack,
    ...(error as any),
  }
}
