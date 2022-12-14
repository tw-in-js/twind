<script>
  import { writable, get } from 'svelte/store'

  import {
    Combobox,
    ComboboxLabel,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
  } from '@sastan/svelte-headlessui'

  import intellisense from '$lib/intellisense'
  import { cx } from '$lib/twind'
  import Icon, {
    Braces,
    CardText,
    ExclamationTriangleOutline,
    LoadingQuarterCircle,
  } from '$lib/icons'

  import Loader from './loader.svelte'

  /** @type {import('$lib/system').ImportMap | null} */
  export let importMap

  /** Class name for the editor container */
  let className = ''
  export { className as class }

  let query = ''

  /** @type {import('@twind/intellisense').Suggestion[]} */
  let suggestions = []

  let loading = false

  /** @type {import('@twind/intellisense').Suggestion | null | undefined} */
  let selectedSuggestion = null

  /** @type {import('svelte/store').Writable<string | null>} */
  const lastQuery = writable(null)

  $: if (get(lastQuery) !== query) {
    lastQuery.set(query)

    // TODO: debounce
    if (query) {
      loading = true
      intellisense
        .suggest(query)
        .then((_) => {
          if (get(lastQuery) === query) {
            suggestions = _.slice(0, 150)
          }
        })
        .catch((error) => {
          if (get(lastQuery) === query) {
            console.warn(error)
            suggestions = []
          }
        })
        .finally(() => {
          if (get(lastQuery) === query) {
            loading = false
          }
        })
    } else {
      loading = false
      suggestions = []
    }
  }
</script>

<Loader isReady={importMap} class={className}>
  <div class="absolute inset-0 w-full h-full overflow-auto">
    <section class="px-4 py-5 sm:px-6 max-w-3xl mx-auto space-y-5">
      <header>
        <p class="mt-3 text-sm">Type anything to search for utilities or variants!</p>
      </header>

      <Combobox
        class="relative w-full"
        defaultValue={selectedSuggestion}
        on:change={(event) => {
          selectedSuggestion = event.detail
          if (selectedSuggestion?.name.endsWith('/')) {
            query = selectedSuggestion.name
          }
        }}
      >
        <ComboboxInput
          class="w-full py-2 px-3 rounded-md border-6 bg-brand-5 text-brand-12 placeholder-brand-11 hover:(outline-none border-brand-8) focus:(outline-none border-7)"
          placeholder="Type anything to search ..."
          displayValue={(suggestion) => suggestion?.name}
          autofocus
          autocomplete="off"
          on:change={(event) => (query = event.detail)}
        />
        {#if suggestions.length}
          <ComboboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-brand-5 py-1 shadow-lg ring-1 ring-brand-7 ring-opacity-5 focus:outline-none text-sm"
            static={!!selectedSuggestion?.name.endsWith('/')}
          >
            {#each suggestions as suggestion}
              <ComboboxOption
                class={({ active }) => {
                  return cx(
                    'flex flex-nowrap items-center gap-x-2 whitespace-nowrap cursor-default select-none py-2 pl-3 pr-9 text-brand-11 hover:bg-brand-4',
                    active && 'text-brand-12 bg-brand-4',
                  )
                }}
                value={suggestion}
              >
                {#if suggestion.color}
                  <span
                    class="h-4 w-4 shrink-0 rounded-sm ring-1 ring-inset ring-brand-7"
                    style={`background-color: ${suggestion.color};`}
                    aria-label="Color: {suggestion.color}"
                  />
                {:else if suggestion.type === 'variant'}
                  <Icon src={Braces} class="h-4 w-4 shrink-0" label="Variant" />
                {:else}
                  <Icon src={CardText} class="h-4 w-4 shrink-0" label="Utility" />
                {/if}
                <span class="mr-8">
                  {suggestion.name}{#if suggestion.name.endsWith('/')}…{/if}
                </span>
                <span class="text-ellipsis overflow-hidden ml-auto font-mono">
                  {suggestion.description}
                </span>
              </ComboboxOption>
            {/each}
          </ComboboxOptions>
        {:else if !loading && query}
          <div class="py-14 px-6 flex flex-col place-items-center gap-4 sm:px-14">
            <Icon src={ExclamationTriangleOutline} class="mx-auto h-6 w-6 text-warning-11" />
            <p class="font-semibold text-warning-11">No results found</p>
            <p>We couldn’t find anything with that term. Please try again.</p>
          </div>
        {/if}
      </Combobox>

      {#if selectedSuggestion}
        {#key selectedSuggestion.name}
          {#await intellisense.documentationFor(selectedSuggestion.name, { format: 'html' })}
            <div class="py-14 px-6 flex flex-col place-items-center gap-2 md:gap-4 sm:px-14">
              <Icon src={LoadingQuarterCircle} class="mx-auto animate-spin h-6 w-6 text-info-11" />
              <p class="font-semibold text-info-11">Loading documentation</p>
              <p>Please give us a moment to load the documentation ...</p>
            </div>
          {:then doc}
            {#if doc}
              <div class="prose max-w-full">
                <h2>{selectedSuggestion.name}</h2>
                {#if selectedSuggestion.color}
                  <h3>Color</h3>
                  <div
                    class="h-10 w-20 rounded ring-1 ring-inset ring-brand-7 flex items-center justify-center gap-2"
                    style="background-color: {selectedSuggestion.color};"
                  >
                    <span class="text-white">A</span>
                    <span class="text-black">A</span>
                  </div>
                {/if}
                <h3>CSS</h3>
                {@html doc}
              </div>
            {:else}
              <div class="py-14 px-6 flex flex-col place-items-center gap-4 sm:px-14">
                <Icon src={ExclamationTriangleOutline} class="mx-auto h-6 w-6 text-warning-11" />
                <p class="font-semibold text-warning-11">No documentation found</p>
                <p class="prose">We couldn’t find the documentation for <code>{query}</code>.</p>
              </div>
            {/if}
          {:catch error}
            <div class="py-14 px-6 flex flex-col place-items-center gap-4 sm:px-14">
              <Icon src={ExclamationTriangleOutline} class="mx-auto h-6 w-6 text-error-11" />
              <p class="font-semibold text-error-11">Something went wrong</p>
              <p>{error.message}</p>
              <p class="mt-2 max-w-md prose">
                If the error persists, please drop by <a href="https://chat.twind.style"
                  >Discord chatroom</a
                >
                and let us know, or raise an issue on
                <a href="https://github.com/tw-in-js/twind">GitHub</a>. Thanks!
              </p>
            </div>
          {/await}
        {/key}
      {/if}
    </section>
  </div>
</Loader>
