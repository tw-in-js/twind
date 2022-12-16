import type { InlineOptions, InlineMinify } from '@twind/core'

import { createState } from './internal'

export type { InlineOptions, InlineMinify }

const encoder = /* #__PURE__ */ new TextEncoder()
const decoder = /* #__PURE__ */ new TextDecoder()

export default class InlineStream extends TransformStream<Uint8Array, Uint8Array> {
  constructor(options?: InlineOptions['tw'] | InlineOptions) {
    const state = createState(options)

    const flush: TransformerFlushCallback<Uint8Array> = (controller) => {
      const markup = state.flush()
      if (markup) {
        controller.enqueue(encoder.encode(markup))
      }
    }

    super({
      transform(chunk, controller) {
        if (state.push(decoder.decode(chunk))) {
          return flush(controller)
        }
      },
      flush,
    })
  }
}
