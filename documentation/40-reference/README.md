# Reference

## Lang

- grouping variants
  - `hover:(underline font-bold)` -> `hover:underline hover:font-bold`
- grouping utilities
  - `text-(sm green-500)` -> `text-sm text-green-500`
- grouping important
  - `!(text-(sm green-500))` -> `!text-sm !text-green-500`
- inline apply: styles are generated in order they are declared
  - `@(underline font-bold)` -> `@(underline,font-bold)`
  - `Link@(underline font-bold)` -> `Link#12345`
- inline shortcut: style are generated as defined by twind — same as if they where used alone
  - `~(underline font-bold)` -> `~(underline,font-bold)`
  - `Link~(underline font-bold)` -> `Link#abcdef`

## API

The following functions are all exports from `twind`.

### _Shim Mode_: observe class attributes to inject styles

- `setup(config, sheet?, target?): Twind`: configures the global `tw` instance, observes all class attributes and inject there styles into the DOM; returns a twind instance
- `tw`: the global twind instance updated by each `setup` call

### _Library Mode_: use `tw` to inject styles

- `twind(config, sheet?): Twind`: creates a custom twind instance (`tw`)
- `observe(tw, target?)`: observes all class attributes and inject there styles into the DOM

### Twind instance — `tw`

- global twind instance: `import { tw } from 'twind'`
- `tw(className)`: injects a className string into the sheet and return the resulting class names
- `tw.theme(section?, key?, defaultValue?)`: access the current theme
  - `tw.theme()`: returns the whole thene
  - `tw.theme(section)`: returns the whole section
  - `tw.theme(dottedKey, defaultValue?)`: returns the current value
  - `tw.theme(section?, key?, defaultValue?)`: returns the theme value
- `tw.target`: the sheet target of this instance (`string[]`, `HTMLStyleSheet`, `CSSStyleSheet`)
- `tw.clear()`: clears all CSS rules from the sheet
- `tw.destroy()`: remove the sheet from the document

### Utilities

- `defineConfig(config)`: define a configuration object for `setup` or `twind`
- `tx(...args)`: creates a class name from the given arguments and injects the styles (like `tw(cx(...args))`)
  - `tx.bind(tw)`: binds the `tx` function to a custom twind instance; returns a new `tx` function

### Helper functions that generate class names but do **not** inject styles

These can be used to generate class names that are then

a) set the class attribute on an element (_Shim Mode_)<br>
b) used with `tw` to inject styles and return a class name (_Library Mode_)

- `cx(...args)`: creates a class name from the given arguments; no styles injected
- `css(...args)`: creates a class name from the given arguments; no styles injected
- `shortcut(...args)`: creates a class name from the given arguments; order of styles determined by twind; no styles injected
  - `shortcut.Button(...args): creates a named class name from the given arguments; order of styles determined by twind; no styles injected
  - `~(...)` or `Button~(...)`: within a token
- `apply(...args)`: creates a class name from the given arguments; order of styles determined by order in args; no styles injected
  - `apply.Button(...args): creates a named class name from the given arguments; order of styles determined by order in args; no styles injected
  - `@(...)` or `Button@(...)`: within a token
  - `@apply ...` or `{ '@apply': '...' }`: within CSS string or object
- `style(options)`: creates a stitches like helper; returns a `style` function
  - `style(props)`: creates a class name from the given props; no styles injected

### Mostly server side: used to update an html string with styles

- `inline(html, tw? | {tw, minfiy}?)`: updates all class attributes in html string and inject there styles into the head as style element; returns the updated html string
- `extract(html, tw?)`: updates all class attributes from html string; returns the updated html string and the CSS
- `consume(html, tw?)`: updates all class attributes from html string; returns the updated html string and injects all styles into `tw`

### Sheets

- `virtual()`: collect styles into an array
- `cssom()`: uses a fast DOM sheet — bad for debugging
- `dom()`: uses a slow DOM sheet — great for debugging
- `stringify(target)`: returns the CSS string of a sheet target

## Config

- hash all shortcuts and apply

  ```js
  setup({
    hash(className, defaultHash) {
      if (/^[\w-]*[~@]\(/.test(className)) {
        // a shortcut like `~(...)` or `Button~(...)`
        // an apply like `@(...)` or `Button@(...)`
        return defaultHash(className)
      }

      return className
    },
  })
  ```
