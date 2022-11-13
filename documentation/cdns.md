---
hidden: true
---

https://cdn.jsdelivr.net/npm/twind@next
https://cdn.jsdelivr.net/combine/npm/twind@next,npm/@twind/preset-autoprefix@next,npm/@twind/preset-tailwind@next

https://cdn.jsdelivr.net/npm/@twind/cdn@next
https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-ext@next

- default: https://cdn.twind.style

  - version: latest
  - presets: none
    -> https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-ext@next

- with presets: https://cdn.twind.style?presets=forms,typography,aspect-ratio,line-clamp
  -> https://cdn.jsdelivr.net/combine/npm/@twind/cdn@next,npm/@twind/preset-ext@next

- with dev: ?dev

## CDNs

- TODO note about pinned urls

```
https://www.skypack.dev/view/twind

version range / dist tag: optional
minify: via `?min`
browser specific build using `User-Agent` or `?dist=es2020`
bare access: yes
direct file access: yes
other features: TypeScript Declarations `?dts`

script: no

type="module"
package.json: exports

https://cdn.skypack.dev/twind@next?min
https://cdn.skypack.dev/@twind/preset-tailwind@next?min
https://cdn.skypack.dev/@twind/preset-tailwind@next/colors?min



https://www.jsdelivr.com/package/npm/twind

version range / dist tag: optional
minify: by using `.min` extension prefix
browser specific build: no
bare access: yes
direct file access: yes

script
package.json: jsdelivr, browser, main
https://cdn.jsdelivr.net/npm/twind
https://cdn.jsdelivr.net/npm/@twind/preset-tailwind
https://cdn.jsdelivr.net/npm/@twind/preset-tailwind/colors.global.js

type="module"
package.json: ??? module, exports
https://cdn.jsdelivr.net/npm/twind/+esm
https://cdn.jsdelivr.net/npm/@twind/preset-tailwind/+esm
https://cdn.jsdelivr.net/npm/@twind/preset-tailwind/colors.min.js


https://esm.sh

minify: enabled, to disable use `?dev`
browser specific build using `User-Agent` or `?target=es2020`
bare access: yes
direct file access: no
version range / dist tag: optional
other features: Bundle mode `?bundle`, Development mode `?dev`, Aliasing dependencies `?alias=react:preact/compat`, Web Worker `?worker`

script: no

type="module"
package.json: exports
https://esm.sh/twind
https://esm.sh/twind/@twind/preset-tailwind
https://esm.sh/twind/@twind/preset-tailwind/colors



https://jspm.dev

minify: no
browser specific build: no
bare access: yes
direct file access: no
version range / dist tag: optional

script: no

type="module"
package.json: exports
https://jspm.dev/twind@next


https://jspm.org

minify: yes
browser specific build: no
bare access: yes
direct file access: no
version range / dist tag: optional
other features: SystemJS, [import-maps](https://generator.jspm.io/#U2NhYGBkDM0rySzJSU1hKCnPzEtxMNQz0DPQzUutKNEzAwB45bqFIQA)

script: no

type="module"
package.json: exports
One must use [JSPM:GENERATOR](https://generator.jspm.io/#U2NhYGBkDM0rySzJSU1hKCnPzEtxMNQz0DPQzUutKNEzAwB45bqFIQA)


https://unpkg.com/

version range / dist tag: optional
minify: no
browser specific build: no
bare access: yes
direct file access: yes

script
package.json: unpkg, browser
https://unpkg.com/twind
https://unpkg.com/@twind/preset-tailwind
https://unpkg.com/@twind/preset-tailwind/colors.global.js

type="module" - not minified
package.json: module, main
https://unpkg.com/twind?module
https://unpkg.com/@twind/preset-tailwind?module
https://unpkg.com/@twind/preset-tailwind/colors.js?module



https://cdnjs.com/libraries/twind

version range / dist tag: required
minify: by using `.min` extension prefix
browser specific build: no
bare access: yes
direct file access: yes

script
https://cdnjs.cloudflare.com/ajax/libs/twind/0.16.16/twind.global.js
https://cdnjs.cloudflare.com/ajax/libs/@twind/preset-tailwind/0.16.16/colors.global.js

type="module"
https://cdnjs.cloudflare.com/ajax/libs/twind/0.16.16/twind.min.js
https://cdnjs.cloudflare.com/ajax/libs/@twind/preset-tailwind/0.16.16/colors.min.js

```
