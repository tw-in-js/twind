import type { ReactNode } from 'react'
import type { Toc } from '@stefanprobst/rehype-extract-toc'

import Link from 'next/link'
import { createRef } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { cx } from 'twind'

import { components } from '~/mdx'
import { ScrollSpy, useScrollSpyActive, useScrollSpyRef } from '~/scroll-spy'
import Template from '~/template'

import { entries, sections } from '$sitemap/docs'
import { useRouter } from 'next/router'

export interface LayoutMDXProps {
  children: ReactNode
  toc: Toc
  meta: {
    section?: string
    title?: string
    excerpt?: string
  }
  filename: string
}

export default function LayoutDocs({ toc, meta, filename, children }: LayoutMDXProps) {
  const router = useRouter()

  const entry = entries[router.pathname]
  const next = entries[entry.next as string]
  const prev = entries[entry.prev as string]

  const aside = toc.length > 0 && (
    <nav className="text-sm leading-6 px-4" role="directory" aria-label="Table of contents">
      <h2 className="text-brand-12 font-semibold mb-4">On this page</h2>
      <TocEntries toc={toc} />
    </nav>
  )

  // TODO: header title and meta tags
  return (
    <ScrollSpy>
      <Template
        title={[meta.section, meta.title].filter(Boolean).join(' › ') || 'Documentation'}
        description={meta.excerpt}
        edit={filename}
        nav={<Nav />}
        aside={aside}
      >
        {meta.title && (
          <header className="mb-10">
            {meta.section && (
              <p className="mb-2 text-sm leading-6 font-semibold text-accent-11">{meta.section}</p>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-12 tracking-tight">
              {meta.title}
            </h1>
            {meta.excerpt && <p className="mt-2 text-lg text-brand-11">{meta.excerpt}</p>}
          </header>
        )}

        <Content>{children}</Content>

        {(prev || next) && (
          <footer className="text-sm leading-6">
            <div className="mt-12 font-semibold flex items-center text-brand-11">
              {prev && (
                <Link href={entry.prev as string} prefetch={false}>
                  <a className="hover:text-brand-12" rel="prev">
                    <span className="inline-block mr-2" aria-hidden="true">
                      ‹
                    </span>
                    {prev.label}
                  </a>
                </Link>
              )}
              {next && (
                <Link href={entry.next as string} prefetch={false}>
                  <a className="ml-auto hover:text-brand-12" rel="next">
                    {next.label}
                    <span className="inline-block ml-2" aria-hidden="true">
                      ›
                    </span>
                  </a>
                </Link>
              )}
            </div>
          </footer>
        )}
      </Template>
    </ScrollSpy>
  )
}

function Content({ children }: { children: ReactNode }) {
  const scrollSpyRef = useScrollSpyRef()

  return (
    <div className="prose prose-headings:scroll-mt-20" ref={scrollSpyRef}>
      <MDXProvider components={components}>{children}</MDXProvider>
    </div>
  )
}

function Nav() {
  return (
    <nav className="lg:text-sm lg:leading-6 relative pl-1">
      <div className="sticky top-0 -ml-0.5 pointer-events-none">
        <div className="pt-10 bg-brand-1 relative pointer-events-auto">
          <button
            type="button"
            className={cx`
              bg-neutral-3 text-neutral-11
              hover:(bg-neutral-4 text-neutral-12)
              ring-(1 neutral-7 hover:neutral-8)
              focus:(outline-none ring-(2 brand-8))
              shadow-sm rounded-md
              hidden w-full lg:flex items-center text-sm leading-6 py-1.5 pl-2 pr-3
            `}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3 flex-none"
              aria-hidden="true"
            >
              <path d="m19 19-3.5-3.5"></path>
              <circle cx="11" cy="11" r="6"></circle>
            </svg>
            Quick search...
            <kbd className="ml-auto font-sans font-semibold">
              <abbr title="Command" className="no-underline">
                ⌘
              </abbr>{' '}
              K
            </kbd>
          </button>
        </div>
        <div className="h-8 bg-gradient-to-b from-brand-1"></div>
      </div>

      <ul>
        {sections.map(([section, entries]) =>
          section ? (
            <li key={section} className="mt-12 lg:mt-8">
              <h5 className="mb-8 lg:mb-3 font-semibold text-brand-12">{section}</h5>
              <ol className="space-y-6 lg:space-y-2 border-l border-brand-7">
                {entries.map((href) => (
                  <NavEntry key={href} href={href} />
                ))}
              </ol>
            </li>
          ) : (
            entries.map((href) => <NavEntry key={href} href={href} />)
          ),
        )}
      </ul>
    </nav>
  )
}

function NavEntry({ href }: { href: string }) {
  const router = useRouter()

  const { section, label } = entries[href]

  return (
    <li>
      <Link href={href} prefetch={false}>
        <a
          className={cx(
            'block',
            router.pathname == href
              ? 'font-semibold text-accent-11'
              : 'text-brand-11 hover:text-brand-12',
            section
              ? 'pl-4 border-l -ml-px ' +
                  (router.pathname == href
                    ? 'border-current'
                    : 'border-transparent hover:border-brand-8')
              : 'font-medium mb-6 lg:mb-2',
          )}
        >
          {label}
        </a>
      </Link>
    </li>
  )
}
function TocEntries({ toc }: { toc: Toc }) {
  return (
    <ol>
      {toc.map((entry) => (
        <TocEntry key={entry.id} entry={entry} />
      ))}
    </ol>
  )
}

function TocEntry({ entry }: { entry: Toc[number] }) {
  const isActive = useScrollSpyActive(entry.id)

  return (
    <li className={`ml-${4 * (entry.depth - 2)}`}>
      <a
        href={`#${entry.id}`}
        className={cx(
          'block py-1 hover:text-brand-12 transition-colors duration-300 ease-in-out',
          entry.depth < 2 && 'font-medium',
          isActive && 'text-accent-(11 hover:12)',
        )}
        ref={createRef()}
      >
        {entry.depth > 2 && (
          <span className="inline-block mr-2" aria-hidden="true">
            ›
          </span>
        )}
        {entry.value}
      </a>

      {entry.children && <TocEntries toc={entry.children} />}
    </li>
  )
}
