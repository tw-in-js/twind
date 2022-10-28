<script>
  import { cx } from 'twind'

  import { page } from '$app/stores'
  import { browser } from '$app/environment'

  import Icon, {
    Bars3Outline,
    BookHalf,
    BoxSeamFill,
    ChatBubbleLeftRightSolid,
    CodeBracketSquareSolid,
    Search,
    X,
  } from '$lib/icons'
  import { MOD_KEY } from '$lib/constants'
  import { shortcut } from '$lib/actions'

  /** @type {Exclude<App.PageData['nav'], undefined>}*/
  export let nav

  let navVisible = false
  $: active = nav.pages[$page.url.pathname]
</script>

{#if active}
  <div
    class="lg:hidden flex items-center p-2 -mx-4 sticky top-16 -mt-px z-30 border-y border-brand-7 backdrop-blur bg-brand-1/95"
  >
    <button type="button" class="hover:text-brand-12" on:click={() => (navVisible = true)}>
      <Icon src={Bars3Outline} class="w-5 h-5" label="Navigation" />
    </button>
    <ol class="flex text-sm leading-6 whitespace-no-wrap min-w-0 ml-4">
      {#if active.section}
        <li>{active.section}</li>
      {/if}
      <li class={cx(active.section && `ml-4 pl-2 list-['›']`)}>
        <span class="text-brand-12 font-semibold">{active.label}</span>
      </li>
    </ol>
  </div>
{/if}

<nav
  class="hidden w-full pr-8 fixed -ml-4 top-0 bottom-0 z-40 overflow-y-auto backdrop-blur bg-brand-1/75 overscroll-contain lg:(w-64 pb-10 block ml-0 top-16 z-auto backdrop-blur-none bg-brand-1) lg:(text-sm leading-6)"
  class:!block={navVisible}
  aria-label="Site navigation"
  role={navVisible ? 'dialog' : 'navigation'}
  aria-modal={navVisible}
  on:click={() => {
    if (navVisible) {
      navVisible = false
    }
  }}
>
  <button
    type="button"
    class="hidden absolute z-10 top-5 left-52 w-8 h-8 flex items-center justify-center hover:text-brand-12 focus:outline"
    class:!block={navVisible}
    tabindex="0"
    on:click={() => (navVisible = false)}
    use:shortcut={{ code: 'Escape' }}
  >
    <Icon src={X} class="block ml-1 w-6 h-6" label="Close navigation" />
  </button>

  <div class="hidden lg:block sticky top-0 pointer-events-none">
    <div class="pt-10 bg-brand-1 relative pointer-events-auto">
      <button
        type="button"
        role="search"
        class={cx`
          bg-neutral-3 text-neutral-11
          hover:(bg-neutral-4 text-neutral-12)
          ring-(1 neutral-7 hover:neutral-8)
          focus:(outline-none ring-(2 brand-8))
          shadow-sm rounded-md
          hidden w-full lg:flex items-center text-sm leading-6 py-1.5 pl-2 pr-3
        `}
      >
        <Icon src={Search} class="mr-3 w-4 h-4 flex-none" />
        Quick search...
        <kbd class="ml-auto text-xs font-sans font-semibold" class:hidden={!browser}>
          <abbr title="Command" class="no-underline">{MOD_KEY}</abbr>
          K
        </kbd>
      </button>
    </div>
    <div class="h-8 bg-gradient-to-b from-brand-1" />
  </div>

  <ul class={cx(navVisible && 'bg-brand-2 w-64 min-h-screen p-6 lg:(bg-transparent w-auto p-0)')}>
    <li class="mb-6 lg:mb-4">
      <a
        data-sveltekit-prefetch
        class="flex items-center group hover:text-brand-12 font-medium leading-6"
        href={$page.data.docStartHref}
        title="Go to Twind documentation"
      >
        <div class="mr-4 rounded-md p-1.5 bg-brand-4 group-hover:(bg-brand-5 ring-1 ring-brand-7)">
          <Icon src={BookHalf} class="h-4 w-4" label="Twind Documentation" />
        </div>
        <span>Documentation</span>
      </a>
    </li>

    <li class="mb-6 lg:mb-4">
      <a
        class="flex items-center group hover:text-brand-12 font-medium leading-6"
        href="/packages"
        title="Go to Twind packages"
      >
        <div class="mr-4 rounded-md p-1.5 bg-brand-4 group-hover:(bg-brand-5 ring-1 ring-brand-7)">
          <Icon src={BoxSeamFill} class="h-4 w-4" label="Twind Packages" />
        </div>
        <span>Packages</span>
      </a>
    </li>

    <li class="mb-6 lg:mb-4">
      <a
        class="flex items-center group hover:text-brand-12 font-medium leading-6"
        href="https://twind.run"
        title="Go to Twind Playground"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <div class="mr-4 rounded-md p-1.5 bg-brand-4 group-hover:(bg-brand-5 ring-1 ring-brand-7)">
          <Icon src={CodeBracketSquareSolid} class="h-4 w-4" label="Twind Playground" />
        </div>
        <span>Playground</span>
      </a>
    </li>

    <li class="mb-6 lg:mb-4">
      <a
        class="flex items-center group hover:text-brand-12 font-medium leading-6"
        href="https://github.com/tw-in-js/twind/discussions"
        title="Go to Twind discussions on GitHub"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <div class="mr-4 rounded-md p-1.5 bg-brand-4 group-hover:(bg-brand-5 ring-1 ring-brand-7)">
          <Icon src={ChatBubbleLeftRightSolid} class="h-4 w-4" label="Discussions on GitHub" />
        </div>
        <span>Discussions</span>
      </a>
    </li>

    {#each nav.sections as [section, entries] (section)}
      {#if section}
        <li class="mt-10 lg:mt-6">
          <h5 class="mb-6 lg:mb-2 font-semibold text-brand-12">{section}</h5>
          <ol class="space-y-6 lg:space-y-2 border-l border-brand-7">
            {#each entries as href (href)}
              <li>
                <a
                  data-sveltekit-prefetch
                  {href}
                  class={cx(
                    'block pl-4 border-l -ml-px transition-colors duration-300 ease-in-out',
                    $page.url.pathname == href
                      ? 'font-semibold text-accent-11 border-current'
                      : 'text-brand-11 hover:text-brand-12 border-transparent hover:border-brand-8',
                  )}
                >
                  {nav.pages[href].label}
                </a>
              </li>
            {/each}
          </ol>
        </li>
      {:else}
        {#each entries as href (href)}
          <li>
            <a
              data-sveltekit-prefetch
              {href}
              class={cx(
                'block font-medium mb-6 lg:mb-2 transition-colors duration-300 ease-in-out',
                $page.url.pathname == href
                  ? 'font-semibold text-accent-11'
                  : 'text-brand-11 hover:text-brand-12',
              )}
            >
              {nav.pages[href].label}
            </a>
          </li>
        {/each}
      {/if}
    {/each}
  </ul>
</nav>
