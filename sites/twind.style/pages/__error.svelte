<script context="module">
  import { browser, dev } from '$app/env'

  /**
   * @type {import('@sveltejs/kit').ErrorLoad}
   */
  export function load({ error, status }) {
    return {
      props: { error, status },
    }
  }
</script>

<script>
  // TODO: https://github.com/sw-yx/swyxkit/blob/main/src/routes/__error.svelte
  import Icon, { ExclamationOutline } from '$/icons'

  /** @type {number} */
  export let status

  /** @type {Error | undefined} */
  export let error

  // we don't want to use <svelte:window bind:online> here, because we only care about the online
  // state when the page first loads
  let online = typeof navigator !== 'undefined' ? navigator.onLine : true
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div
  class="fixed z-10 inset-0 overflow-y-auto"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  <div
    class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
  >
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

    {#if online}
      <h1>Yikes!</h1>

      {#if error?.message}
        <p class="error">{status}: {error.message}</p>
      {:else}
        <p class="error">Encountered a {status} error</p>
      {/if}

      {#if dev && error?.stack}
        <pre>{error.stack}</pre>
      {:else}
        {#if status >= 500}
          <p>Please try reloading the page.</p>
        {/if}

        <p>
          If the error persists, please drop by <a href="https://chat.twind.style"
            >Discord chatroom</a
          >
          and let us know, or raise an issue on
          <a href="https://github.com/tw-in-js/twind">GitHub</a>. Thanks!
        </p>
      {/if}
    {:else}
      <h1>It looks like you're offline</h1>

      <p>Reload the page once you've found the internet.</p>
    {/if}
    <div
      class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full sm:p-6"
    >
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
        >
          <Icon src={ExclamationOutline} class="h-6 w-6 text-red-600" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            {status}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              {error?.message}
            </p>
          </div>
          {#if dev && error?.stack}
            <pre class="mt-2">{error.stack}</pre>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
