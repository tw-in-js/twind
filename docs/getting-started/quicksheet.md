# Quick Reference (Cheatsheet)

## Useful Links
- Website: [https://twind.dev/](https://twind.dev/)
- Website Docs: [https://twind.dev/docs/](https://twind.dev/docs/)
- GitHub: [https://github.com/tw-in-js/twind](https://github.com/tw-in-js/twind)
- GitHub Docs: [https://github.com/tw-in-js/twind#documentation](https://github.com/tw-in-js/twind#documentation)

## Installation
[View in Docs](https://twind.dev/docs/handbook/getting-started/installation.html)

```tsx
import {tw} from 'https://cdn.skypack.dev/twind'; // requires type="module"
// or
import {tw} from 'twind';
```

## Configuration

[View in Docs](https://twind.dev/docs/handbook/getting-started/customize-the-theme.html)

The `setup` function can optionally be used to configure and extend your theme.



```tsx
import { setup, strict, voidSheet } from 'twind';
import * as colors from 'twind/colors'; // Tailwind V2 colors

setup({
  theme: {
    extend: {
			gray: colors.trueGray,
      colors: { hotpink: '#FF00FF' },
      rotate: { 5: '5deg' },
    },
  },
})

// Advanced
setup({
  preflight: false, // do not include base style reset (default: use tailwind preflight)
  mode: strict, // throw errors for invalid rules: "strict", "warn" or "silent"- default is warn
  hash: true, // hash all generated class names (default: false)
  theme: {}, // define custom theme values (default: tailwind theme)
  darkMode: 'class', // use a different dark mode strategy (default: 'media')
  sheet: voidSheet, // use custom sheet (default: cssomSheet in a browser or no-op)
})
```

## The Shim
[View in Docs](https://twind.dev/docs/handbook/getting-started/using-the-shim.html)

The shim allows you to use Twind syntax directly in a class attribute without the need of the `tw` function. It is useful for gradual refactoring or quick prototyping.

```js
import 'twind/shim`;
```

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



## The `tw` function
[View in Docs](https://twind.dev/docs/handbook/getting-started/styling-with-twind.html#the-tw-function)

The `tw` function is responsible for composing styles and injecting the derived styles into the document.


- Template Literal (recommended)

    ```tsx
    tw`bg-gray-200 ${false && 'rounded'}`
    ```

- Objects
  
  ```tsx
  tw({ 'bg-gray-200': true, rounded: false, underline: isTrue() })
  ```

- Strings

    ```tsx
    tw('bg-gray-200', true && 'rounded', 'underline')
    ```

- Arrays

    ```tsx
    tw(['bg-gray-200'], ['', 0, false, 'rounded'], [['underline']])
    ```

- Variadic (mixed)

    ```tsx
     tw('bg-gray-200', [
      1 && 'rounded',
      { underline: false, 'text-black': null },
      ['text-lg', ['shadow-lg']],
    ])
    ```
## Grouping

[View in Docs](https://twind.dev/docs/handbook/getting-started/thinking-in-groups.html)

The Twind compiler provides a terse syntax for grouping related classes together in an untuitive way. 

- Directive Grouping

    ```tsx
    tw`border(2 black opacity-50 dashed)`
    ```

- Variant Grouping

    ```tsx
    tw`
      bg-red-500 shadow-xs
      sm:(
        bg-red-600
        shadow-md
      )
      md:(bg-red-700 shadow)
      lg:(bg-red-800 shadow-xl)
    `
    tw`w(1/2 sm:1/3 lg:1/6) p-2`
    ```

- Mixed Groupings

    ```tsx
    tw`sm:(border(2 black opacity-50 hover:dashed))`
    tw`border(md:(2 black opacity-50 hover:dashed))`
    tw`divide(y-2 blue-500 opacity(75 md:50))`
    tw`rotate(-3 hover:6 md:(3 hover:-6))` // (Negated value)
    ```

- Self Reference

    ```tsx
    tw`ring(& pink-700 offset(4 pink-200))`)
    tw`bg-blue-500(hover:& focus:& active:&) rounded-full`
    ```

- Inherited Groups

    ```tsx
    tw`
      hover:${css({ '&::after': { content: '🌈' } })}

      hover:${({ tw }) => ({
        sm: tw`underline`,
        lg: 'no-underline line-through',
      })}

      sm:${['rounded']}
    `
    ```

## Tailwind Extensions

- **SYNTAX**
    - Custom syntax for grouping directives and variants (see grouping above)
    - Important!

        ```tsx
         <p className="text-red-500!">Hi</p>
        ```

- **VARIANTS**
    - Every variant can be applied to every directive!
    - Dark mode is always available!
    - Most pseudo classes can be used as variant or `group-*` variant
    - `siblings:*` - General sibling combinator (`& ~ *`)

        ```tsx
        <p>This is not red.</p>
        <p class="siblings:text-red-500">Here is a paragraph.</p>
        <p>And here is a red paragraph!</p>
        <p>And this is a red paragraph!</p>
        ```

    - `sibling:*` - Adjacent sibling combinator (`& + *`)

        ```tsx
        <p>This is not red.</p>
        <p class="sibling:text-red-500">Here is a paragraph.</p>
        <p>And here is a red paragraph!</p>
        <p>This is not red!</p>
        ```

    - `children:*` - Child combinator (`& > *`)

        ```tsx
        <div class="children:(border my-2)">
          <p>This paragraph has <em>emphasized text</em> in it.</p>
          <p>This paragraph has <em>emphasized text</em> in it.</p>
        </div>
        ```

    - Inherited CSS Properties
        - `border-collapse`
        - `border-separate`
        - `cursor-*`
        - `font-*`
        - `invisible`
        - `leading-*`
        - `list-*`
        - `text-*`
        - `tracking-*`
        - `visible`
        - `whitespace-*`
- **DIRECTIVES**
    - `text-underline`
    - `text-no-underline`
    - `text-line-through`
    - `text-uppercase`
    - `text-lowercase`
    - `text-capitalize`
    - `font-italic`
    - `font-no-italic`
    - `bg-gradient-to-*` is built-in
    - `border` and `divide`- Every permutation of t,r,b,l (can't combine x and y)
    - IE11 support for `rotate`, `scale`, `skew`, and `translate`
    - `appearance-*` supports all values

    EXAMPLE COMPONENT

    ```tsx
    import * as React from 'react';
    import { tw } from 'twind';

    export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
      className?: string;
      style?: React.CSSProperties;
    }

    export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      (props, ref) => {
        const { children, className, ...rest } = props;
        return (
          <button
            ref={ref}
            // BEFORE
            // className="w-full md:w-auto bg-blue-500 text-sm text-white uppercase px-4 py-1 rounded-full border-none hover:bg-blue-600 focus:bg-blue-600 transition-colors duration-300 ring-blue-200"
            // AFTER
            className={tw`
              w(full md:auto) 
              bg(blue(500 600(hover:& focus:&))) 
              text(sm white uppercase) 
              px-4 
              py-1 
              rounded-full 
              border-none 
              transition-colors 
              duration-300 
              ring-blue-200
            `}
            {...rest}
          >
            {children}
          </button>
        );
      },
    );
    ```

Continue to {@page Browser Support}
