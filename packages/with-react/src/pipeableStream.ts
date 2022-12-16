import { Transform } from 'node:stream'

import type { InlineOptions, InlineMinify } from '@twind/core'

import { createState } from './internal'

export type { InlineOptions, InlineMinify }

export default class InlineStream extends Transform {
  constructor(options?: InlineOptions['tw'] | InlineOptions) {
    const state = createState(options)

    super({
      transform(chunk: Buffer, encoding, callback) {
        if (state.push(chunk.toString())) {
          this._flush(callback)
        } else {
          callback()
        }
      },
      flush(callback) {
        const markup = state.flush()
        if (markup) {
          this.push(markup)
        }
        callback()
      },
    })
  }
}
