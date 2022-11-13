# twind.run

This is the [Twind playground](https://twind.run).

## Developing

Once you've [set up the repo](../../CONTRIBUTING.md), `cd` into this directory and start the dev server:

```bash
cd sites/twind.run
pnpm start
```

## Acknowledge

- tailwindplay
- jspm.org
- skypack.dev
- unocss

## Ideas

- TODO: 404 and error like twind.style
- TODO: service worker?
- TODO: static/\_headers are not included in build
- TODO: safari: Feature policy 'Fullscreen' check failed for iframe with origin 'https://challenges.cloudflare.com' and allow attribute ''
- TODO: safari copy to clipboard does not work
- inline version annotation like runkit for imports in js
- TODO: splitpane splitter hover add ring for better visibility
- TODO: help and feedback icon like https://runkit.com/sastan/63559e16d1d14c000845c889#
- TODO: suggest-widget and hover-widget are not fully visible sometimes
- not found page with suggestions template or search in existing key (maybe with fuzzy search of the key that was not found)
- autocomplete `theme(` within arbitrary value
- Quick Fix (suggestions) for unknown class names: CodeActionProvider
- allow filtering of layers in result view
- add theme switcher to preview in header with reload button
- manage dependencies like codesandbox
- workspace
  - save and fork
  - list of workspaces after login
- responsive preview
  - pop-up with several content previews for different screen sizes
  - devices sizes: https://codepen.io/sastan/pen/dyOjWbV
  - show current preview size on resize
- capture console.\* from iframe, with `Clear on reload` toggle and clear button
- intercept cmd-s to save workspace as zip
- show preview update with spinner and status messages
- copy whole document
- Add performance marks and measure in DEV build (https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API/Using_the_User_Timing_API)
- preview expose tw, cx, tx, css in globalThis for scripts within html
- something like https://uno.antfu.me to explore (explore.twind.style)
- on hover link to github based on source (maybe search for source in github)
