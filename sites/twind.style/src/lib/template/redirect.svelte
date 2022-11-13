<script>
  import { browser } from '$app/environment'

  // @ts-nocheck

  /** @type {string} */
  export let location

  if (browser) {
    document.body.style.visibility = 'hidden'
    window.location.href = new URL(location, window.location.href).href
  }
</script>

<svelte:head>
  <meta http-equiv="refresh" content="0; url={location}" />
  <title>Page Redirection</title>
</svelte:head>

<p class="prose text-center max-w-full">
  If you are not redirected automatically, follow this <a href={location} data-sveltekit-reload
    >link</a
  >.
</p>
