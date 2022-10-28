import grayMatter from 'gray-matter'
const { read: readFile } = grayMatter

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypePresetMinify from 'rehype-preset-minify'
// import * as shiki from 'shiki'

import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkGithubAdmonitions from 'remark-github-beta-blockquote-admonitions'

// @ts-ignore
// import remarkAbbr from 'remark-abbr'
import remarkCode from './remark-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeToc from 'rehype-toc'
// https://github.com/GaiAma/Coding4GaiAma/tree/HEAD/packages/rehype-accessible-emojis
// https://github.com/mrzmmr/rehype-partials
// https://github.com/kamranayub/remark-typedoc-symbol-links

import tokyoNightLight from './themes/tokyo-night-light.json'
import tokyoNightDark from './themes/tokyo-night-storm.json'

function getAdmonitionColor(title: string) {
  switch (title) {
    case 'note': // 🧚
      return 'brand'
    case 'tip': // 💡
      return 'success'
    case 'hint': // ✨
      return 'info'
    case 'important': // 📣 💥
      return 'accent'
    case 'caution': // 🧨
      return 'error'
    case 'warning': // 🚨
      return 'warning'
  }

  return 'neutral'
}

function getAdmonitionIcon(title: string) {
  switch (title) {
    case 'note':
      return '🧚'
    case 'tip':
      return '💡'
    case 'hint':
      return '✨'
    case 'important':
      return '📣'
    case 'caution':
      return '🧨'
    case 'warning':
      return '🚨'
  }

  return '💥'
}

export async function transformFile(file: string): Promise<string> {
  const { content } = readFile(file)

  // console.log({ id, frontmatter })
  return (
    unified()
      .use(remarkParse)
      // TODO: https://github.com/sergioramos/remark-hint with custom classes
      // TODO: .use(remarkAbbr)
      // TODO: remarkA11yEmoji,
      // https://learn.microsoft.com/en-us/contribute/markdown-reference#alerts-note-tip-important-caution-warning
      .use(remarkGithubAdmonitions, {
        classNameMaps: {
          block: (title: string) =>
            `relative rounded-md drop-shadow border-l-4 border-${getAdmonitionColor(
              title,
            )}-7 text-${getAdmonitionColor(title)}-12 bg-${getAdmonitionColor(
              title,
            )}-3 hover:bg-${getAdmonitionColor(
              title,
            )}-4 mb-5 p-4 pl-10 pb-0.5 before:absolute before:left-2 before:top-4 before:content-['${getAdmonitionIcon(
              title,
            )}'])`,
          title: (title: string) => `font-medium text-${getAdmonitionColor(title)}-11 m-0 -mb-2`,
        },
        titleFilter: ['note', 'tip', 'hint', 'important', 'caution', 'warning'],
        titleTextMap: (title: string) => {
          const parts = title.split(':')
          const checkedTitle = parts.shift()
          return {
            checkedTitle: checkedTitle?.toLocaleLowerCase(),
            displayTitle: parts.join(':').trim() || checkedTitle,
          }
        },
        titleLift: true,
        titleUnwrap: true,
        dataMaps: {
          block: (data) => ({ ...data, hName: 'div' }),
          title: (data) => ({ ...data, hName: 'div' }),
        },
      })
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

      .use(rehypePresetMinify)
      .use(rehypeStringify)
      .process(content)
      // TODO: replace &#x26; in extract
      .then((vfile) => String(vfile).replace(/&#x26;/g, '&'))
  )
}
