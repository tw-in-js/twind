import type { Prettier } from './prettier'

import prettier from 'prettier/esm/standalone.mjs'
import parserBabel from 'prettier/esm/parser-babel.mjs'
import parserHtml from 'prettier/esm/parser-html.mjs'
import parserMarkdown from 'prettier/esm/parser-markdown.mjs'
import parserPostcss from 'prettier/esm/parser-postcss.mjs'
import parserTypescript from 'prettier/esm/parser-typescript.mjs'

import { Layer } from '../../../../packages/twind/src/internal/precedence'

const defaults = { semi: false, trailingComma: 'all' }
const plugins = [parserBabel, parserHtml, parserMarkdown, parserPostcss, parserTypescript]

const api: Prettier = {
  async format(source, options) {
    return prettier.format(source, {
      ...defaults,
      ...options,
      plugins,
    })
  },

  async formatWithCursor(source, options) {
    return prettier.formatWithCursor(source, {
      ...defaults,
      ...options,
      plugins,
    })
  },

  async formatPreviewCSS(rules) {
    let source = ''
    let lastLayerName = ''
    for (const rule of rules) {
      const match = rule.match(/^\/\*!([\da-z]+),([\da-z]+)(?:,(.+?))?\*\//)

      if (match) {
        const style = rule.slice(match[0].length)
        const precedence = parseInt(match[1], 36)
        // const name = match[3]
        const layer = precedence & Layer.o
        const layerName =
          layer === Layer.d
            ? 'defaults'
            : layer === Layer.b
            ? 'base'
            : layer === Layer.c
            ? 'components'
            : layer === Layer.a
            ? 'aliases'
            : layer === Layer.u
            ? 'utilities'
            : 'overrides'

        if (lastLayerName !== layerName) {
          // if (lastLayerName) {
          //   source += `/* } */\n`
          // }
          lastLayerName = layerName
          source += `\n\n/* @layer ${layerName} */\n\n`
        }

        // if (name) {
        //   source += `/* ${name} */\n`
        // }
        source += `${style}\n`
      } else {
        source += `${rule}\n`
      }
    }

    // if (lastLayerName) {
    //   source += `/* } */\n`
    // }

    return this.format(source, { parser: 'css' })
  },
}

export default api
