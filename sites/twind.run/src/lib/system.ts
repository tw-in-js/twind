import 'systemjs'
import 'systemjs/dist/extras/named-register'

export interface ImportMap {
  imports?: Record<string, string>
  scopes?: {
    [scope: string]: Record<string, string>
  }
  integrity?: Record<string, string>
  preload?: string[]
  prefetch?: string[]
}

type ISystem = typeof System & {
  onload?: (error: Error | null | undefined, id: string, dependencies: string[], isErrorSource: boolean) => void

  addImportMap(map: ImportMap): void
}

interface SystemConstructor {
  new (): ISystem
}

declare global {
  interface Window {
    System: ISystem
  }
}

export function createSystem(importMap: ImportMap = {}, onLoad: ISystem['onload'] = () => {}): ISystem {
  const system = new (System.constructor as SystemConstructor)()
  system.registerRegistry ??= Object.create(null);
  system.namedRegisterAliases ??= Object.create(null);

  system.onload = onLoad

  system.addImportMap(importMap)

  return system
}
