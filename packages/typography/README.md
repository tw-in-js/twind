# @tw-in-js/typography

> A plugin that provides a set of `prose` classes you can use to add beautiful typographic defaults to any vanilla HTML you don't control (like HTML rendered from Markdown, or pulled from a CMS).

[![MIT License](https://flat.badgen.net/github/license/tw-in-js/core)](https://github.com/tw-in-js/core/blob/main/LICENSE)
[![Latest Release](https://flat.badgen.net/npm/v/@tw-in-js/typography?icon=npm&label)](https://www.npmjs.com/package/@tw-in-js/typography)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Fcore?icon=github&label)](https://github.com/tw-in-js/core/blob/main/packages/core)
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/@tw-in-js/typography/types/core.d.ts)
[![Bundle Size](https://flat.badgen.net/bundlephobia/minzip/@tw-in-js/typography?icon=packagephobia&label&color=blue)](https://bundlephobia.com/result?p=@tw-in-js/typography)

---

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Installation

```sh
npm install @tw-in-js/typography
```

## Usage

> see [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)

```js
import typography from '@tw-in-js/typography'
import { setup } from '@tw-in-js/core'

setup({
  plugins: {
    ...typography({
      className: 'my-prose', // Defaults to 'prose'
    }),
  },
})
```

## Contribute

Thanks for being willing to contribute!

> This project is free and open-source, so if you think this project can help you or anyone else, you may [star it on GitHub](https://github.com/tw-in-js/core). Feel free to [open an issue](https://github.com/tw-in-js/core/issues) if you have any idea, question, or you've found a bug.

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

We are following the [Conventional Commits](https://www.conventionalcommits.org) convention.

## License

[MIT](https://github.com/tw-in-js/core/blob/main/LICENSE)
