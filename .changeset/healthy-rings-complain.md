---
'@twind/preset-tailwind': patch
---

attribute selector as modifier for groups and peers

```html
<div class="group bg-white hover:bg-blue-500 ...">
  <p class="text-gray-900 group[disabled]:text-gray-200 ...">Project Name</p>
</div>
```

With named groups/peers:

```html
<div class="group~project bg-white hover:bg-blue-500 ...">
  <p class="text-gray-900 group~project[disabled]:text-gray-200 ...">Project Name</p>
</div>
```
