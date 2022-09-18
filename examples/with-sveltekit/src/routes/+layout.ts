import install from '@twind/with-sveltekit'
import config from '../twind.config'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = () => {
  install(config)
}
