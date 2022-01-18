// Fix exported global variable from `twindCdn` to `twind`
/* @distilt-global-name twind */

export * from './core'

// Create twind_core global variable which allows scripts to resolve @twind/core from this bundle
import * as core from '@twind/core'

// If we run in the browser as `<script src="..."></script>` we create `twind_core` global variable
if (typeof document != 'undefined' && document.currentScript) {
  self.twind_core = core
}
