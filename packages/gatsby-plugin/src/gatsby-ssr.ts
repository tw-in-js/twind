/* eslint-env node */

import type { ReactElement } from 'react'
import type { ReplaceRendererArgs } from 'gatsby'

import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { setup, virtual, extract } from 'twind'

import config from '@twind/gatsby-plugin/config'

setup(config, virtual())

export function replaceRenderer({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}: ReplaceRendererArgs): void {
  const bodyHTML = renderToString(bodyComponent as ReactElement)
  const { html, css } = extract(bodyHTML)

  replaceBodyHTMLString(html)
  setHeadComponents([
    // <style data-twind>{css}</style>
    createElement('style', {
      'data-twind': true,
      dangerouslySetInnerHTML: {
        __html: css,
      },
    }),
  ])
}
