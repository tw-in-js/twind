<script>
  import { dev } from '$app/environment'

  import { page } from '$app/stores'

  $: status = $page.status
  $: error = $page.error

  // we don't want to use <svelte:window bind:online> here, because we only care about the online
  // state when the page first loads
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
  <div class="mx-auto max-w-max">
    <div class="sm:flex">
      <p class="text-4xl font-bold tracking-tight text-accent-11 sm:text-5xl">{status}</p>
      <div class="sm:ml-6">
        <div class="sm:border-l sm:border-brand-6 sm:pl-6">
          <h1 class="text-4xl font-bold tracking-tight text-brand-12 sm:text-5xl">
            {#if error?.message}
              {error.message}
            {:else}
              Encountered a {status} error
            {/if}
          </h1>
          <p class="mt-1 text-base text-brand-11">
            {#if !online}
              It looks like you're offline. Reload the page once you've found the internet.
            {:else if status >= 500}
              Please try reloading the page.
            {:else}
              Please check the URL in the address bar and try again.
            {/if}
          </p>
        </div>
        <p class="mt-10 max-w-md sm:border-l sm:border-transparent sm:pl-6 prose">
          If the error persists, please drop by <a href="https://chat.twind.style"
            >Discord chatroom</a
          >
          and let us know, or raise an issue on
          <a href="https://github.com/tw-in-js/twind">GitHub</a>. Thanks!
        </p>
      </div>
    </div>
  </div>

  {#if dev && error?.stack}
    <pre class="mt-10 font-mono">{error.stack}</pre>
  {/if}
</div>
