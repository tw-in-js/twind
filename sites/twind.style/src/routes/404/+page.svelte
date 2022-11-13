<script>
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import { shortcut } from '$lib/actions'
  import { MOD_KEY } from '$lib/constants'

  import Icon, {
    AcademicCapSolid,
    BookHalf,
    BoxSeamFill,
    ChevronRightMini,
    MagnifyingGlassSolid,
    RocketLaunchSolid,
    X,
  } from '$lib/icons'
  import { searchOpen } from '$lib/stores'

  // we don't want to use <svelte:window bind:online> here, because we only care about the online
  // state when the page first loads
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true
</script>

<svelte:head>
  <title>Not Found</title>
  <base href="/" />
</svelte:head>

<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-xl py-8 sm:py-12">
    <div class="text-center">
      <p class="text-base font-semibold text-accent-11">404</p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-brand-12 sm:text-5xl">
        This page does not exist.
      </h1>
      <p class="mt-2 text-lg">The page you are looking for could not be found.</p>
      <button
        type="button"
        class="
          mx-auto mt-14
          bg-brand-4 text-brand-11
          hover:(bg-brand-5 text-brand-12)
          focus:(bg-brand-6 text-brand-12 outline-none ring-(2 brand-7 offset-(2 brand-1)))
          shadow-sm rounded-lg
          flex items-center justify-start w-72 text-left space-x-3 px-4 h-12
        "
        on:click={() => ($searchOpen = true)}
        use:shortcut={{ control: true, code: 'KeyK' }}
      >
        <Icon src={MagnifyingGlassSolid} class="mr-3 w-4 h-4 flex-none" />
        <span class="flex-auto">Start a search ...</span>
        <span class="ml-auto font-sans font-semibold text-base" class:hidden={!browser}>
          <kbd title="Command">{MOD_KEY}</kbd>
          <kbd>K</kbd>
        </span>
      </button>
    </div>

    <div class="mt-12">
      <h2 class="text-base font-semibold">Popular pages</h2>
      <ul class="mt-4 divide-y divide-brand-6 border-t border-b border-brand-6">
        <li class="relative flex items-start space-x-4 py-6 group">
          <div class="flex-shrink-0">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-4 text-brand-11 group-hover:(bg-brand-5 text-brand-12 ring-1 ring-brand-7)"
            >
              <Icon src={BookHalf} class="h-6 w-6" />
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-medium text-accent-11">
              <span
                class="rounded-sm focus-within:ring-2 focus-within:ring-accent-7 focus-within:ring-offset-2 focus-within:ring-offset-brand-1"
              >
                <a href={$page.data.docStartHref} class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true" />
                  Documentation
                </a>
              </span>
            </h3>
            <p class="text-base text-brand-11">Learn how to start using Twind with your app</p>
          </div>
          <div class="flex-shrink-0 self-center">
            <Icon src={ChevronRightMini} class="h-5 w-5" />
          </div>
        </li>

        <li class="relative flex items-start space-x-4 py-6 group">
          <div class="flex-shrink-0">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-4 text-brand-11 group-hover:(bg-brand-5 text-brand-12 ring-1 ring-brand-7)"
            >
              <Icon src={RocketLaunchSolid} class="h-6 w-6" />
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-medium text-accent-11">
              <span
                class="rounded-sm focus-within:ring-2 focus-within:ring-accent-7 focus-within:ring-offset-2 focus-within:ring-offset-brand-1"
              >
                <a href="/integrations" class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true" />
                  Integrations
                </a>
              </span>
            </h3>
            <p class="text-base text-brand-11">
              How to use Twind in different frameworks and environments
            </p>
          </div>
          <div class="flex-shrink-0 self-center">
            <Icon src={ChevronRightMini} class="h-5 w-5" />
          </div>
        </li>

        <li class="relative flex items-start space-x-4 py-6 group">
          <div class="flex-shrink-0">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-4 text-brand-11 group-hover:(bg-brand-5 text-brand-12 ring-1 ring-brand-7)"
            >
              <Icon src={AcademicCapSolid} class="h-6 w-6" />
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-medium text-accent-11">
              <span
                class="rounded-sm focus-within:ring-2 focus-within:ring-accent-7 focus-within:ring-offset-2 focus-within:ring-offset-brand-1"
              >
                <a href="/examples" class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true" />
                  Examples
                </a>
              </span>
            </h3>
            <p class="text-base text-brand-11">Inspect the examples that cover popular setups</p>
          </div>
          <div class="flex-shrink-0 self-center">
            <Icon src={ChevronRightMini} class="h-5 w-5" />
          </div>
        </li>

        <li class="relative flex items-start space-x-4 py-6 group">
          <div class="flex-shrink-0">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-4 text-brand-11 group-hover:(bg-brand-5 text-brand-12 ring-1 ring-brand-7)"
            >
              <Icon src={BoxSeamFill} class="h-6 w-6" />
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-medium text-accent-11">
              <span
                class="rounded-sm focus-within:ring-2 focus-within:ring-accent-7 focus-within:ring-offset-2 focus-within:ring-offset-brand-1"
              >
                <a href="/packages" class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true" />
                  API Reference
                </a>
              </span>
            </h3>
            <p class="text-base text-brand-11">A complete API reference for our packages</p>
          </div>
          <div class="flex-shrink-0 self-center">
            <Icon src={ChevronRightMini} class="h-5 w-5" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
