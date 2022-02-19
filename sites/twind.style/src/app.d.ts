/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
  interface Locals {}

  interface Platform {}

  interface Session {}

  interface Stuff {
    docStartHref: string
    editPath?: string
    nav?: import('../pages/docs/[pages].json').Nav
  }
}
