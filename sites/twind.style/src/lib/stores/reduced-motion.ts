import { matchesMediaQuery } from './matches-media-query'

/**
 * A store to detect if the user has requested the system minimize the amount of animation or motion it uses.
 */
export const reducedMotion = /*#__PURE__*/ matchesMediaQuery('(prefers-reduced-motion: reduce)')
