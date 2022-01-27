import { withTwind } from '@twind/sveltekit/hooks'

export const handle = withTwind()

/* If you have other handles use the `sequence` helper */
// import { sequence } from '@sveltejs/kit/hooks';
// export const handle = sequence(withTwind(tw), ...otherHandles)

/* Using a custom Twind instance */
// import { tw } from './custom/twind/instance'
// export const handle = withTwind({ tw })
