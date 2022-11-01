import 'systemjs/dist/system.js'
// import 'systemjs/dist/extras/named-register.js'

export interface ImportMap {
  resolutions?: Record<string, string>
  imports?: Record<string, string>
  scopes?: {
    [scope: string]: Record<string, string>
  }
  integrity?: Record<string, string>
  preload?: string[]
  prefetch?: string[]
}

type ISystem = typeof System & {
  onload?: (
    error: Error | null | undefined,
    id: string,
    dependencies: string[],
    isErrorSource: boolean,
  ) => void

  addImportMap(map: ImportMap): void

  // from systemjs/dist/extras/named-register
  // registerRegistry: Record<string, unknown>
  // namedRegisterAliases: Record<string, unknown>
}

declare global {
  interface Window {
    System: ISystem
  }

  var importScripts: undefined | ((url: string) => Promise<unknown>)
}

if (import.meta.env.DEV && typeof importScripts === 'function') {
  System.constructor.prototype.instantiate = async function (url: string) {
    await import(/* @vite-ignore */ url)
    return this.getRegister(url)
  }
}

export default System as ISystem
