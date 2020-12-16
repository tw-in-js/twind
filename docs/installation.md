# Installation

It is possible to install and thus use Twind in a multitude of different ways. We expose various different modules, from the latest es syntax to umds builds, with the hope of accommodating for as many dev setups as possible. This said, for the smallest size and fastest performance we recommend you use the esnext build.

## Importing as a local dependency

Most build tools rely on modules to be installed locally on the machine they are running. Usually these modules are available and downloaded from npm. Twind is no different in this regard.

1. Run the following command in your terminal, from your project root:

```sh
npm i twind
```

2. Then go ahead and import the module into your application using the bare module specifier:

```js
import { tw, setup } from 'twind'
```

Assuming you have your bundler configured to consume modules correctly then you should now be able to use the module.

## Importing as a remote dependency

Now that nearly all browsers support es-modules sometimes it is desirable to import a module straight from the internet from a CDN such as [skypack](https://skypack.dev/) or [unpkg](https://unpkg.com/).

1. Add the following line to a javascript file referenced by a script tag with `type="module"`:

```js
import { tw, setup } from 'https://cdn.skypack.dev/twind'
```

Assuming you have an internet connection then you should now be able to use the module.

## Named Exports

The module primarily exposes two named exports meant for general purpose use. However for more advanced use cases some internal functions are also exposed.

```js
import {
  tw, // A configured compiler function which abides by the default Tailwind theme
  setup, // A function for configuring the compiler with a theme and/or plugins
  create, // A function for creating a new unconfigured compiler instance
  virtualInjector, // An injector which collects style rules during server-side rendering
  cssomInjector, // An injector which inserts style rules through the CSS Object Model
  noOpInjector, // An injector placeholder which performs no operations useful for testing
  mode,
  warn,
  strict,
  autoprefix,
  noprefix,
} from 'twind'
```
