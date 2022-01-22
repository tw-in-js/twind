/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { extract } from 'twind'

import { setup } from 'twind'
import config from './twind.config'

setup(config)

export function replaceRenderer({ bodyComponent, replaceBodyHTMLString, setHeadComponents }) {
  const bodyHTML = renderToString(bodyComponent)
  const { html, css } = extract(bodyHTML)

  replaceBodyHTMLString(html)
  setHeadComponents([
    // <style data-twind>{css}</style>
    createElement('style', {
      'data-twind': '',
      dangerouslySetInnerHTML: {
        __html: css,
      },
    }),
  ])
}
