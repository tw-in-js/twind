import handleTwind from '@twind/with-sveltekit/hooks'

export const handle = handleTwind()

/* If you have other handles use the `sequence` helper */
// import { sequence } from '@sveltejs/kit/hooks';
// export const handle = sequence(handleTwind(tw), ...otherHandles)

/* Using a custom Twind instance */
// import { tw } from './custom/twind/instance'
// export const handle = handleTwind({ tw })
