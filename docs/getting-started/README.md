> 🙋 If you find any incorrect or missing documentation then please [open an issue](https://github.com/tw-in-js/twind/issues) for discussion.

This is the user manual for the `twind` library. A small compiler that turns Tailwind short hand into CSS rules at run, build or serve time. If you have used Tailwind and/or a CSS-in-JS solution before then most of the API will feel very familiar.

We are confident that feature parity with Tailwind V2 has been achieved. We recommend you refer the Tailwind documentation site for anything non Twind implementation specific; information around directives, variants, theming etc.

> 📚 **[Tailwind Documentation](https://tailwindcss.com)**

Despite being very flexible and powerful, it was our intention to keep the surface API as minimal as possible. We appreciate that Twind is likely to be used by developers & designers alike and so we try provide sensible defaults out of the box, with little to no need for {@page Setup | customization}.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Quickstart](#quickstart)
- [twind/shim](#twindshim)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quickstart

> 💡 Note that examples are given in vanilla JS but the module is compatible with all popular frameworks

Getting started with the library requires no configuration, build step or even {@page Installation | installation} if you use [skypack](https://skypack.dev/), [unpkg](https://unpkg.com/) or [jspm](https://jspm.dev/) – see the {@page Installation} guide for more information.

```js
import { tw } from 'https://cdn.skypack.dev/twind'

document.body.innerHTML = `
  <main class="${tw`bg-black text-white`}">
    <h1 class="${tw`text-xl`}">This is Tailwind in JS!</h1>
  </main>
`
```

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgdHcgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKCmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gYAogIDxtYWluIGNsYXNzPSIke3R3YGgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfSI+CiAgICA8aDEgY2xhc3M9IiR7dHdgZm9udC1ib2xkIHRleHQoY2VudGVyIDV4bCB3aGl0ZSBzbTpncmF5LTgwMCBtZDpwaW5rLTcwMClgfSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

Using the exported {@page Styling with Twind | tw} function results in the compilation of the rules like `bg-black text-white` and `text-xl` exactly as specified in the [Tailwind documentation](https://tailwincss.com/docs). For convenience the default [tailwind theme](https://github.com/tailwindlabs/tailwindcss/blob/v1/stubs/defaultConfig.stub.js) is used along with the preflight [base styles](https://tailwindcss.com/docs/preflight) if neither are {@page Setup | provided by the developer}.

## twind/shim

> 💡 Seamless integration with existing Tailwind HTML. This feature can be used together with your favorite framework without any additional setup.

The {@page Using the Shim | twind/shim} module allows to use the `class` attribute for tailwind rules. If such a rule is detected the corresponding CSS rule is created and injected into the stylesheet. _No need for `tw`_ but it can be used on the same page as well (see example below).

```html
<!DOCTYPE html>
<html lang="en" hidden>
  <head>
    <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
  </head>
  <body>
    <main class="h-screen bg-purple-400 flex items-center justify-center">
      <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
    </main>
  </body>
</html>
```

> 🚀 [live and interactive shim demo](https://esm.codes/#aW1wb3J0ICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9zaGltJwoKZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBgCiAgPG1haW4gY2xhc3M9Imgtc2NyZWVuIGJnLXB1cnBsZS00MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIiPgogICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgIFRoaXMgaXMgVHdpbmQhCiAgICA8L2gxPgogIDwvbWFpbj4KYA==)

<hr/>

Continue to {@page Installation}
