# Twind Docs

The official documentation site for Twind. Powered by [VitePress](https://vitepress.vuejs.org/).

[https://twind.dev](https://twind.dev)

## Installation Guide

Clone the source code

```
git clone git@github.com:gojutin/twind.dev.git
```

Install the dependencies

```
yarn
```

Run the dev server

```
yarn run start
```

Build the site (builds to `.vitepress/dist/`)

```
yarn run build
```

## TypeDoc

When you run `yarn run typedoc` from the root of the project, TypeDoc creates a documentation site (collection of HTML files) of all the modules and places it in `website/public/typedoc`, where they are later accessed via iframes. This works because VitePress automatically exposes any files placed in the `public` folder, preventing us from having to separately deploy the Typedoc docs.
