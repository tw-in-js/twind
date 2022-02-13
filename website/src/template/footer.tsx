import Link from 'next/link'
import { cx } from 'twind'

export default function Footer({ edit }: { edit?: string }) {
  return (
    <footer
      className={cx(
        'mt-10 pt-10 pb-10 text-sm',
        edit ? 'border-t border-brand-7 flex items-center' : 'text-center',
      )}
    >
      <a
        href="https://github.com/tw-in-js/twind/blob/next/LICENSE"
        rel="noopener noreferrer license"
        target="_blank"
        className="ml-1 hover:text-brand-12"
      >
        MIT Licensed
      </a>

      <span className="ml-1">© {new Date().getFullYear()}</span>
      <a
        href="https://github.com/tw-in-js/twind/graphs/contributors"
        rel="noopener noreferrer author copyright"
        target="_blank"
        className="ml-1 hover:text-brand-12"
      >
        Twind
      </a>

      {edit && (
        <Link href={`https://github.com/tw-in-js/twind/edit/next/${edit}`}>
          <a className="ml-auto hover:text-brand-12">Edit this page on GitHub</a>
        </Link>
      )}
    </footer>
  )
}
