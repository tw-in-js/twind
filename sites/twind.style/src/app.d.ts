// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Error {
    stack?: string
  }

  interface PageData {
    docStartHref: string
    file?: string
    nav?: import('./routes/docs/$types').LayoutServerData['nav']
  }
}

declare module '*.md' {
  // "unknown" would be more detailed depends on how you structure frontmatter
  export const frontmatter: Record<string, unknown>

  export const toc: { level: 1 | 2 | 3 | 4 | 5 | 6; id: string; content: string }[]

  const toHTML: () => Promise<string>
  export default toHTML
}
