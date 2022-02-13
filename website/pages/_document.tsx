import Document, { Html, Head, Main, NextScript } from 'next/document'
import install from '@twind/with-next/document'
import { tw } from 'twind'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en_US">
        <Head />
        {/* using tw here to have class names hashed in production */}
        {/* because nextjs only shims the content */}
        <body className={tw('antialiased bg-brand-1 text-brand-11')}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default install(MyDocument)
