# Roadmap

## Documentation

- [ ] why twind?
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
- [ ] examples: template with all lang and css features
- [ ] explain and examples of both modes (observe/shim vs library) with example
- [ ] how to create a component library: shortcuts vs apply vs style
- [ ] migration from v0.16 guide
- [ ] common patterns
- [ ] debugging the generated CSS in the browser (dom sheet)
- [ ] link to [transform css to tailwind](https://tailwind-converter.netlify.app/)
- redirects
  - [x] 'chat.twind.style' -> 'https://discord.gg/3fwqsmXNYK'
- [x] 'cdn.twind.style' as proxy for 'https://cdn.jsdelivr.net/npm/@twind/cdn@next' or jspm.io
  - redirects do not work because of cors issue
- [x] add https://twind.style/twind-logo-animated.svg for use in github readme
- update discord welcome with link to website
- [ ] page about dist tags and stes

  - https://support.google.com/chrome/a/answer/9027636?hl=en
  - https://docusaurus.io/community/release-process#stable-version
  - latest: latest stable release - published by changesets/action
  - next: upcoming release - published on every commit to main
  - canary: the latest dev release (https://docusaurus.io/community/canary) - published for PR commits

  - sites

    - latest: `twind-run.pages.dev` (`twind.run`) latest stable release - published on release
    - next: `next.twind-run.pages.dev` upcoming release - published on every commit to main
    - canary: `pr-*.twind-run.pages.dev` - published for PR commits
    - version: `v1-0-0-next-39.twind-run.pages.dev` - specific version

      Branch name aliases are lowercased and non-alphanumeric characters are replaced with a hyphen — for example, the `fix/api` branch creates the `fix-api.<project>.pages.dev` alias.

## v1

- ci:

  - only publish pre-releases if something package related has changed: https://github.com/dorny/paths-filter
  - only build packages that have changed: https://github.com/pnpm/pnpm/pull/2201

- @twind/devtools:
  - enumerate all classes and inject as empty for dev tools
- @twind/with-remix: https://github.com/remix-run/remix/issues/1804
- @twind/preset-\* from tailwind core
- @twind/styled (previously @twind/react)
  - Global: https://emotion.sh/docs/globals
  - createGlobalStyles: https://goober.js.org/api/createGlobalStyles
  - createGlobalStyle: https://styled-components.com/docs/api#createglobalstyle
  - @twind/styled/css - like styled-components eg using css
- framework integrations
  - solid, wmr, nuxt, vue, stenciljs, angular, qwick, solidstart, fresh, marko6...
  - https://vercel.com/templates
- development condition
  — [x] let distilt create development bundles
  - [x] warnings: console.warn(`[twind] unknown rule "${value}"`)
  - [ ] additional checks
  - [ ] performance marks for devtools
- perf: large website with many different rules
- pug support: https://github.com/tw-in-js/twind/issues/198
- how to create a PR in contributing guide: https://codesandbox.io/docs/git
- support `is(:hover,:focus-visible):underline`? in preset-ext
  - maybe as `is-hover,focus-visible:underline`
  - same for `:where` and `:has`
- cdn.twind.style: auto register passed presets - no explicit `install(presets: [...])` call
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
- a package to make it easy to create lightweight versions of presets (like https://lodash.com/custom-builds)
- postcss plugin like tailwindcss for SSR

  ```css
  @twind;
  ```

- `ensure`: like setup but keeps track of presets and merges them

  ```js
  // package a
  import { ensure } from 'twind'
  ensure(presetTailwind())

  // package b
  import { ensure } from 'twind'
  ensure(presetTailwind(), presetTailwindForms())
  ```

## v2

- fully typed theme
