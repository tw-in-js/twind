import type { Handle } from '@sveltejs/kit'

import { extract, tw as tw$ } from 'twind'

export function withTwind(tw = tw$): Handle {
  return async function withTwind$({ event, resolve }) {
    const response = await resolve(event)

    if (response.headers?.get('content-type')?.startsWith('text/html')) {
      const body = await response.text()

      const { html, css } = extract(body, tw)

      return new Response(
        html.replace('</head>', `<style data-twind>${css}</style></head>`),
        response,
      )
    }

    return response
  }
}
