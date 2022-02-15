import glob from 'glob'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

import withPlugins from 'next-compose-plugins'

import withTM from 'next-transpile-modules'
import withBundleAnalyzer from '@next/bundle-analyzer'

// import withPreact from 'next-plugin-preact'
import withMDX from '@next/mdx'

import remarkGfm from 'remark-gfm'
// import remarkGithub from 'remark-github'
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import { remarkCodeHike } from '@code-hike/mdx'

import rehypeSlugs from 'rehype-slug'
import rehypeToc from '@stefanprobst/rehype-extract-toc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'

import { valueToEstree } from 'estree-util-value-to-estree'
import matter from 'gray-matter'

import VirtualModulesPlugin from 'webpack-virtual-modules'

/**
 * @type {import('next').NextConfig}
 **/
export default withPlugins(
  [
    // withPreact(),
    withTM([
      'twind',
      '@twind/preset-autoprefix',
      '@twind/preset-ext',
      '@twind/preset-tailwind',
      '@twind/preset-typography',
      '@twind/with-next',
    ]),
    withBundleAnalyzer({ enabled: Boolean(process.env.ANALYZE) }),
    withMDX({
      extension: /\.mdx?$/,
      options: {
        remarkPlugins: [
          // remarkFrontmatter,
          // remarkMdxFrontmatter,
          remarkGfm,
          // TODO: enable remarkGithub,
          remarkA11yEmoji,
          // TODO: https://github.com/kevin940726/remark-codesandbox
          // slack-dark, github-dark-dimmed, one-dark-pro
          [remarkCodeHike, { theme: createRequire(import.meta.url)('shiki/themes/one-dark-pro') }],
        ],
        rehypePlugins: [
          rehypeSlugs,
          // TODO: configure https://github.com/rehypejs/rehype-autolink-headings
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'wrap',
              // class `autolink` is the marker for src/mdx#a to add tailwind classes
              properties: { tabIndex: -1, class: 'autolink' },
            },
          ],
          // TODO: configure https://github.com/rehypejs/rehype-external-links
          rehypeExternalLinks,
          // TODO: https://github.com/rsclarke/rehype-shiki
          rehypeToc,
          // [rehypeTocExport, { name: 'toc' }],

          function wrapWithMDXLayout() {
            return function transformer(tree, vfile) {
              // filename relative to repo root
              const filename = vfile.history[0].slice(
                new URL('..', import.meta.url).pathname.length,
              )

              // TODO: maybe allow excerpt in content
              const { data, isEmpty } = matter(vfile.value)

              const meta = {
                section: data.section,
                title: data.title,
                excerpt: data.excerpt,
              }

              // console.dir({isEmpty, tree: tree.children.slice(0, 5)}, {depth: null})
              const { toc } = vfile.data
              if (!isEmpty) {
                // first toc entry is the frontmatter
                toc.shift()

                // remove frontmatter from tree
                // { type: 'text', value: '\n' },
                // { type: 'element', tagName: 'hr' },
                // { type: 'text', value: '\n' }
                // { type: 'element', tagName: 'h2' },
                // { type: 'text', value: '\n' },
                const startIndex = tree.children.findIndex(({type, tagName}) => type == 'element' && tagName == 'hr')
                if (~startIndex) {
                  tree.children.splice(startIndex-1, 5)
                }
              }

              // import __LayoutDocs$ from '~/layouts/docs.tsx'
              // export default function MDXLayout(props) {
              //   return <__LayoutDocs$ {...props} toc={{...}} meta={{...}} filename={'...'} />;
              // }
              // console.dir(tree.children.slice(0, 5), {depth: null})
              tree.children.unshift({
                type: 'mdxjsEsm',
                data: {
                  estree: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ImportDeclaration',
                        specifiers: [
                          {
                            type: 'ImportDefaultSpecifier',
                            local: {
                              type: 'Identifier',
                              name: '__LayoutDocs$',
                            },
                          },
                        ],
                        source: {
                          type: 'Literal',
                          value: '~/layouts/docs.tsx',
                          raw: "'~/layouts/docs.tsx'",
                        },
                      },
                      {
                        type: 'ExportDefaultDeclaration',
                        declaration: {
                          type: 'FunctionDeclaration',
                          id: {
                            type: 'Identifier',
                            name: 'MDXLayout',
                          },
                          expression: false,
                          generator: false,
                          async: false,
                          params: [
                            {
                              type: 'Identifier',
                              name: 'props',
                            },
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ReturnStatement',
                                argument: {
                                  type: 'JSXElement',
                                  openingElement: {
                                    type: 'JSXOpeningElement',
                                    attributes: [
                                      {
                                        type: 'JSXSpreadAttribute',
                                        argument: {
                                          type: 'Identifier',
                                          name: 'props',
                                        },
                                      },
                                      {
                                        type: 'JSXAttribute',
                                        name: {
                                          type: 'JSXIdentifier',
                                          name: 'toc',
                                        },
                                        value: {
                                          type: 'JSXExpressionContainer',
                                          expression: valueToEstree(toc),
                                        },
                                      },
                                      {
                                        type: 'JSXAttribute',
                                        name: {
                                          type: 'JSXIdentifier',
                                          name: 'meta',
                                        },
                                        value: {
                                          type: 'JSXExpressionContainer',
                                          expression: valueToEstree(meta),
                                        },
                                      },
                                      {
                                        type: 'JSXAttribute',
                                        name: {
                                          type: 'JSXIdentifier',
                                          name: 'filename',
                                        },
                                        value: {
                                          type: 'JSXExpressionContainer',
                                          expression: valueToEstree(filename),
                                        },
                                      },
                                    ],
                                    name: {
                                      type: 'JSXIdentifier',
                                      start: 341,
                                      end: 348,
                                      name: '__LayoutDocs$',
                                    },
                                    selfClosing: true,
                                  },
                                  closingElement: null,
                                  children: [],
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                    sourceType: 'module',
                  },
                },
              })
            }
          },
        ],
        // If you use `MDXProvider`, uncomment the following line.
        providerImportSource: '@mdx-js/react',
      },
    }),
  ],
  {
    reactStrictMode: true,
    // enable mdx for pages
    pageExtensions: ['mdx', 'md', 'tsx', 'ts', 'jsx', 'js'],
    // use cloudflare for image optimizations: src/images.tsx
    images: {
      // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      // fake loader — we use cloudflare
      loader: 'custom',
    },
    // cloudflare will compress
    compress: false,

    webpack: (config /*, { buildId, dev, isServer, defaultLoaders, webpack } */) => {
      // Until https://github.com/vercel/next.js/issues/33693 — just silence the warnings
      config.infrastructureLogging = { level: 'error' }

      const sitemap = new Map()

      for (const file of glob.sync('pages/docs/**/*.md?(x)')) {
        const {
          data: {
            section = null,
            title = file.slice('pages/docs/'.length).replace(/\.mdx?$/, ''),
            label = title,
            next,
          },
        } = matter(readFileSync(file))
        const href = file.slice('pages'.length).replace(/\.mdx?$/, '')
        sitemap.set(href, {
          href,
          section,
          label,
          next: next && new URL(next, 'http://x' + href).pathname.replace(/\.mdx?$/, ''),
        })
      }

      // update prev link
      sitemap.forEach((value, href) => {
        const next = sitemap.get(value.next)

        if (next) {
          next.prev = href
        }
      })

      let start = undefined
      for (const [href, entry] of sitemap) {
        if (entry.next && !entry.prev) {
          start = href
          break
        }
      }

      if (!start) start = sitemap.keys().next().value

      const seen = new Set()
      const sections = new Map([[null, []]])
      for (let current = sitemap.get(start); current; current = sitemap.get(current.next)) {
        seen.add(current)

        let section = sections.get(current.section)
        if (!section) {
          sections.set(current.section, (section = []))
        }

        section.push(current.href)
      }

      // collect those that are not linked
      for (const current of sitemap.values()) {
        if (seen.has(current)) continue

        let section = sections.get(current.section)
        if (!section) {
          sections.set(current.section, (section = []))
        }

        section.push(current.href)
      }

      const virtualModules = new VirtualModulesPlugin({
        'node_modules/$sitemap/docs': `
          export const start = ${JSON.stringify(start)};
          export const sections = ${JSON.stringify(
            [...sections].filter(([, entries]) => entries.length),
          )};
          export const entries = ${JSON.stringify(
            Object.fromEntries(
              Array.from(sitemap, ([href, { section, label, prev, next }]) => [
                href,
                { section, label, prev, next },
              ]),
            ),
          )}
        `,
      })

      config.plugins.push(virtualModules)

      return config
    },
  },
)
