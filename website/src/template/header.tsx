import Link from 'next/link'
import { cx } from 'twind'
import { ThemeSwitcher } from '~/theme-switcher'
import { TwindLogo, GitHubIcon, DiscordIcon } from '~/icons'

import { start } from '$sitemap/docs'

export default function Header({ sticky }: { sticky: boolean }) {
  return (
    <header
      className={cx(
        'w-full top-0 mb-5',
        sticky &&
          'sticky z-40 border-b border-brand-7 bg-brand-1 lg:(mb-10 backdrop-blur bg-brand-1/95 dark:bg-brand-1-dark/75)',
      )}
    >
      <div className="max-w-8xl mx-auto p-4 lg:px-10 flex flex-row items-center">
        <Link href="/">
          <a className="flex title-font font-medium items-center hover:text-brand-12">
            <TwindLogo className="w-8 h-8" aria-hidden="true" />
            <span className={cx`sr-only md:(not-sr-only ml-3 text-xl)`}>Twind</span>
          </a>
        </Link>
        <nav
          className="ml-auto flex flex-wrap items-center text-base justify-center"
          aria-label="Site Navigation"
        >
          <Link href={start} prefetch={false}>
            <a className="ml-5 hover:text-brand-12">
              <span className="lg:hidden" aria-hidden="true">
                Docs
              </span>
              <span className="sr-only lg:not-sr-only">Documentation</span>
            </a>
          </Link>
          <hr
            className="ml-5 w-0 h-5 border-l border-brand-6"
            role="separator"
            aria-orientation="vertical"
          />
          <ThemeSwitcher className="ml-5 block w-5 hover:text-brand-12" />
          <a
            className="ml-5 flex item-center hover:text-brand-12"
            href="https://github.com/tw-in-js/twind/tree/next"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Twind on GitHub</span>
          </a>
          <a
            className="ml-5 flex item-center hover:text-brand-12"
            href="https://chat.twind.style"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <DiscordIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Twind on Discord</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
