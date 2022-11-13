---
section: Core Concepts
title: Reference
next: ./component-styles.md
---

## Lang

- comments like in CSS: `/* ... */`
- [`group~{name}-{modifier}`](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state) and [`peer~{name}-{modifier}`](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)

  Name can contain any characters except whitespace, parenthesis (`(` and `)`), colon (`:`), dash (`-`), and opening bracket (`[`).

  ```html /group~project/1 /group~project-hover/1 /group~create/1 /group~create-hover/1
  <div class="group~project bg-white hover:bg-blue-500 ...">
    <p class="text-gray-900 group~project-hover:text-white ...">New Project</p>
    <div class="group~create bg-gray-100 hover:bg-green-500 ...">
      <p class="text-gray-500 group~create-hover:text-white ...">
        Create a new project from a variety of starting templates.
      </p>
    </div>
  </div>
  ```

- attribute selector as modifier for [groups](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state) and [peers](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)

  ```html
  <div class="group bg-white hover:bg-blue-500 ...">
    <p class="text-gray-900 group[disabled]:text-gray-200 ...">Project Name</p>
  </div>
  ```

  With named groups/peers:

  ```html
  <div class="group~project bg-white hover:bg-blue-500 ...">
    <p class="text-gray-900 group~project[disabled]:text-gray-200 ...">Project Name</p>
  </div>
  ```

## CSS (strings and objects)

- `&`: for nested selectors ([CSS Nesting Module](https://tabatkins.github.io/specs/css-nesting/))
- `label`: for a more readable class names [Emotion › Labels](https://emotion.sh/docs/labels)
- `theme(...)`: access theme values using dot notation; can be used in arbitrary values as well ([Tailwind CSS › Functions & Directives › theme()](https://tailwindcss.com/docs/functions-and-directives#theme))
- `@layer ...`: tell Twind which _bucket_ a set of custom styles belong to ([Tailwind CSS › Functions & Directives › layer](https://tailwindcss.com/docs/functions-and-directives#layer) & [Cascade Layers (CSS @layer) spec](https://www.bram.us/2021/09/15/the-future-of-css-cascade-layers-css-at-layer/))
  - The following layer exist in the given order: `defaults`, `base`, `components`, `shortcuts`, `utilities`, `overrides`
- `@apply`: inline any existing utility classes ([Tailwind CSS › Functions & Directives › apply](https://tailwindcss.com/docs/functions-and-directives#apply))
- `@media screen(...)`: create media queries that reference breakpoints by name instead of duplicating their values ([Tailwind CSS › Functions & Directives › screen()](https://tailwindcss.com/docs/functions-and-directives#screen))

## API

The following functions are all exports from `twind{:.module}`.

> **Tip**
> If you are using the `script` tag these methods are available via the `twind` global object (eg `twind.setup`).

If you have used Tailwind or other CSS-in-JS solutions, then most of the API should feel very familiar.

### _Shim Mode_

Observe class attributes to inject styles

- `install(config, isProduction): Twind{:ts}`: configures the global `tw{:.fn}` instance, observes all class attributes and inject the styles into the DOM; returns a twind instance
- `setup(config, sheet?, target?): Twind{:ts}`: configures the global `tw{:.fn}` instance, observes all class attributes and inject the styles into the DOM; returns a twind instance
- `tw{:.fn}`: the global twind instance updated by each `setup{:.fn}` call

### _Library Mode_

- `twind(config)`: create a twind instance
- `observe(tw, target?)`: observes all class attributes and injects the styles into the DOM

### Twind instance — `tw{:.fn}`

- global twind instance: `import { tw } from 'twind'{:js}`
- `tw(className){:js}`: injects a className string into the sheet and return the resulting class names
- `tw.config{:js}`: access the current config
- `tw.theme(section?, key?, defaultValue?){:js}`: access the current theme

  - `tw.theme(){:js}`: returns the whole theme
  - `tw.theme(section){:js}`: returns the whole section
  - `tw.theme(dottedKey, defaultValue?){:js}`: returns the current value
  - `tw.theme(section?, key?, defaultValue?){:js}`: returns the theme value

  ```js
  tw.theme('colors.blue.500', 'blue')
  ```

- `tw.target{:js}`: the sheet target of this instance (`string[]`, `HTMLStyleSheet`, `CSSStyleSheet`)
- `tw.clear(){:js}`: clears all CSS rules from the sheet
- `tw.destroy(){:js}`: remove the sheet from the document

### Utilities

- `defineConfig(config){:js}`: define a configuration object for `setup{:.fn}` or `twind{:.fn}`
- `tx(...args){:js}`: creates a class name from the given arguments and injects the styles (like `tw(cx(...args)){:js}`)

  - `tx.bind(tw){:js}`: binds the `tx{:.fn}` function to a custom twind instance; returns a new `tx{:.fn}` function

  ```js
  import { tx } from 'twind'

  const className = tx`underline bg-red-200 text-red-900`
  ```

- `injectGlobal(...args){:js}`: injects the given styles into the base layer

  - `injectGlobal.bind(tw){:js}`: binds the `injectGlobal{:.fn}` function to a custom twind instance; returns a new `injectGlobal{:.fn}` function

  ```js
  import { injectGlobal } from 'twind'

  injectGlobal`
    @font-face {
      font-family: "Operator Mono";
      src: url("../fonts/Operator-Mono.ttf");
    }
  
    body {
      margin: 0;
    }
  `
  ```

- `keyframes(...args)`: lazily injects the keyframes into the sheet and return a unique name

  - `keyframes.Name(...args)`: lazily injects the named keyframes into the sheet and return a unique name
  - `keyframes.bind(tw)`: binds the `keyframes` function to a custom twind instance; returns a new `keyframes` function

  ```js
  import { keyframes, css, tx } from 'twind'

  const fadeIn = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `
  // using CSS object notation
  const fadeIn = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  })

  // within a arbitrary value
  el.className = `animate-[1s_${fadeIn}_ease-out]`

  // within CSS
  const fadeInClass = css`
    animation: 1s ${fadeIn} ease-out;
  `
  ```

- `animation(animation: string | CSSProperties, waypoints: StringLike)`: lazily injects the animation into the sheet and return a unique name

  - `animation.Name(animation: string | CSSProperties, waypoints: StringLike)`: lazily injects the named animation into the sheet and return a unique name

  ```js
  import { animation, keyframes } from 'twind'

  const fadeIn = animation(
    '1s ease-out',
    keyframes`
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `,
  )
  ```

### Helper functions

These generate class names but do **not** inject styles.

These can be used to generate class names that are then

a) set the class attribute on an element (_Shim Mode_)<br>
b) used with `tw{:.fn}` to inject styles and return a class name (_Library Mode_)

- `cx(...args)`: creates a class name from the given arguments; no styles injected

  ```js
  import { cx } from 'twind'

  // Set a className
  element.className = cx`
    underline
    /* multi
      line
      comment
    */
    hover:focus:!{
      sm:{italic why}
      lg:-{px}
      -mx-1
    }
    // Position
    !top-1 !-bottom-2
    text-{xl black}
  `
  ```

- `css(...args)`: creates a class name from the given arguments; no styles injected
- `style(options)`: creates a stitches like helper; returns a `style` function
  - `style(props)`: creates a class name from the given props; no styles injected

### Mostly server side

Used to update an html string with styles.

- `inline(html, tw? | {tw, minfiy}?)`: updates all class attributes in html string and inject there styles into the head as style element; returns the updated html string
- `extract(html, tw?)`: updates all class attributes from html string; returns the updated html string and the CSS
- `consume(html, tw?)`: updates all class attributes from html string; returns the updated html string and injects all styles into `tw{:.fn}`

### Sheets

- `getSheet(useDOMSheet?: boolean, disableResume?: boolean)`: returns a `Sheet` for the current environment — `virtual` on server, either `dom` or `cssom` in browsers
- `virtual(includeResumeData?: boolean)`: collect styles into an array
- `cssom(element?: CSSStyleSheet | Element | null | false)`: uses a fast DOM sheet — bad for debugging
- `dom(element?: Element | null | false)`: uses a slow DOM sheet — great for debugging
- `stringify(target)`: returns the CSS string of a sheet target

## Config

### Dark Mode

```js
defineConfig({
  // using media strategy with `@media (prefers-color-scheme:dark)`
  darkMode: 'media',
  // using class strategy with `.dark`
  darkMode: 'class',
  // custom selectors
  darkMode: '.dark-mode',
  darkMode: '[theme=dark]',
})
```

### Auto Dark Colors

If enabled, automatic dark colors are generated for each light color (eg no `dark:` variant is present). This feature is opt-in and twind provides a builtin function that works with [tailwind color palettes](https://tailwindcss.com/docs/customizing-colors) (`50`, `100`, `200`, ..., `800`, `900`).

```ts
import { autoDarkColor } from 'twind'

defineConfig({
  // for tailwind color palettes: 50 -> 900, 100 -> 800, ..., 800 -> 100, 900 -> 50
  darkColor: autoDarkColor,
  // other possible implementations
  darkColor: (section, key, { theme }) => theme(`${section}.${key}-dark`) as ColorValue,
  darkColor: (section, key, { theme }) => theme(`dark.${section}.${key}`) as ColorValue,
  darkColor: (section, key, { theme }) => theme(`${section}.dark.${key}`) as ColorValue,
  darkColor: (section, key, context, lightColor) => generateDarkColor(lightColor),
})
```

Example css for `text-gray-900`:

```css
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgba(15, 23, 42, var(--tw-text-opacity));
}
@media (prefers-color-scheme: dark) {
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(248, 250, 252, var(--tw-text-opacity));
  }
}
```

The auto-generated dark color can be overridden by the usual `dark:...` variant: `text-gray-900 dark:text-gray-100`.

```css
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgba(15, 23, 42, var(--tw-text-opacity));
}
@media (prefers-color-scheme: dark) {
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(248, 250, 252, var(--tw-text-opacity));
  }
}
@media (prefers-color-scheme: dark) {
  .dark\\:text-gray-100 {
    --tw-text-opacity: 1;
    color: rgba(241, 245, 249, var(--tw-text-opacity));
  }
}
```

### Rules

> based on ideas from [UnoCSS](https://github.com/antfu/unocss)

```js
// defineConfig is optional but helps with type inference
defineConfig({
  rules: [
    // Some rules
    ['hidden', { display: 'none' }],

    // Table Layout
    // .table-auto { table-layout: auto }
    // .table-fixed { table-layout: fixed }
    ['table-(auto|fixed)', 'tableLayout'],

    // dynamic
    ['table-', (match, context) => /* ... */],

    // Some aliases
    // shortcut: styles are generated as defined by twind — same as if they where used alone
    // shortcut to multiple utilities
    ['card', 'py-2 px-4 font-semibold rounded-lg shadow-md'],

    // dynamic shortcut — `$$` is everything after the match eg `btn-red` -> `red`
    ['card-', ({ $$ }) => `bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg`],

    // single utility alias — need to use `~(...)` as it would be otherwise recognized as a CSS property
    ['red', '~(text-red-100)'],

    // apply: styles are generated in order they are declared
    // apply to multiple utilities
    ['btn-green', '@(bg-green-500 hover:bg-green-700 text-white)'],

    // dynamic apply
    ['btn-', ({ $$ }) => `@(bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg)`],

    // Using cx
    ['highlight(-rounded)?', ({ 1: rounded }) => cx({ 'bg-yellow-200': true, rounded })],

    // Using css
    [
      'target-new-tab',
      css`
        target-name: new;
        target-new: tab;
      `,
    ],
    // dynamic
    [
      'target-new-(tab|window)',
      ({ 1: $1 }) => css`
        target-name: new;
        target-new: ${$1};
      `,
    ],

    // Using style
    // `box?color=coral` -> `.box\\?color\\=coral{background-color:coral}`
    // `box?rounded` -> `.box\\?rounded{border-radius:0.25rem}`
    // `box?color=coral&rounded` -> `.box\\?color\\=coral\\&rounded{background-color:coral;border-radius:0.25rem}`
    // `box?color=purple&rounded=md` -> `.box\\?color\\=purple\\&rounded\\=md{background-color:purple;border-radius:0.375rem}`
    [
      'box\\?(.+)',
      style({
        props: {
          color: {
            coral: css({
              backgroundColor: 'coral',
            }),
            purple: css`
              background-color: purple;
            `,
          },
          rounded: {
            '': 'rounded',
            md: 'rounded-md',
          },
        },
      }),
    ],
  ],
})
```

### Hash

#### hash all shortcuts and apply

```js
defineConfig({
  hash(className, defaultHash) {
    if (/^[~@]\(/.test(className)) {
      // a shortcut like `~(...)`
      // an apply like `@(...)`
      return defaultHash(className)
    }

    return className
  },
})
```

#### add namespace/scope to all classes

```js
defineConfig({
  hash(className) {
    return `.scoped ${className}`
  },
})
```

## Browser Support

In general, Twind is designed for and tested on the latest stable versions of Chrome, Firefox, Edge, and Safari. It does not support any version of IE, including IE 11.

For automatic vendor prefixing include the [@twind/preset-autoprefix](https://github.com/tw-in-js/twind/tree/next/packages/preset-autoprefix) preset.

For more details see [Tailwind CSS › Browser Support](https://tailwindcss.com/docs/browser-support).

The following JS APIs may need polyfills:

- [Array.flatMap](https://caniuse.com/mdn-javascript_builtins_array_flatmap)
  - Edge<79, Firefox<62, Chrome<69, Safari<12, Opera<56
  - [polyfill](https://www.npmjs.com/package/array-flat-polyfill)

When using `style()` within `config.rules`:

- [Object.fromEntries](https://caniuse.com/mdn-javascript_builtins_object_fromentries)
  - Edge<79, Firefox<63, Chrome<73, Safari<12.2, Opera<60
  - [polyfill](https://www.npmjs.com/package/object.fromentries) or [@ungap/from-entries](https://github.com/ungap/from-entries)
- [URLSearchParams](https://caniuse.com/urlsearchparams)
  - Edge<17, Firefox<44, Chrome<49, Safari<10.3, Opera<36
  - [polyfill](https://www.npmjs.com/package/url-search-params-polyfill) or [@ungap/url-search-params](https://github.com/ungap/url-search-params)
