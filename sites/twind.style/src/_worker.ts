/// <reference types="@cloudflare/workers-types" />
// import type { EventContext } from '@cloudflare/workers-types'
import { createSearch } from './lib/search'
import data from '../build/-/search.json'
import { version } from '../build/_app/version.json'

const search = createSearch({ ...data, currentVersion: version })

export default {
  fetch(request: Request, env: { ASSETS: { fetch: typeof fetch } }, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname === '/-/search') {
      return search(request)
    }

    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return env.ASSETS.fetch(request)
  },
}
