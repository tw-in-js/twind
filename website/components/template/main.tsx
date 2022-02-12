import type { ReactNode } from 'react'

export default function Main({ children }: { children: ReactNode }) {
  return <main className="flex-grow mx-auto max-w-7xl px-4">{children}</main>
}
