import { Link } from '@remix-run/react'
import { cx } from '@twind/core'
import { Suspense } from 'react'

let fullfilled = false
let promise: Promise<void> | null = null

const useTimeout = (ms: number) => {
  if (!fullfilled) {
    throw (promise ||= new Promise((res) => {
      setTimeout(() => {
        fullfilled = true
        res()
      }, ms)
    }))
  }
}

const linkClass = cx('transition-all duration-300 opacity-75 hover:(opacity-100 text-indigo-500)')

const BackHome = () => {
  useTimeout(2000)
  return (
    <Link to="/" className={linkClass}>
      Back to Home
    </Link>
  )
}

export default function Index() {
  return (
    <main className="py-16 px-4 max-w-screen-md mx-auto w-full">
      <h1 className="text-4xl font-light mb-6">This works</h1>
      <Suspense fallback={'Loading...'}>
        <BackHome />
      </Suspense>
    </main>
  )
}
