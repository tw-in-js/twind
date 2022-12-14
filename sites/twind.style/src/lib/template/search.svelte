<script>
  import {
    Transition,
    TransitionChild,
    Dialog,
    DialogOverlay,
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
  } from '@sastan/svelte-headlessui'
  import { onDestroy } from 'svelte'

  import debounce from 'just-debounce'

  import { goto, preloadData } from '$app/navigation'

  import { cx, tw } from '$lib/twind'

  import Icon, {
    ExclamationTriangleOutline,
    LifebuoyOutline,
    LoadingQuarterCircle,
    MagnifyingGlassSolid,
    WifiOff,
    X,
  } from '$lib/icons'
  import flexsearchLogo from '$lib/assets/flexsearch-logo-glass.svg'
  import { searchOpen } from '$lib/stores'
  import { browser } from '$app/environment'

  onDestroy(close)

  /** @param {string | undefined} [href] */
  function close(href) {
    if ($searchOpen || document.body.classList.contains(tw('fixed'))) {
      $searchOpen = false

      // TODO: restore focus: https://gist.github.com/samthor/babe9fad4a65625b301ba482dad284d1
      const scroll = -parseInt(document.body.style.top || '0')
      document.body.classList.remove(tw('fixed'), tw('w-screen'))
      document.body.style.top = ''
      window.scrollTo(0, scroll)

      if (href) {
        preloadData(href)
        requestAnimationFrame(() => goto(href))
      }
    }
  }

  let requestId = 0
  let loading = false
  let query = ''

  /** @type {{needsUpdate?: boolean, term: string, results: {id: number, href: string, section: string, label?: string | undefined, category: string, title: string, excerpt: string}[], error?: Error | undefined}}*/
  let search = { term: query, results: [] }

  $: if (browser && $searchOpen) {
    document.body.style.top = `-${window.scrollY}px`
    document.body.classList.add(tw('fixed'), tw('w-screen'))
    query = ''
  }

  /** @type {(term: string) => void} */
  const debouncedSearch = debounce(async (term) => {
    if (query === term) {
      const id = ++requestId

      if (!term) {
        search = { term, results: [] }
        loading = false
        return
      }

      loading = true

      try {
        const request = await fetch(`/-/search?q=${encodeURIComponent(term)}`)

        if (!(request.ok && request.status === 200)) {
          throw new Error(`Loading search results failed: ${request.status}`)
        }

        const result = await request.json()
        if (id === requestId) {
          search = result
          if (browser && result.needsUpdate && 'serviceWorker' in navigator) {
            // new app version is available
            navigator.serviceWorker
              .getRegistration()
              .then((registration) => registration?.update())
              .catch((error) => {
                console.warn('Service worker update failed:', error)
              })
          }
        }
      } catch (error) {
        if (id === requestId) {
          search = { term, results: [], error }
        }
      } finally {
        if (id === requestId) {
          loading = false
        }
      }
    }
  }, 300)

  $: debouncedSearch(query)
</script>

<Transition show={$searchOpen} on:afterLeave={() => close()} appear>
  <Dialog class="relative z-30" on:close={() => close()}>
    <TransitionChild
      enter="ease-out motion-safe:duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in motion-safe:duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <DialogOverlay class="fixed inset-0 bg-brand-2/50 backdrop-blur-sm motion-safe:transition" />
    </TransitionChild>

    <TransitionChild
      enter="ease-out motion-safe:duration-75"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in motion-safe:duration-75"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
      class="fixed w-[36rem] xl:w-[42rem] 2xl:w-[48rem] max-w-full overflow-y-auto top-4 sm:top-6 md:top-20 left-1/2 -translate-x-1/2 overflow-hidden rounded-xl bg-brand-1 dark:bg-brandDark-3 shadow-2xl ring-1 ring-brand-7/25"
    >
      <Combobox class="divide-y divide-brand-6" on:change={(event) => close(event.detail.href)}>
        <div class="relative flex items-center justify-between gap-4 px-4">
          <Icon src={MagnifyingGlassSolid} class="pointer-events-none h-5 w-5 text-brand-11" />
          <ComboboxInput
            class="h-12 w-full border-0 bg-transparent text-brand-12 placeholder-brand-11 focus:(outline-none ring-0) text-base"
            placeholder="Search..."
            on:change={(event) => (query = event.detail)}
          />
          <button
            type="button"
            class="hover:text-brand-12 focus:text-brand-12 p-2"
            title="Close search"
            on:click={() => ($searchOpen = false)}
          >
            <Icon src={X} class="h-5 w-5" />
          </button>
        </div>

        {#if loading}
          <div class="py-14 px-6 flex flex-col place-items-center gap-2 md:gap-4 sm:px-14">
            <Icon src={LoadingQuarterCircle} class="mx-auto animate-spin h-6 w-6 text-info-11" />
            <p class="font-semibold text-info-11">Loading results</p>
            <p>Please give us a moment to collect the results ...</p>
          </div>
        {:else if search.error}
          <div class="py-14 px-6 flex flex-col place-items-center gap-4 sm:px-14">
            {#if typeof navigator !== 'undefined' && !navigator.onLine}
              <Icon src={WifiOff} class="mx-auto h-6 w-6 text-warning-11" />
              <p class="font-semibold text-warning-11">It looks like you're offline</p>
              <p>Try again once you've found the internet.</p>
            {:else}
              <Icon src={ExclamationTriangleOutline} class="mx-auto h-6 w-6 text-error-11" />
              <p class="font-semibold text-error-11">Something went wrong</p>
              <p>{search.error.message}</p>
              <p class="mt-2 max-w-md prose">
                If the error persists, please drop by <a href="https://chat.twind.style"
                  >Discord chatroom</a
                >
                and let us know, or raise an issue on
                <a href="https://github.com/tw-in-js/twind">GitHub</a>. Thanks!
              </p>
            {/if}
          </div>
        {:else if search.results.length}
          <ComboboxOptions
            as="ol"
            static
            class="max-h-96 scroll-py-3 overflow-y-auto py-3 shadow-inner"
          >
            {#each search.results as result}
              <ComboboxOption
                value={result}
                class={({ active }) => {
                  if (active) {
                    prefetch(result.href)
                  }
                  return cx(
                    'select-none p-3 hover:bg-brand-4 motion-safe:transition-colors',
                    active && 'bg-brand-5',
                  )
                }}
              >
                <a
                  href={result.href}
                  on:click={(event) => {
                    event.preventDefault()
                    close(result.href)
                  }}
                >
                  <p>
                    {#if result.section}
                      <span class="text-base leading-6 font-semibold text-accent-11">
                        {result.section}
                      </span>
                      ›
                    {/if}
                    {#if result.label}
                      <span class="text-base font-medium text-brand-12 tracking-tight">
                        {result.label}
                      </span>
                      ›
                    {/if}
                    {#if result.title}
                      <span
                        class="text-base font-medium text-brand-12 tracking-tight &_mark:(bg-transparent font-semibold text-brand-12 underline underline-offset-4 decoration-dotted decoration-accent-11)"
                        >{@html result.title}</span
                      >
                    {/if}
                  </p>
                  {#if result.excerpt}
                    <p
                      class="text-sm text-brand-11 &_mark:(bg-transparent font-semibold text-brand-12 underline underline-offset-4 decoration-dotted decoration-accent-11)"
                    >
                      {@html result.excerpt}
                    </p>
                  {/if}
                </a>
              </ComboboxOption>
            {/each}
          </ComboboxOptions>
        {:else}
          <div class="py-14 px-6 flex flex-col place-items-center gap-4 sm:px-14">
            {#if search.term && search.term === query}
              <Icon src={ExclamationTriangleOutline} class="mx-auto h-6 w-6 text-warning-11" />
              <p class="font-semibold text-warning-11">No results found</p>
              <p>We couldn’t find anything with that term. Please try again.</p>
            {:else}
              <Icon src={LifebuoyOutline} class="mx-auto h-6 w-6 text-info-12" />
              <p class="font-semibold text-info-12">Help with searching</p>
              <p>Use this tool to quickly search for pages across our entire site.</p>
            {/if}
          </div>
        {/if}

        <div class="flex items-center gap-4 bg-brand-2 text-brand-11 py-2.5 px-4 text-xs">
          <span class="flex items-center">
            <kbd
              class="flex h-5 w-5 text-lg items-center justify-center rounded border bg-brand-5 font-semibold border-brand-7 text-brand-11"
            >
              ⏎
            </kbd>
            <span class="ml-1 sm:ml-2">to select</span>
          </span>

          <span class="flex items-center">
            <kbd
              class="flex h-5 w-5 text-lg items-center justify-center rounded border bg-brand-5 font-semibold border-brand-7 text-brand-11"
            >
              ↑
            </kbd>
            <kbd
              class="ml-1 flex h-5 w-5 text-lg items-center justify-center rounded border bg-brand-5 font-semibold border-brand-7 text-brand-11"
            >
              ↓
            </kbd>
            <span class="ml-1 sm:ml-2">to navigate</span>
          </span>

          <span class="flex items-center">
            <kbd
              class="flex h-5 w-5 text-lg items-center justify-center rounded border bg-brand-5 font-semibold border-brand-7 text-brand-11"
            >
              ␛
            </kbd>
            <span class="ml-1 sm:ml-2">to close</span>
          </span>

          <span class="ml-auto flex items-center">
            Powered by <a href="https://github.com/nextapps-de/flexsearch">
              <img alt="Flexsearch" class="ml-1 sm:ml-2 h-6" src={flexsearchLogo} />
            </a>
          </span>
        </div>
      </Combobox>
    </TransitionChild>
  </Dialog>
</Transition>
