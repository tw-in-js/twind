# Installation

It is possible to install and thus use Twind in a multitude of different ways. We expose various different modules – from the latest es syntax to IIFE builds – with the aim of accommodating for as many dev setups as possible. This said, for the smallest size and fastest performance we recommend you use the esnext build.

> Although compatible with traditional bundlers no build step is required to use the module

## Importing as a local dependency

Most build tools rely on modules to be installed locally on the machine they are running on. Usually these modules are available on and installed via npm. Twind is no different in this regard.

1. Run the following command in your terminal, from your project root:

```sh
npm i twind
```

2. Then go ahead and import the module into your application using the bare module specifier:

```js
import { tw, setup } from 'twind'
```

Assuming you have your bundler configured correctly then you should now be able to just use the module.

## Importing as a remote dependency

Given that nearly all browsers support es modules now, sometimes it is desirable to import a module straight from from a CDN such as [skypack](https://skypack.dev/) or [unpkg](https://unpkg.com/).

1. Add the following line to a javascript file referenced by a script tag with `type="module"` like below:

```html
<script type="module">
  import { tw, setup } from 'https://cdn.skypack.dev/twind'
</script>
```

Assuming you have an internet connection then you should now be able to use the module.

<hr/>

Continue to [Basic Usage](./usage.md)
