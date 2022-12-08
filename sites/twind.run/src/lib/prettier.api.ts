import type { Options } from 'prettier'
import type { Prettier } from './prettier'

import prettier from 'prettier/esm/standalone.mjs'
// import parserBabel from 'prettier/esm/parser-babel.mjs'
// import parserHtml from 'prettier/esm/parser-html.mjs'
// import parserMarkdown from 'prettier/esm/parser-markdown.mjs'
// import parserPostcss from 'prettier/esm/parser-postcss.mjs'
// import parserTypescript from 'prettier/esm/parser-typescript.mjs'

import { Layer } from '../../../../packages/core/src/internal/precedence'

const defaults = { useTabs: false, semi: false, trailingComma: 'all', bracketSameLine: false }

const plugins = [
  {
    detect: (parser: string) =>
      /^[mc]?jsx?$/.test(parser)
        ? 'babel'
        : /^[mc]?tsx?$/.test(parser)
        ? 'babel-ts'
        : /^json5?$/.test(parser) && parser,
    load: () => import('prettier/esm/parser-babel.mjs').then((m) => m.default),
  },
  {
    detect: (parser: string) => /^html?$/.test(parser) && 'html',
    load: () => import('prettier/esm/parser-html.mjs').then((m) => m.default),
  },
  {
    detect: (parser: string) => /^(le|s?c)ss$/.test(parser) && parser,
    load: () => import('prettier/esm/parser-postcss.mjs').then((m) => m.default),
  },
]

async function getOptions(options?: Options) {
  let parser = options?.parser || /(?:\.([^.]+))?$/.exec(options?.filepath || '')?.[1]

  if (typeof parser === 'string') {
    for (const plugin of plugins) {
      const found = plugin.detect(parser)
      if (found) {
        return {
          ...defaults,
          ...options,
          parser: found,
          plugins: [await plugin.load()],
        }
      }
    }
  }

  return {
    ...defaults,
    ...options,
    plugins: Promise.all(plugins.map((plugin) => plugin.load())),
  }
}

const api: Prettier = {
  async format(source, options) {
    return prettier.format(source, await getOptions(options))
  },

  async formatWithCursor(source, options) {
    return prettier.formatWithCursor(source, await getOptions(options))
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
