import { ChevronRightIcon } from '@heroicons/react/solid'
import { BookOpenIcon, GiftIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import Template from '~/template'

import { start } from '$sitemap/docs'

// TODO: links to chat, issues, and discussions
// - Read [the docs](https://twind.style/docs)
// - Explore [the examples](https://github.com/tw-in-js/twind/tree/next/examples#readme)
// - Use [Github Discussions](https://github.com/tw-in-js/twind/discussions) for message-board style questions and discussions.
// - Ask questions and discuss with other Twind users in real time on [Discord Chat](https://chat.twind.style).

const links = [
  {
    href: start,
    title: 'Documentation',
    description: 'Learn how to integrate Twind with your website or app',
    icon: BookOpenIcon,
  },
  {
    // TODO: adjust url
    href: '/packages',
    title: 'Packages',
    description: 'A complete reference for our packages',
    icon: GiftIcon,
  },
]

export default function _404() {
  return (
    <Template>
      <div className="max-w-xl mx-auto py-16 sm:py-24">
        <div className="text-center">
          <p className="text-sm font-semibold text-error-11 uppercase tracking-wide">404 error</p>
          <h1 className="mt-2 text-4xl font-extrabold text-brand-11 tracking-tight sm:text-5xl">
            This page does not exist.
          </h1>
          <p className="mt-2 text-lg text-brand-11">
            The page you are looking for could not be found.
          </p>
        </div>
        <div className="mt-12">
          <h2 className="text-sm font-semibold text-brand-11 tracking-wide uppercase">
            Popular pages
          </h2>
          <ul role="list" className="mt-4 border-t border-b border-brand-6 divide-y divide-brand-6">
            {links.map((link, linkIdx) => (
              <li key={linkIdx} className="relative py-6 flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center h-12 w-12 rounded-lg bg-brand-9">
                    <link.icon className="h-6 w-6 text-brand-12" aria-hidden="true" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-medium text-brand-12">
                    <span className="rounded-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-8">
                      <Link href={link.href}>
                        <a className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden="true" />
                          {link.title}
                        </a>
                      </Link>
                    </span>
                  </h3>
                  <p className="text-base text-brand-11">{link.description}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <ChevronRightIcon className="h-5 w-5 text-brand-12" aria-hidden="true" />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link href="/">
              <a className="text-base font-medium text-brand-11 hover:text-brand-12">
                Or go back home<span aria-hidden="true"> &rarr;</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Template>
  )
}
