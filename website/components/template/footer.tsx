export default function Footer() {
  return (
    <footer className="py-8 text-sm text-center">
      © {new Date().getFullYear()}{' '}
      <a
        href="https://github.com/tw-in-js/twind/graphs/contributors"
        rel="noopener noreferrer"
        target="_blank"
        className="hover:text-brand-12"
      >
        Twind
      </a>
    </footer>
  )
}
