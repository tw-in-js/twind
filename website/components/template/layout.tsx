import type { ReactNode } from 'react'
import Header from './header'
// TODO: import Main from './main'
import Footer from './footer'
import { cx } from 'twind'

export default function Layout({
  nav,
  aside,
  children,
}: {
  nav?: ReactNode
  aside?: ReactNode
  children: ReactNode
}) {
  // adjust bg and text colors in _document.tsx as well
  // TODO: skip to content
  return (
    // flex flex-col min-h-screen
    <div className="antialiased bg-brand-1 text-brand-11">
      <Header sticky={!!nav} />

      <div className="max-w-8xl mx-auto relative px-4 lg:px-10">
        {nav && (
          <div className="w-72 hidden lg:block fixed top-16 bottom-0 pb-10 pr-8 overflow-y-auto">
            {nav}
          </div>
        )}

        {aside && (
          <div className="w-72 hidden xl:block fixed top-16 bottom-0 right-[max(0px,calc(50%-45rem))] py-10 overflow-y-auto">
            {aside}
          </div>
        )}

        <main className={cx(nav && 'mx-auto max-w-prose lg:max-w-none lg:ml-80 xl:mr-80')}>
          {children}
        </main>

        <Footer />
      </div>
    </div>
  )
}
