import type { InlineOptions } from '@twind/core'
import { tw as tw$, identity, consume, stringify, noop } from '@twind/core'

import diff from 'fast-diff'

export function createState(options: InlineOptions['tw'] | InlineOptions = {}) {
  const { tw = tw$, minify = identity } =
    typeof options == 'function' ? ({ tw: options } as InlineOptions) : options

  let buffer = ''
  let lastStyle: string | null = null
  let restoreCurrentState = noop

  return {
    push: (chunk: string): boolean => {
      buffer += chunk
      return lastStyle === null ? isShellReady(buffer) : isSuspenseChunkReady(buffer)
    },

    flush: (): string | undefined => {
      if (buffer) {
        const restore = tw.snapshot()

        restoreCurrentState()

        let html = consume(buffer, tw)
        const nextStyle = minify(stringify(tw.target), html)

        restoreCurrentState = tw.snapshot()

        restore()

        if (lastStyle === null) {
          // inital shell is ready
          html = html.replace('</head>', `<style data-twind>${nextStyle}</style></head>`)
        } else {
          // a suspense chunk
          const styleDiff: [offset: number, text: string][] = []

          let offset = 0
          for (const [type, text] of diff(lastStyle, nextStyle)) {
            if (type === 1) {
              // insert
              styleDiff.push([offset, text])
            }

            // must be equal: type === 0
            offset += text.length
          }

          if (styleDiff.length) {
            // add style patch script that will update the previously created style element content
            // but only if client side twind hasn't taken over yet (data-twind="claimed")

            // ;(function (style, diff) {
            //   if (style) {
            //     style.textContent = diff.reduce(function (textContent, change) {
            //       return textContent.slice(0, change[0]) + change[1] + textContent.slice(change[0])
            //     }, style.textContent || '')
            //   }
            // })(document.querySelector('style[data-twind=""]'), [])

            html = `<script>!function(e,n){e&&(e.textContent=n.reduce((function(e,n){return e.slice(0,n[0])+n[1]+e.slice(n[0])}),e.textContent||''))}(document.querySelector('style[data-twind=""]'),${JSON.stringify(
              styleDiff,
            )})</script>${html}`
          }
        }

        buffer = ''
        lastStyle = nextStyle

        return html
      }
    },
  }
}

function isShellReady(markup: string): boolean {
  return markup.endsWith('</body></html>')
}

function isSuspenseChunkReady(markup: string): boolean {
  return markup.endsWith('</script>')
}
