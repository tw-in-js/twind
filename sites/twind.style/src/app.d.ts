/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
  interface Locals {}

  interface Platform {}

  interface Session {}

  interface Stuff {
    docStartHref: string
    file?: string
    nav?: import('@/docs/index.json').Body
  }
}

declare module '*.md' {
  // "unknown" would be more detailed depends on how you structure frontmatter
  export const frontmatter: Record<string, unknown>;

  export const toc: { level: 1 | 2 | 3 | 4 | 5 | 6, id: string, content: string }[];

  const toHTML: () => Promise<string>
  export default toHTML
}
