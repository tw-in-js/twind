---
title: Use with Gatsby
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: How to use Twind with Gatsby
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# {{ $frontmatter.title }}

```js
/* gatsby-ssr.js */

const { setup } = require("twind");
const { asyncVirtualSheet, getStyleTagProperties } = require("twind/server");

const sheet = asyncVirtualSheet();

setup({ ...sharedOptions, sheet });

exports.wrapPageElement = ({ element }) => {
  sheet.reset();

  return element;
};

exports.onRenderBody = ({ setHeadComponents, pathname }) => {
  const { id, textContent } = getStyleTagProperties(sheet);

  const styleProps = {
    id,
    dangerouslySetInnerHTML: {
      __html: textContent,
    },
  };

  setHeadComponents([
    React.createElement("style", {
      id,
      dangerouslySetInnerHTML: {
        __html: textContent,
      },
    }),
  ]);
};
```
