export type { Preview, Script } from './preview.api'

export default import.meta.url

if (!import.meta.env.SSR && typeof top === 'object' && top !== self) {
  import('./preview.api').catch((error) => console.error('Failed to load preview', error))
}
