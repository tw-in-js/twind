# @twind/with-next [![MIT License](https://flat.badgen.net/github/license/tw-in-js/twind)](https://github.com/tw-in-js/twind/blob/next/LICENSE) [![Latest Release](https://flat.badgen.net/npm/v/@twind/with-next/next?icon=npm&label&cache=10800&color=blue)](https://www.npmjs.com/package/@twind/with-next/v/next) [![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%23next?icon=github&label)](https://github.com/tw-in-js/twind/tree/next/packages/next)

---

## READ THIS FIRST!

**Twind v1 is still in beta. Expect bugs!**

---

Seamless integration of [twind](https://github.com/tw-in-js/twind/tree/next/packages/twind) for [Next.js](https://nextjs.org) 12.x.

Used within the following [examples](https://github.com/tw-in-js/twind/tree/next/examples):

- [Next.js](https://github.com/tw-in-js/twind/tree/next/examples/with-next)

## Installation

Install from npm:

```sh
npm install twind@next @twind/with-next@next
```

## Usage

Please see [examples/with-next](https://github.com/tw-in-js/twind/tree/next/examples/with-next) for detailed usage example.

### `twind.config.js`

```js
import { defineConfig } from 'twind'
// import { defineConfig } from '@twind/tailwind'

export default defineConfig({
  /* config */
})
```

`@twind/with-next` will use hashed class names in production by default. If you don't want this, you can use the `hash` config option:

```js
export default defineConfig({
  hash: false,
  /* config */
})
```

### `pages/_app.js`[^1]

```js
import withTwind from '@twind/with-next/app'
import config from '../twind.config'

export default withTwind(config)
```

<details>
<summary>With a custom App component</summary>

TLDR;

```diff
+ import withTwind from '@twind/with-next/app'
+ import config from '../twind.config'

- export default MyApp
+ export default withTwind(config, MyApp)
```

Here is a full example:

```js
import withTwind from '@twind/with-next/app'
import config from '../twind.config'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default withTwind(config, MyApp)
```

</details>

### `pages/_document.js`[^2]

Enable server-side rendering of Twind styles.

```js
export { default } from '@twind/with-next/document'
```

<details>
<summary>With a custom Document component</summary>

TLDR;

```diff
- import Document, { Html, Head, Main, NextScript } from 'next/document'
+ import { Html, Head, Main, NextScript } from 'next/document'
+ import Document from '@twind/with-next/document'
```

Here is a full example:

```js
import { Html, Head, Main, NextScript } from 'next/document'
import Document from '@twind/with-next/document'
import config from '../twind.config'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

> The code above is the default `Document` added by Next.js. Feel free to remove the `getInitialProps` or `render` function from `MyDocument` if you don't need to change them.

</details>

[^1]: [Next.js › Custom App](https://nextjs.org/docs/advanced-features/custom-app)
[^2]: [Next.js › Custom Document](https://nextjs.org/docs/advanced-features/custom-document)
