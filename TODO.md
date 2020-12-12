- Next Steps

  - Name: gusty
  - Docs Repo @luke
  - Small Landing Page @luke
  - Presets Issue @sastan
  - Examples
    - vanilla, svelte, preact, react, vue @luke
    - deploy to unpkg
  - benchmarks in core: @sastan
    1. https://github.com/cristianbote/goober/tree/master/benchmarks
    2. create an realistic example

- Packages

  - Server Side Rendering
  - @tw-in-js/legacy - for IE11 with reset and polyfills
  - @tw-in-js/css: css and keyframes
  - @tw-in-js/styled - like styled components (https://github.com/cristianbote/goober/tree/master/benchmarks)
  - @tw-in-js/eslint-plugin - nice to have
  - @tw-in-js/tw.macro - maybe?
  - @tw-in-js/extensions
    - border gradients: https://t.co/W7YVS7f0Jp
    - scroll snap: https://t.co/7xqvpFQ9Qu
    - „on“ colors
    - Floating labels: https://t.co/g5TMqIBh4b?ssr=true
    - Stretched link: https://v5.getbootstrap.com/docs/5.0/helpers/stretched-link/
    - and others (see Plugins below)

- Docs

  - differences
    - tw.macro requires a build step and a run time lib (emotion, styled-components, ...)

- Ideas

  - presets: https://tailwindcss.com/docs/presets
  - benchmark using https://github.com/A-gambit/CSS-IN-JS-Benchmarks
  - size comparison: build same page with other libs and compare size
  - _"on"_ colors: generate matching contrast color and use that one as text/background color
  - play mode
  - on manual class name change in dev-tools and generate that directive
  - adapter for standard tailwindcss plugins

- Theme

  - live theme updates
  - track used theme values and re-translate

- Plugins

  - plugin api like tailwind: `setup({ plugins: [typography] })`
  - https://www.npmjs.com/package/@savvywombat/tailwindcss-grid-areas
  - https://www.npmjs.com/package/tailwindcss-ripple
  - https://github.com/tailwindlabs/tailwindcss-aspect-ratio
  - https://github.com/innocenzi/tailwindcss-scroll-snap
  - https://github.com/aerni/tailwindcss-rfs
  - https://github.com/jhta/tailwindcss-truncate-multiline#
  - https://github.com/opdavies/tailwindcss-plugin-skip-link
  - https://github.com/bradlc/tailwindcss-type

- Links
  - https://github.com/aniftyco/awesome-tailwindcss
  - https://nerdcave.com/tailwind-cheat-sheet
