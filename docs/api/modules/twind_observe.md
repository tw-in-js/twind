# Module: twind/observe

[![Documentation](https://flat.badgen.net/badge/icon/Documentation?icon=awesome&label)](https://twind.dev/docs/modules/twind_observe.html)
[![Github](https://flat.badgen.net/badge/icon/tw-in-js%2Ftwind%2Fsrc%2Fobserve?icon=github&label)](https://github.com/tw-in-js/twind/tree/main/src/observe)
[![Module Size](https://flat.badgen.net/badgesize/brotli/https:/unpkg.com/twind/observe/observe.js?icon=jsdelivr&label&color=blue&cache=10800)](https://unpkg.com/twind/observe/observe.js 'brotli module size')
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/twind/observe/observe.d.ts)

> Allows to copy-paste tailwind examples. This feature can be used together with your favorite framework without any additional setup.

The `twind/observe` modules allows to use the `class` attribute for tailwind rules. If such a rule is detected the corresponding CSS rule is created and injected into the stylesheet. _No need for `tw`_ but it can be used on the same elements as well.

> This is meant for advanced use cases. Most of the time you may want to use [twind/shim](twind_shim.md).

## Usage

```js
import { observe } from 'twind/observe'

observe(document.body)

document.body.innerHTML = `
  <main class="h-screen bg-purple-400 flex items-center justify-center">
    <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">
      This is Twind!
    </h1>
  </main>
`
```

> 🚀 [live and interactive shim demo](https://esm.codes/#aW1wb3J0IHsgb2JzZXJ2ZSB9IGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L3R3aW5kL29ic2VydmUnCgpvYnNlcnZlKGRvY3VtZW50LmJvZHkpCgpkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IGAKICA8bWFpbiBjbGFzcz0iaC1zY3JlZW4gYmctcHVycGxlLTQwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciI+CiAgICA8aDEgY2xhc3M9ImZvbnQtYm9sZCB0ZXh0KGNlbnRlciA1eGwgd2hpdGUgc206Z3JheS04MDAgbWQ6cGluay03MDApIj4KICAgICAgVGhpcyBpcyBUd2luZCEKICAgIDwvaDE+CiAgPC9tYWluPgpg)

All Twind syntax features like [grouping](https://github.com/tw-in-js/twind/blob/main/docs/grouping.md) are supported within class attributes

> If you want to simplify the instantiation and automatically observe take look at [twind/shim](twind_shim.md).

## Customization

`twind/observe` uses the [default/global `tw`](twind.md#tw) instance if not configured otherwise. You can provide a custom instance in several ways:

```js
import { create } from 'twind'
import { observe, createObserver } from 'twind/observe'

// Create a custom instance
const instance = create(/* ... */)

// 1. As second parameter
observe(document.body, instance)

// 2. As this context
observe.call(instance, document.body)
observe.bind(instance)(document.body)

// 3. Use the factory
createObserver(instance).observe(document.body)
```

## API

```js
import { createObserver, observe } from 'twind/observe'

const observer = createObserver(/* custom instance */)

// Or to start observing an element right away
// const observer = observe(node, /* custom instance */)

// Start observing a node; can be called several times with different nodes
observer.observe(node)

// Stop observing all nodes
observer.disconnect()
```

## Example

This example shows how a custom observer instance can be used to shim a web component.

> ❗ This example is using [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and `DocumentOrShadowRoot.adoptedStyleSheets` which have [limited browser support](https://caniuse.com/mdn-api_documentorshadowroot_adoptedstylesheets) at the moment (December 2020).

```js
import { LitElement, html } from 'lit-element'
import { create, cssomSheet } from 'twind'
import { createObserver } from 'twind/observe'

// 1. Create separate CSSStyleSheet
const sheet = cssomSheet({ target: new CSSStyleSheet() })

// 2. Use that to create an own twind instance
const instance = create({ sheet })

class TwindElement extends LitElement {
  // 3. Apply the same style to each instance of this component
  static styles = [sheet.target]

  // 4. Start observing class attributes changes
  connectedCallback() {
    super.connectedCallback()
    this._observer = createObserver(instance).observe(this.renderRoot)
  }

  // 5. Stop observing class attributes changes
  disconnectedCallback() {
    super.disconnectedCallback()
    this._observer.disconnect()
  }

  render() {
    // 5. Use tailwind rules in class attributes
    return html`
      <main class="h-screen bg-purple-400 flex items-center justify-center">
        <h1 class="font-bold text(center 5xl white sm:gray-800 md:pink-700)">This is Twind!</h1>
      </main>
    `
  }
}

customElements.define('twind-element', TwindElement)

document.body.innerHTML = '<twind-element></twind-element>'
```

> 🚀 [live and interactive demo](https://esm.codes/#aW1wb3J0IHsgTGl0RWxlbWVudCwgaHRtbCB9IGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L2xpdC1lbGVtZW50JwppbXBvcnQgeyBjcmVhdGUsIGNzc29tU2hlZXQgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZCcKaW1wb3J0IHsgY3JlYXRlT2JzZXJ2ZXIgfSBmcm9tICdodHRwczovL2Nkbi5za3lwYWNrLmRldi90d2luZC9vYnNlcnZlJwoKY29uc3Qgc2hlZXQgPSBjc3NvbVNoZWV0KHsgdGFyZ2V0OiBuZXcgQ1NTU3R5bGVTaGVldCgpIH0pCgpjb25zdCB7IHR3IH0gPSBjcmVhdGUoeyBzaGVldCB9KQoKY2xhc3MgVHdpbmRFbGVtZW50IGV4dGVuZHMgTGl0RWxlbWVudCB7CiAgY3JlYXRlUmVuZGVyUm9vdCgpIHsKICAgIGNvbnN0IHNoYWRvdyA9IHN1cGVyLmNyZWF0ZVJlbmRlclJvb3QoKQogICAgc2hhZG93LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFtzaGVldC50YXJnZXRdCiAgICByZXR1cm4gc2hhZG93CiAgfQoKICBjb25uZWN0ZWRDYWxsYmFjaygpIHsKICAgIHRoaXMuX29ic2VydmVyID0gY3JlYXRlT2JzZXJ2ZXIoaW5zdGFuY2UpLm9ic2VydmUodGhpcy5yZW5kZXJSb290KQogIH0KCiAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7CiAgICB0aGlzLl9vYnNlcnZlci5kaXNjb25uZWN0KCkKICB9CgogIHJlbmRlcigpIHsKICAgIHJldHVybiBodG1sYAogICAgICA8bWFpbiBjbGFzcz0iaC1zY3JlZW4gYmctcHVycGxlLTQwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciI+CiAgICAgICAgPGgxIGNsYXNzPSJmb250LWJvbGQgdGV4dChjZW50ZXIgNXhsIHdoaXRlIHNtOmdyYXktODAwIG1kOnBpbmstNzAwKSI+CiAgICAgICAgICBUaGlzIGlzIFR3aW5kIQogICAgICAgIDwvaDE+CiAgICAgIDwvbWFpbj4KICAgIGAKICB9Cn0KCmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndHdpbmQtZWxlbWVudCcsIFR3aW5kRWxlbWVudCk7Cgpkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICc8dHdpbmQtZWxlbWVudD48L3R3aW5kLWVsZW1lbnQ+Jwo=)

## Implementation Details

This uses a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to detect changed class attributes or added DOM nodes. On detection the class attribute is parsed and translated by twind to inject the required classes into the stylesheet and the class attribute is updated to reflect the added CSS class names that may have been hashed.

## Table of contents

### Interfaces

- [ShimConfiguration](../interfaces/twind_observe.shimconfiguration.md)
- [TwindObserver](../interfaces/twind_observe.twindobserver.md)

## Functions

### createObserver

▸ `Const`**createObserver**(`options?`: [*ShimConfiguration*](../interfaces/twind_observe.shimconfiguration.md)): [*TwindObserver*](../interfaces/twind_observe.twindobserver.md)

Creates a new [TwindObserver](../interfaces/twind_observe.twindobserver.md).

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`options` | [*ShimConfiguration*](../interfaces/twind_observe.shimconfiguration.md) | to use    |

**Returns:** [*TwindObserver*](../interfaces/twind_observe.twindobserver.md)

Defined in: [src/observe/index.ts:53](https://github.com/gojutin/twind/blob/8f04bb3/src/observe/index.ts#L53)

___

### observe

▸ **observe**(`target`: Node, `config`: [*ShimConfiguration*](../interfaces/twind_observe.shimconfiguration.md) \| *undefined* \| *void*): [*TwindObserver*](../interfaces/twind_observe.twindobserver.md)

Creates a new [TwindObserver](../interfaces/twind_observe.twindobserver.md) and [start observing](../interfaces/twind_observe.twindobserver.md#observe) the passed target element.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`target` | Node | to shim   |
`config` | [*ShimConfiguration*](../interfaces/twind_observe.shimconfiguration.md) \| *undefined* \| *void* | to use    |

**Returns:** [*TwindObserver*](../interfaces/twind_observe.twindobserver.md)

Defined in: [src/observe/index.ts:138](https://github.com/gojutin/twind/blob/8f04bb3/src/observe/index.ts#L138)
