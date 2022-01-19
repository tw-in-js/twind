import { withTwind } from '@twind/sveltekit'

/* import twind instance */
import { tw } from 'twind'
// import { tw } from '@twind/runtime'
// import { tw } from './your/twind'

export const handle = withTwind(tw)

/* If you have other handles use the `sequence` helper */
// import { sequence } from '@sveltejs/kit/hooks';
// export const handle = sequence(withTwind(tw), ...otherHandles)
