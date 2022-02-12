# Roadmap

## Documentation

- framework: codehike +
  - remix
  - nextjs + preact
  - vite + preact + vite-plugin-ssr
- deployment: cloudflare pages
- why twind?
  - no build step
  - one line installation
  - grouping - but still atomic utilities
  - shortcuts
  - css
  - style
  - platform agnostic: browser, node, …
  - framework agnostic
  - comments
  - hashed class names
- playground
- examples: template with all lang and css features
- explain and examples of both modes (observe/shim vs library) with example
- how to create a component library: shortcuts vs apply vs style
- migration from v0.16 guide
- common patterns
- debugging the generated CSS in the browser (cssom sheet)
- link to [transform css to tailwind](https://tailwind-converter.netlify.app/)
- redirects
  - 'twind.style/discord' -> 'https://discord.com/invite/2aP5NkszvD'
  - 'twind.style/discussions' -> 'https://github.com/tw-in-js/twind/discussions'
  - 'twind.style/issues' -> 'https://github.com/tw-in-js/twind/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc'
  - 'cdn.twind.style' -> 'https://cdn.jsdelivr.net/npm/@twind/cdn@next'
- add https://twind.style/twind-logo-animated.svg for use in github readme
- update readmes

  ```md
  ## Documentation

  For full documentation, visit [twind.style/docs/preset-typography](https://twind.style/docs/preset-typography).

  ## Community

  For help, discussion about best practices, or any other conversation that would benefit from being searchable:

  [Discuss the Twind Typography preset on GitHub](https://twind.style/discussions)

  For casual chit-chat with others using the framework:

  [Join the Twind Discord Server](https://twind.style/discord)
  ```

## v1

- handle arbitrary prefix like `[length:...]`
- `ensure`: like setup but keeps track of presets and merges them

  ```js
  // package a
  import { ensure } from 'twind'
  ensure(presetTailwind())

  // package b
  import { ensure } from 'twind'
  ensure(presetTailwind(), presetTailwindForms())
  ```

- @twind/with-remix: https://github.com/remix-run/remix/issues/1804
- @twind/preset-\* from tailwind core
- @twind/styled (previously @twind/react)
  - Global: https://emotion.sh/docs/globals
  - createGlobalStyles: https://goober.js.org/api/createGlobalStyles
  - createGlobalStyle: https://styled-components.com/docs/api#createglobalstyle
  - @twind/styled/css - like styled-components eg using css
- framework integrations
  - solid, wmr, nuxt, vue, stenciljs, angular, ...
  - https://vercel.com/templates
- development condition — let distilt create development bundles
  - warnings: console.warn(`[twind] unknown rule "${value}"`)
  - completion infos
  - additional checks
  - performance marks for devtools
  - hints:
    - https://www.npmjs.com/package/genex
    - https://www.npmjs.com/package/simpexp
    - https://www.npmjs.com/package/regexgen
- perf: large website with many different rules
- pug support: https://github.com/tw-in-js/twind/issues/198
- how to create a PR in contributing guide: https://codesandbox.io/docs/git
- support `is(:hover,:focus-visible):underline`? in preset-ext
  - maybe as `is-hover,focus-visible:underline`
  - same for `:where` and `:has`
- @twind/cdn: parse style elements like tailwind? `<style type="text/tailwindcss">`

  https://github.com/tw-in-js/twind/issues/238#issuecomment-1021544996

  ```js
  // using a mutation observer?
  document.querySelectorAll('style[type~="twind/css"]').forEach((e) => {
    tw(css(e.textContent))
  })
  ```

- zero runtime
  - safelist, extractor, examples
- rewrite https://github.com/TanStack/tanstack.com
- ci: post on discord after release
- @twind/completions — provide autocompletion for classNames
  - https://npm.runkit.com/regexp-enumerator
  - https://www.npmjs.com/package/randexp
- a package to make it easy to create lightweight versions of presets (like https://lodash.com/custom-builds)
- postcss plugin like tailwindcss for SSR

  ```css
  @twind;
  ```

## v2

- fully typed theme
