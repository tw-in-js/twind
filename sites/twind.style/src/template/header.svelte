<script>
  import Icon, { TwindLogo, Github, Discord, Search } from '$/icons'

  import { page } from '$app/stores'
  import ThemeSwitcher from './theme-switcher.svelte'
</script>

<header class="w-full sticky top-0 z-30 border-b border-brand-7 backdrop-blur bg-brand-1/95">
  <div class="max-w-8xl mx-auto p-4 flex flex-row items-center">
    <a
      sveltekit:prefetch
      href="/"
      class="flex title-font font-medium items-center hover:text-brand-12"
    >
      <Icon src={TwindLogo} class="w-8 h-8" />
      <span class="sr-only md:(not-sr-only ml-3 text-xl)">Twind</span>
    </a>
    <nav
      class="ml-auto flex flex-wrap items-center text-base justify-center"
      aria-label="Site Navigation"
    >
      <a sveltekit:prefetch href={$page.stuff.docStartHref} class="ml-5 hover:text-brand-12">
        <span class="lg:hidden" aria-hidden="true">Docs</span>
        <span class="sr-only lg:not-sr-only">Documentation</span>
      </a>
      <hr class="ml-5 w-0 h-5 border-l border-brand-6" aria-orientation="vertical" />

      <button type="button" role="search" class="ml-5 block w-5 hover:text-brand-12 lg:hidden">
        <Icon src={Search} class="w-4 h-4" label="Quick search..." />
      </button>

      <ThemeSwitcher class="ml-5 block w-5 hover:text-brand-12" />

      <a
        class="ml-5 flex items-center hover:text-brand-12"
        href="https://github.com/tw-in-js/twind/tree/next"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <Icon src={Github} class="h-4 w-4" label="Twind on GitHub" />
      </a>
      <a
        class="ml-5 flex items-center hover:text-brand-12"
        href="https://chat.twind.style"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <Icon src={Discord} class="h-4 w-4" label="Twind on Discord" />
      </a>
    </nav>
  </div>
</header>
