// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/adapter-cloudflare" />

declare namespace App {
  interface Platform {
    caches: CacheStorage & { default: Cache }
    env: {
      // WORKSPACES: KVNamespace
      WORKSPACES: R2Bucket
      // YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace
    }
  }

  interface Error {
    frame?: unknown
    stack?: string
  }
}

declare module 'es-module-lexer/js' {
  export const parse: typeof import('es-module-lexer')['parse']
  export const init: typeof import('es-module-lexer')['init']
}

declare module '@jsenv/importmap' {
  export interface ImportMap {
    imports?: Record<string, string>
    scopes?: Record<string, Record<string, string>>
  }

  /**
   * takes two importMaps and return a single importMap being the composition of the two.
   */
  export function composeTwoImportMaps(left: ImportMap, right: ImportMap): ImportMap

  /**
   * returns an importMap resolved against an url and sorted.
   */
  export function normalizeImportMap(importMap: ImportMap, baseUrl: string | URL): ImportMap

  export interface ResolveImportOptions {
    /** `"../index.js"` */
    specifier: string
    /** `"http://domain.com/folder/file.js"` */
    importer?: string
    importMap?: ImportMap
    defaultExtension?: false | string
    // onImportMapping: ({
    //   scope,
    //   from: specifierCandidate,
    //   to: address,
    //   before: specifierNormalized,
    //   after: address,
    // }) => void,
  }

  /**
   * returns an import url applying an importMap to specifier and importer.
   *
   * The provided importMap must be resolved and sorted to work as expected. You can use normalizeImportMap to do that.
   */
  export function resolveImport(options: ResolveImportOptions): string

  export interface ApplyImportMapOptions {
    /** `"../index.js"` */
    specifier: string
    /** `"http://domain.com/folder/file.js"` */
    importer?: string
    importMap: ImportMap
    // onImportMapping: ({
    //   scope,
    //   from: specifierCandidate,
    //   to: address,
    //   before: specifierNormalized,
    //   after: address,
    // }) => void,
  }

  export function applyImportMap(options: ApplyImportMapOptions): string

  /**
   * receives importMap, fromUrl, toUrl and return an importmap where all relative urls and specifiers becomes relative to toUrl instead of fromUrl.
   *
   * This function exists in case you need to move an importmap file somewhere else in the filesystem. This is not a common use case but might happen.
   */
  export function moveImportMap(
    importMap: ImportMap,
    from: string | URL,
    to: string | URL,
  ): ImportMap

  /**
   * returns an import url applying an importMap to specifier and importer.
   *
   * The provided importMap must be resolved and sorted to work as expected. You can use normalizeImportMap to do that.
   */
  export function resolveImport(options: ResolveImportOptions): string

  export function resolveSpecifier(specifier: string, importer: string): string | null
  export function resolveUrl(specifier: string, baseUrl?: string): string
}

declare module 'sver' {
  export declare class Semver {
    static isValid(version: string): boolean
    static compare(v1: Semver | string, v2: Semver | string): number

    constructor(raw: string)

    readonly major: number
    readonly minor: number
    readonly patch: number
    readonly pre: string[] | undefined
    readonly build: string | undefined
    readonly tag: string | undefined

    gt(other: Semver | string): boolean
    lt(other: Semver | string): boolean
    eq(other: Semver | string): boolean
    /** Whether this version matches the given version range. */
    matches(range: SemverRange | string, unstable?: boolean): boolean

    toString(): string
  }

  export declare class SemverRange {
    static match(range: SemverRange | string, version: Semver | string, unstable?: boolean): boolean
    static isValid(range: string): boolean
    static compare(v1: SemverRange | string, v2: SemverRange | string): number

    constructor(raw: string)

    readonly type: 'wildcard' | 'major' | 'stable' | 'exact'
    readonly version: Semver

    readonly isExact: boolean
    readonly isStable: boolean
    readonly isMajor: boolean
    readonly isWildcard: boolean

    gt(other: SemverRange | string): boolean
    lt(other: SemverRange | string): boolean
    eq(other: SemverRange | string): boolean

    has(version: Semver | string, unstable?: boolean): boolean

    contains(range: SemverRange | string): boolean
    intersect(range: SemverRange | string): boolean

    bestMatch(versions: (Semver | string)[], unstable?: boolean): boolean

    toString(): string
  }
}

declare module 'prettier/esm/standalone.mjs'
declare module 'prettier/esm/parser-babel.mjs'
declare module 'prettier/esm/parser-html.mjs'
declare module 'prettier/esm/parser-markdown.mjs'
declare module 'prettier/esm/parser-postcss.mjs'
declare module 'prettier/esm/parser-typescript.mjs'
