// Must be the first import
// if (process.env.NODE_ENV === 'development') {
//   // Must use require here as import statements are only allowed
//   // to exist at top-level.
//   require("preact/debug");
// }

import type { AppProps, NextWebVitalsMetric } from 'next/app'

import install from '@twind/with-next/app'
import config from '../twind.config'

export default install(config, function ({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
})

// TODO: https://nextjs.org/docs/advanced-features/measuring-performance
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
}
