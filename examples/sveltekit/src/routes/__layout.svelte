<script type="module">
  import { browser } from '$app/env';

  import { setup } from 'twind'
  import twindConfig from '../twind.config'

  setup(twindConfig)

  // optional — remove server-side generated style element
  // after `setup` twind has taken over and the SSR styles are no longer used
  if (browser) {
    document.querySelector('style[data-twind]')?.remove()
  }
</script>

<slot />
