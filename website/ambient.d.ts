// glob import in src/sitemap.ts
declare module '*.md?(x)' {
  export const _filename: string[]
  export const section: (string | undefined)[]
  export const next: (string | undefined)[]
  export const label: (string | undefined)[]
  export const title: (string | undefined)[]
}

declare module '$sitemap/docs' {
  export const start: string
  export const sections: [section: string | null, entries: string[]][]
  export const entries: {
    [href: string]: { section: string | null; label: string; prev?: string; next?: string }
  }
}
