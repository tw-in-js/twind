export const builtinVersions = Object.fromEntries(
  Object.entries(
    import.meta.glob(
      [
        '../../../../packages/*/package.json',
        '!../../../../packages/cdn/package.json',
        '!../../../../packages/gatsby-plugin/package.json',
        '!../../../../packages/with-*/package.json',
      ],
      { import: 'version', eager: true },
    ),
  ).map(([key, version]) => [
    ('@twind/' + key.replace(/^.+\packages\/([^\/]+)\/.+$/, '$1')).replace(
      /^@twind\/twind$/,
      'twind',
    ),
    version as string,
  ]),
)

export function createResolutions(versions: Record<string, string> = {}): Record<string, string> {
  let resolutions: Record<string, string> = Object.fromEntries(
    Object.entries(versions).filter(([id]) => !id.includes('*')),
  )

  if (!resolutions['@twind/*']) {
    resolutions = { ...builtinVersions, ...resolutions }
  } else if (!resolutions.twind) {
    resolutions.twind = builtinVersions.twind
  }

  return resolutions
}

export function withVersion(moduleName: string, versions: Record<string, string> = {}): string {
  return moduleName.replace(/^((?:@[^\s/]+\/)?[^\s/@]+)(\/[^\s/@]+)?$/, (_, id, path = '') => {
    // check for exact match and fallback to scope wildcard like `@twind/*`
    const version =
      createResolutions(versions)[id] || versions[id.replace(/^(@[^\s/]+\/).+$/, '$1*')]

    return version ? `${id}@${version}${path}` : id + path
  })
}
