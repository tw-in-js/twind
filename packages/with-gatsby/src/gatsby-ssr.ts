/* eslint-env node */

import type { ReactElement } from 'react'
import type { ReplaceRendererArgs } from 'gatsby'

import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { extract } from '@twind/core'

import install from './install-twind'
install()

export function replaceRenderer({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}: ReplaceRendererArgs): void {
  const bodyHTML = renderToString(bodyComponent as ReactElement)
  const { html, css, json } = extract(bodyHTML)

  replaceBodyHTMLString(html)
  setHeadComponents([
    // <style data-twind>{css}</style>
    createElement('style', {
      'data-twind': '',
      dangerouslySetInnerHTML: {
        __html: css,
      },
    }),
    createElement('script', {
      type: 'application/json',
      'data-twind-cache': '',
      dangerouslySetInnerHTML: {
        __html: json,
      },
    }),
  ])
}
