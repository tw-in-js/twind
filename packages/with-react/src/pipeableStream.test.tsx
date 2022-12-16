import { text } from 'node:stream/consumers'

import { expect, test } from 'vitest'

import { twind, virtual } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'

import * as React from 'react'
import { renderToPipeableStream } from 'react-dom/server.node'
import TwindStream from './pipeableStream'

function App({ children }: { children?: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  )
}

function HelloWorld() {
  return <h1 className="text-3xl font-bold underline">Hello world!</h1>
}

test('renderToReadableStream', async () => {
  const tw = twind(
    {
      presets: [presetTailwind({ disablePreflight: true })],
    },
    virtual(true),
  )

  let caughtError: unknown | null = null

  const stream = renderToPipeableStream(
    <App>
      <HelloWorld />
    </App>,
    {
      onError(error) {
        caughtError = error
      },
    },
  )

  const body = stream.pipe(new TwindStream(tw))

  const result = await text(body)

  expect(caughtError).toBeNull()
  expect(result).toMatchSnapshot()
})

test('renderToReadableStream with suspense', async () => {
  const tw = twind(
    {
      presets: [presetTailwind({ disablePreflight: true })],
    },
    virtual(true),
  )

  let fullfilled = false
  let promise = null

  const useTimeout = (ms: number) => {
    // check if timeout already occurred.
    if (!fullfilled) {
      // if promise doesn't exist create and throw it.
      throw (promise ||= new Promise((resolve) => {
        setTimeout(() => {
          // on next attempt consider timeout completed.
          fullfilled = true
          // resolve promise (will ask react to re-render).
          resolve(null)
        }, ms)
      }))
    }
  }

  const HowAreYou = () => {
    useTimeout(5)
    return <p className="text-lg font-bold italic">How are you?</p>
  }

  let caughtError: unknown | null = null

  const stream = renderToPipeableStream(
    <App>
      <HelloWorld />
      <React.Suspense>
        <HowAreYou />
      </React.Suspense>
    </App>,
    {
      onError(error) {
        caughtError = error
      },
    },
  )

  const body = stream.pipe(new TwindStream(tw))

  const result = await text(body)

  expect(caughtError).toBeNull()
  expect(result).toMatchSnapshot()
})
