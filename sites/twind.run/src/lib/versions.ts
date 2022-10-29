import { SemverRange } from 'sver'
import type { Manifest } from './types'

export function withVersion(specifier: string, manifest: Manifest) {
  const match = specifier.match(/^((?:@[^/]+\/)?[^/@]+)(?:@([^/]+))?(\/.+)?$/)

  if (match) {
    const { 1: id, 2: version, 3: path = '' } = match

    // check if versions satifies importMap version and use importMap resolution
    const manifestVersion = manifest.packages[id]

    if (!version || (manifestVersion && SemverRange.match(version, manifestVersion))) {
      return {
        found: true,
        input: { id, version, path },
        output: { id, version: manifestVersion, path },
        specifier: `${id}@${manifestVersion}${path}`,
      } as const
    }

    if (version) {
      return {
        found: false,
        input: { id, version, path },
        output: { id, version, path },
        specifier,
      } as const
    }
  }

  return {
    found: false,
    input: { id: specifier, version: undefined, path: '' },
    output: { id: specifier, version: undefined, path: '' },
    specifier,
  } as const
}
