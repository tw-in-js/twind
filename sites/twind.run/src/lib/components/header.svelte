<script>
  import Icon, { TwindLogo, BookOpenMini, Github, Discord } from '$lib/icons'

  import ThemeSwitcher from './theme-switcher.svelte'
</script>

<header
  class="relative flex-none overflow-visible flex items-center space-x-4 py-1 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6"
>
  <div class="flex-auto flex items-center justify-between gap-4">
    <div class="flex gap-(4 lg:8 xl:12)">
      <a href="/" class="flex font-medium items-center hover:text-brand-12">
        <Icon src={TwindLogo} class="w-6 h-6" />
        <span class="sr-only md:(not-sr-only ml-3 text-xl)">
          <span class="text-brand-12">Twind</span><span
            class="bg-clip-text text-transparent bg-gradient-to-r from-info-11 via-accent-11 to-brand-11"
            >.run</span
          >
        </span></a
      >
      {#if $$slots.default}
        <div class="flex items-center gap-4">
          <slot />
        </div>
      {/if}
    </div>

    <div class="flex items-center">
      <a
        class="hidden lg:flex text-xs hover:text-brand-12"
        href="https://github.com/tw-in-js/twind/issues/new"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        Something broken? File a bug!
      </a>

      <hr class="hidden lg:flex ml-3 w-0 h-5 border-l border-brand-6" aria-orientation="vertical" />

      <!-- <button type="button" class="ml-2 flex items-center text-accent-11">
        <Icon src={PanelLeftFilled} class="h-5 w-5" label="Switch to vertical split layout" />
      </button>

      <button type="button" class="ml-2 flex items-center hover:text-brand-12">
        <Icon src={PanelBottomFilled} class="h-5 w-5" label="Switch to horizontal split layout" />
      </button>

      <hr class="ml-3 w-0 h-5 border-l border-brand-6" aria-orientation="vertical" /> -->

      <nav
        class="flex flex-wrap items-center text-base justify-center"
        aria-label="Site Navigation"
      >
        <a
          data-sveltekit-prefetch
          class="ml-3 flex items-center hover:text-brand-12"
          href="https://twind.style"
          title="Go to Twind documentation"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <Icon src={BookOpenMini} class="h-4 w-4" label="Twind Documentation" />
        </a>

        <a
          class="ml-3 flex items-center hover:text-brand-12"
          href="https://github.com/tw-in-js/twind/tree/next"
          title="Go to Twind on GitHub"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <Icon src={Github} class="h-4 w-4" label="Twind on GitHub" />
        </a>
        <a
          class="ml-3 flex items-center hover:text-brand-12"
          href="https://chat.twind.style"
          title="Go to Twind on Discord"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <Icon src={Discord} class="h-4 w-4" label="Twind on Discord" />
        </a>

        <hr class="ml-3 w-0 h-5 border-l border-brand-6" aria-orientation="vertical" />

        <ThemeSwitcher class="ml-3 block w-5 hover:text-brand-12" />
      </nav>
    </div>
  </div>
</header>
