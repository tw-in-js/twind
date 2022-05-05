import grayMatter from 'gray-matter'
const { read: readFile } = grayMatter

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import * as shiki from 'shiki'

import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
// @ts-ignore
// import remarkAbbr from 'remark-abbr'
import remarkCode from './remark-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeToc from 'rehype-toc'
import tokyoNightLight from './themes/tokyo-night-light.json'
import tokyoNightDark from './themes/tokyo-night-storm.json'

export async function transformFile(file: string): Promise<string> {
  const { content } = readFile(file)

  // console.log({ id, frontmatter })
  return (
    unified()
      .use(remarkParse)
      // TODO: https://github.com/sergioramos/remark-hint with custom classes
      // TODO: .use(remarkAbbr)
      // TODO: remarkA11yEmoji,
      .use(remarkGfm)
      .use(remarkGithub, { repository: 'https://github.com/tw-in-js/twind.git' })
      .use(remarkCode, {
        themes: {
          light: tokyoNightLight as any,
          dark: tokyoNightDark as any,
        },
      })
      // TODO: https://github.com/kevin940726/remark-codesandbox
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw) // *Parse* the raw HTML strings embedded in the tree
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          class: `flex items-center no-underline before:(invisible -ml-5 pr-3 text-brand-12 text-sm content-['#']) hover:before:visible`,
        },
      })
      .use(rehypeToc, {
        customizeTOC(toc) {
          if (!toc) return toc

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
      })
      // TODO: configure https://github.com/rehypejs/rehype-external-links
      // mdsvex already includes it?
      // [rehypeExternalLinks, { target: "_blank" }],

      .use(rehypeStringify)
      .process(content)
      // TODO: replace &#x26; in extract
      .then((vfile) => String(vfile).replace(/&#x26;/g, '&'))
  )
}
