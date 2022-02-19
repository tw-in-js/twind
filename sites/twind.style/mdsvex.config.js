/* eslint-env node */

import remarkGithub from 'remark-github'
import remarkAbbr from 'remark-abbr'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeToc from 'rehype-toc'

import shiki from 'shiki'
import { parseMeta } from './src/code.js'

// slack-dark, github-dark-dimmed, one-dark-pro, poimandres
const highlighterPromise = shiki.getHighlighter({ theme: 'one-dark-pro' })

const config = {
  extensions: ['.svx', '.mdx', '.md'],
  smartypants: {
    dashes: 'oldschool',
  },
  /** @type {import('mdsvex').MdsvexOptions['highlight']} */
  highlight: {
    async highlighter(code, lang, metastring) {
      // console.log({ code, lang, metastring })
      // metastring: app.js highlight=2-4 focus=1,3-4
      const meta = parseMeta(code, lang, metastring)

      code = meta.code
      lang = meta.lang
      const { filename, isDiff, lineOptions } = meta

      // console.dir({ lang, isDiff, filename, lineOptions }, { depth: null })

      const highlighter = await highlighterPromise

      if (lang && !highlighter.getLoadedLanguages().includes(lang)) {
        console.warn(`Unrecognised language: ${lang}`)
        lang = undefined
      }

      let html = highlighter
        .codeToHtml(
          // replace `**...**` with Zero Width Space for marker replacement down below
          code.replace(/\*\*(?!=| *\d+ *)(.+?)\*\*/g, '\u200B$1\u200B'),
          { lang, lineOptions },
        )
        // replace `**...**` with marker
        .replace(/\u200B([^\u200B]+?)\u200B/g, (_, text) => `<mark>${text}</mark>`)
        // replace braces as they would be interpreted by svelte
        .replace(/{/g, '&#123;')
        .replace(/}/g, '&#125;')

      // add lang id
      // TODO: .line {width: 100%; display: inline-block;}
      // TODO: .line:hover {  } .line:focus {  }
      /** @type {string[]} */
      const attributes = [`class="code-block"`]

      if (lang) {
        attributes.push(`data-lang="${lang}"`)
      }

      if (isDiff) {
        attributes.push(`data-diff`)
      }

      if (filename) {
        attributes.push(`data-filename="${filename}"`)
      }

      // console.log(html)
      // <pre class="shiki" style="background-color: #282c34"><code>...</code></pre>

      // using @html reduces the file size prevent svelte element factories
      return `{@html ${JSON.stringify(`<div ${attributes.join(' ')}>${html}</div>`)}}`
    },
  },
  remarkPlugins: [
    remarkAbbr,
    // TODO: remarkA11yEmoji,
    // TODO: remarkGfm,
    [remarkGithub, { repository: 'https://github.com/tw-in-js/twind.git' }],
    // TODO: https://github.com/kevin940726/remark-codesandbox
  ],
  rehypePlugins: [
    rehypeSlug,
    // TODO: wrap in {@html ....}
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'wrap',
        properties: {
          class: `flex items-center no-underline before:(invisible -ml-5 pr-3 text-brand-12 text-sm content-['#']) hover:before:visible`,
        },
      },
    ],
    [
      rehypeToc,
      {
        customizeTOC(toc) {
          // TODO: wrap in {@html ....}
          if (!toc.children[0].children.length) {
            return { type: 'text', value: '' }
          }

          toc.properties.role = 'directory'
          toc.properties['aria-label'] = 'Table of contents'

          for (const node of walk([toc])) {
            if (node.properties?.className) {
              const kind = node.properties.className.split(' ')[0]
              const level = node.properties.className.slice(-1)

              node.properties.className =
                {
                  toc: `not-prose w-64 py-10 hidden xl:block fixed top-16 bottom-0 right-[max(0px,calc(50%-45rem))] overflow-y-auto text-sm leading-6 before:(block content-['On_this_page'] text-accent-12 font-semibold mb-4)`,
                  'toc-level': level == '1' ? `list-none` : `ml-${level == '2' ? 4 : 2} list-['›']`,
                  'toc-item': level == '2' ? 'font-medium' : 'pl-2',
                  'toc-link': `block py-1 mr-4 hover:text-brand-12 transition-colors duration-300 ease-in-out`,
                }[kind] || kind
            }
          }

          function* walk(nodes) {
            for (const node of nodes) {
              yield node

              if (node.children) {
                yield* walk(node.children)
              }
            }
          }
        },
      },
    ],
    // TODO: configure https://github.com/rehypejs/rehype-external-links
    // mdsvex already includes it?
    // [rehypeExternalLinks, { target: "_blank" }],
  ],
}

export default config
