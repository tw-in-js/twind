import { renderToPipeableStream } from 'react-dom/server'

import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'

import TwindStream from '@twind/with-react/pipeableStream'

import tw from './twind'

const ABORT_DELAY = 5000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false

    const stream = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          const body = new TwindStream(tw)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          )

          stream.pipe(body)
        },
        onShellError: reject,
        onError(error) {
          didError = true

          console.error(error)
        },
      },
    )

    setTimeout(() => stream.abort(), ABORT_DELAY)
  })
}
