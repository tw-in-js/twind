---
'@twind/preset-ext': patch
'@twind/preset-tailwind': patch
---

named groups (`group~{name}-{modifier}`) and peers (`peer~{name}-{modifier}`)

```html
<div class="group~project bg-white hover:bg-blue-500 ...">
  <p class="text-gray-900 group~project-hover:text-white ...">New Project</p>
  <div class="group~create bg-gray-100 hover:bg-green-500 ...">
    <p class="text-gray-500 group~create-hover:text-white ...">
      Create a new project from a variety of starting templates.
    </p>
  </div>
</div>
```
