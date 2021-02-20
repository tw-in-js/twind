---
title: twind
editLink: true
navbar: true
sidebar: true
head:
  - - meta
    - name: description
      content: API for the twind module
  - - meta
    - name: keywords
      content: twind tailwind css-in-js
---

# `{{ $frontmatter.title }}`

[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/docs/modules/twind.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/twind.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/twind.js "brotli module size")
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/twind.d.ts)

Despite the module being very flexible and powerful, it was our intention to keep the surface API as minimal as possible. We appreciate that this module is likely to be used by developers & designers alike and so we try provide sensible defaults out of the box, with little to no need for {@page Setup | customization}.

> Note that examples are given in vanilla JS but the module is compatible with all popular frameworks

Getting started with the library requires no configuration, build step or even installation if you use [skypack](https://skypack.dev/) or [unpkg](https://unpkg.com/) (see the {@page Installation} guide for more information).

```js
import { tw } from "twind";

document.body.innerHTML = `
  <main class="${tw`bg-black text-white`}">
    <h1 class="${tw`text-xl`}">This is Tailwind in JS!</h1>
  </main>
`;
```

Using the exported [tw](#tw-function) function without any setup results in the compilation of the rules like `bg-black text-white` and `text-xl` exactly as specified in the [Tailwind documentation](https://tailwincss.com/docs). For convenience the default [tailwind theme](https://github.com/tailwindlabs/tailwindcss/blob/v1/stubs/defaultConfig.stub.js) is used along with the preflight [base styles](https://tailwindcss.com/docs/preflight) if neither are provided by the developer.

Calling the [tw](#tw-function) function like in the example above results in the shorthand rules to be interpreted, normalized and compiled into CSS rules which get added to a stylesheet in the head of the document. The function will return a string consisting of all the class names that were processed and apply them to the element itself much like any other CSS-in-JS library.

## Installation

```
npm i twind
```

> 💡 You can find more example like CDN import in the {@page Installation | installation guide}.

## API

### `tw` function

It is possible to invoke the {@link tw} function in a multitude of different ways. It can take any number of arguments, each of which can be an Object, Array, Boolean, Number, String or Template Literal. This ability is inspired heavily by the [clsx](https://npmjs.com/clsx) library by [Luke Edwards](https://github.com/lukeed).

```js
// Template literals
tw`bg-gray-200 rounded`;
//=> bg-gray-200 rounded
tw`bg-gray-200 ${false && "rounded"}`;
//=> bg-gray-200

// Strings
tw("bg-gray-200", true && "rounded", "underline");
//=> bg-gray-200 rounded underline

// Object syntax
tw({ "bg-gray-200": true, rounded: false, underline: isTrue() });
//=> bg-gray-200 underline
tw({ "bg-gray-200": true }, { rounded: false }, null, { underline: true });
//=> bg-gray-200 underline
tw({ hover: ["bg-red-500", "p-3"] }, "m-1");
// => hover:bg-red-500 hover:p-3 m-1

// Arrays
tw(["bg-gray-200", 0, false, "rounded"]);
//=> bg-gray-200 rounded
tw(["bg-gray-200"], ["", 0, false, "rounded"], [["underline"]]);
//=> bg-gray-200 rounded underline

// Variadic
tw("bg-gray-200", [
  1 && "rounded",
  { underline: false, "text-black": null },
  ["text-lg", ["shadow-lg"]],
]);
//=> bg-gray-200 rounded text-lg shadow-lg
```

<details><summary>Show me more examples</summary>

```js
tw`bg-gray-200 ${[false && "rounded", "block"]}`;
//=> bg-gray-200 block
tw`bg-gray-200 ${{ rounded: false, underline: isTrue() }}`;
//=> bg-gray-200 underline
tw`bg-${randomColor()}`;
//=> bg-blue-500
tw`hover:${({ tw }) => tw`underline`}`;
//=> hover:underline
tw`bg-${"fuchsia"}) sm:${"underline"} lg:${false && "line-through"} text-${[
  "underline",
  "center",
]} rounded-${{ lg: false, xl: true }})`;
// => bg-fuchsia sm:underline text-underline text-center rounded-xl

tw`text-${"gray"}-100 bg-${"red"}(600 hover:700 ${"focus"}:800)`;
// => text-gray-100 bg-red-600 hover:bg-red-700 focus:bg-red-800

tw({
  sm: ["hover:rounded", "active:rounded-full"],
  md: { rounded: true, hover: "bg-white" },
  lg: {
    "rounded-full": true,
    hover: "bg-white text-black active:(underline shadow)",
  },
});
// sm:hover:rounded sm:active:rounded-full md:rounded md:hover:bg-white lg:rounded-full lg:hover:bg-white lg:hover:text-black lg:hover:active:underline lg:hover:active:shadow
```

</details>

> 💡 See {@page Styling with Twind} and {@page Thinking in Groups} for more syntax examples.

#### Inline Plugins

Sometimes developers might want to break out of the defined Tailwind grammar and insert arbitrary CSS rules. Although this slightly defeats the purpose of using Tailwind and is not actively encouraged, we realize that is often necessary and so have provided an escape hatch for developers.

```js
tw`
  text-sm
  ${() => ({ "&::after": { content: '"🌈"' } })}
`;
```

In the above example a class is generate for an `::after` pseudo element. Something that isn't possible within the confides of the Tailwind API nor possible to denote using a style attribute on an element.

> 💡 The above example is for exploratory purposes. Consider using {@link twind/css} for optimal performance.
>
> ```js
> tw`
>   text-sm
>   ${css({
>     "&::after": { content: '"😊"' },
>   })}
> `;
> ```

For a further explanation on this mechanism see [Plugins](https://twind.dev/docs/handbook/advanced/plugins.html#inline-plugins).

### `apply` function

As a component author, one often wants to re-use Tailwind directive styles for defining a component and allow users of the component to override styles using Tailwind rules. The created component can be used as a base for child components and override or add some styles using Tailwind rules.

{@link apply} generates one style object, e.g., one CSS class, combining all Tailwind rules by deep merging rules in order of declaration.

> 💡 `apply` accepts the same arguments as [tw](#tw-function).

```js
const btn = apply`inline-block bg-gray-500 text-base`
// => generates on CSS class with all declarations of the above rules when used

const btnBlock = apply`${btn} block`
// => generates on CSS class with all declarations of btn & block

<button class={tw`${btn}`}>gray-500</button>
// => tw-XXXXX

<button class={tw`${btn} bg-red-500 text-lg`}>red-500 large</button>
// => tw-XXXX bg-red-500 text-lg

<button class={tw`${btnBlock}`}>block button</button>
// => tw-YYYY
```

<details><summary>Using <code>apply</code> within <code>preflight</code></summary>

Use Tailwind rules within <code>{@link twind.setup | setup}({ {@link twind.Configuration.preflight | preflight} })</code>.

```js
setup({
  preflight: {
    body: apply("bg-gray-900 text-white"),
  },
});
```

</details>

<details><summary><code>CSS</code> can be used within <code>apply</code></summary>

{@link twind/css} can be used to define additional styles.

```js
const btn = apply`
  py-2 px-4
  ${css({
    borderColor: "black",
  })}
`;
```

</details>

<details><summary>Using within <code>CSS</code></summary>

`apply` can be used with `css`:

```js
const prose = css(
  apply`text-gray-700 dark:text-gray-300`,
  {
    p: apply`my-5`,
    h1: apply`text-black dark:text-white`,
  },
  {
    h1: {
      fontWeight: "800",
      fontSize: "2.25em",
      marginTop: "0",
      marginBottom: "0.8888889em",
      lineHeight: "1.1111111",
    },
  }
);
```

Using template literal syntax:

```js
const prose = css`
  ${apply`text-gray-700 dark:text-gray-300`}

  p {
    ${apply`my-5`}
  }

  h1 {
    ${apply`text-black dark:text-white`}
    font-weight: 800;
    font-size: 2.25em;
    margin-top: 0;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
  }
`;
```

</details>

<details><summary>Using Tailwind directives with <code>animation</code> from <code>twind/css</code></summary>

```js
const motion = animation(".6s ease-in-out infinite", {
  "0%": apply`scale-100`,
  "50%": apply`scale-125 rotate-45`,
  "100%": apply`scale-100 rotate-0`,
});

const bounce = animation(
  "1s ease infinite",
  keyframes`
  from, 20%, 53%, 80%, to {
    ${apply`transform-gpu translate-x-0`}
  }
  40%, 43% {
    ${apply`transform-gpu -translate-x-7`}
  }
  70% {
    ${apply`transform-gpu -translate-x-3.5`}
  },
  90% {
    ${apply`transform-gpu -translate-x-1`}
  }
`
);
```

</details>

<details><summary>A React button component</summary>

```js
import { tw } from "twind";

const variantMap = {
  success: "green",
  primary: "blue",
  warning: "yellow",
  info: "gray",
  danger: "red",
};

const sizeMap = {
  sm: apply`text-xs py(2 md:1) px-2`,
  md: apply`text-sm py(3 md:2) px-2`,
  lg: apply`text-lg py-2 px-4`,
  xl: apply`text-xl py-3 px-6`,
};

const baseStyles = apply`
  w(full md:auto)
  text(sm white uppercase)
  px-4
  border-none
  transition-colors
  duration-300
`;

function Button({
  size = "md",
  variant = "primary",
  round = false,
  disabled = false,
  className,
  children,
}) {
  // Collect all styles into one class
  const instanceStyles = apply`
    ${baseStyles}
    bg-${variantMap[variant]}(600 700(hover:& focus:&)))
    ${sizeMap[size]}
    rounded-${round ? "full" : "lg"}
    ${disabled && "bg-gray-400 text-gray-100 cursor-not-allowed"}
  `;

  // Allow passed classNames to override instance styles
  return <button className={tw(instanceStyles, className)}>{children}</button>;
}

render(
  <Button variant="info" className="text-lg rounded-md">
    Click me
  </Button>
);
```

</details>

> 💡 The {@page Defining Components} guide explains how `apply` can be used.

### `setup` function

Understandably developers will more often than not want to customize the out of the box experience. It is possible to achieve this with the {@link setup} function. Doing so will ultimately change the behavior of calling the `tw` function, making it appropriate for your particular use case.

> 💡 To use `tw` you **do not** need to call `setup`.

```js
import { setup, strict, voidSheet } from "twind";

setup({
  preflight: false, // do not include base style reset (default: use tailwind preflight)
  mode: strict, // throw errors for invalid rules (default: warn)
  hash: true, // hash all generated class names (default: false)
  theme: {}, // define custom theme values (default: tailwind theme)
  darkMode: "class", // use a different dark mode strategy (default: 'media')
  sheet: voidSheet, // use custom sheet (default: cssomSheet in a browser or no-op)
});
```

The setup function is a named export of the Twind and accepts an config object as an argument.

> See {@page Setup | setup guide} for more details.

### `theme` helper

The {@link theme} helper simplifies using theme values:

```js
import { css, theme } from "twind/css";

css({
  backgroundColor: theme("colors.gray.900" /*, defaultValue */),
});
```

## Type Definitions

<Typedoc module="twind" />
