export interface Manifest {
  url: string
  version: string
  'dist-tag': 'latest' | 'next' | 'canary'
  'git-sha': string
  pr?: string
  packages: Record<string, string>
  imports?: Record<string, string>
  scopes?: Record<string, Record<string, string>>
  integrity?: Record<string, string>
}

export interface Workspace {
  /** @sites/twind.run version (v1.0.0 or v1.0.0-<dist-tag>...) - used to load to importmap */
  version: string
  html: WorkspaceFile
  script: WorkspaceFile
  config: WorkspaceFile
}

export interface WorkspaceFile {
  path: string
  value: string
  dirty?: boolean
}
