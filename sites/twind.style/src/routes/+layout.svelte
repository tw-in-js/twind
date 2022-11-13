<script>
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Icon, { RocketLaunchOutline, X } from '$lib/icons'

  import Layout from '$lib/template/layout.svelte'
  import { Transition } from '@sastan/svelte-headlessui'

  import { registerServiceWorker } from '../service-worker/register'

  const registration = registerServiceWorker('/service-worker.js')

  $: if (browser) {
    console.debug('service worker', $registration)
  }

  // unavailable vs activated
  const firstInstall = $registration === 'unavailable'

  $: needsRefresh = !firstInstall && $registration === 'installed'
</script>

<div
  aria-live="assertive"
  class="z-50 pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
>
  <div class="flex w-full flex-col items-center space-y-4">
    <Transition
      show={needsRefresh}
      enter="transform ease-out motion-safe:duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in motion-safe:duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-info-4 shadow-lg ring-1 ring-info-7 ring-opacity-5"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <Icon src={RocketLaunchOutline} class="h-6 w-6 text-info-11" />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-info-12">New content available!</p>
            <p class="mt-1 text-sm text-info-11">
              Click on
              <a
                data-sveltekit-reload
                href={$page.url.href}
                class="font-medium text-accent-11 hover:text-accent-12 focus:outline-none focus:ring-2 focus:ring-accent-7 focus:ring-offset-2 focus:ring-offset-info-4"
              >
                reload
              </a> to view the latest updates.
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md hover:text-info-12 focus:outline-none focus:ring-2 focus:ring-info-7 focus:ring-offset-2 focus:ring-offset-info-4"
              on:click={() => (needsRefresh = false)}
            >
              <span class="sr-only">Close</span>
              <Icon src={X} class="h-5 w-5" label="Close" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</div>

<Layout><slot /></Layout>
