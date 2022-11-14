<script>
  import { page } from '$app/stores'
  import { shortcut } from '$lib/actions'

  import Icon, {
    TwindLogo,
    Github,
    Discord,
    ChatBubbleLeftRightSolid,
    CodeBracketSquareSolid,
    BookHalf,
    MagnifyingGlassMini,
    Mastodon,
    BugAntSolid,
  } from '$lib/icons'

  import { searchOpen } from '$lib/stores'

  import ThemeSwitcher from './theme-switcher.svelte'

  $: docsIssueURL = createBugReportURL($page.url.toString())

  function createBugReportURL(link = $page.url.toString()) {
    const url = new URL('https://github.com/tw-in-js/twind/issues/new')
    url.searchParams.set('template', 'docs.yml')
    url.searchParams.set('affects', `- ${link}`)
    return url.toString()
  }
</script>

<header class="w-full sticky top-0 z-10 border-b border-brand-7 backdrop-blur bg-brand-1/95">
  <div class="max-w-8xl mx-auto p-4 flex-auto flex items-center justify-between gap-4">
    <div class="flex gap-(4 lg:8 xl:12)">
      <a data-sveltekit-prefetch href="/" class="flex font-medium items-center hover:text-brand-12">
        <Icon src={TwindLogo} class="w-8 h-8" />
        <span class="sr-only md:(not-sr-only ml-3 text-xl)">
          <span class="text-brand-12">Twind</span><span
            class="bg-clip-text text-transparent bg-gradient-to-r from-info-11 via-accent-11 to-brand-11"
            >.style</span
          >
        </span>
      </a>

      {#if $$slots.default}
        <div class="flex items-center gap-4">
          <slot />
        </div>
      {/if}
    </div>

    <nav class="flex items-center gap-3 lg:gap-4" aria-label="Site Navigation">
      <button
        type="button"
        class="block w-5 hover:text-brand-12 lg:hidden"
        on:click={() => ($searchOpen = true)}
        use:shortcut={{ control: true, code: 'KeyK' }}
      >
        <Icon src={MagnifyingGlassMini} class="w-4 h-4" label="Quick search..." />
      </button>

      <hr class="w-0 h-5 border-l border-brand-6 lg:hidden" aria-orientation="vertical" />

      <a
        data-sveltekit-prefetch
        class="flex items-center gap-2 hover:text-brand-12"
        href={docsIssueURL}
        title="Something lacking or missing? Create a documentation issue"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <Icon
          src={BugAntSolid}
          class="-ml-1 h-5 w-5"
          label="Something lacking or missing? File an issue!"
        />
        <span class="sr-only lg:not-sr-only">Something lacking or missing? File an issue!</span>
      </a>

      <hr class="w-0 h-5 border-l border-brand-6" aria-orientation="vertical" />

      <a
        data-sveltekit-prefetch
        class="flex items-center hover:text-brand-12"
        href={$page.data.docStartHref}
        title="Go to Twind documentation"
      >
        <Icon src={BookHalf} class="h-5 w-5" label="Twind Documentation" />
      </a>

      <a
        class="flex items-center hover:text-brand-12"
        href="https://twind.run"
        title="Go to Twind Playground"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <Icon src={CodeBracketSquareSolid} class="h-5 w-5" label="Twind Playground" />
      </a>

      <a
        class="flex items-center hover:text-brand-12"
        href="https://github.com/tw-in-js/twind/discussions"
        title="Go to Twind discussions on GitHub"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <Icon src={ChatBubbleLeftRightSolid} class="h-5 w-5" label="Discussions on GitHub" />
      </a>

      <a
        class="flex items-center hover:text-brand-12"
        href="https://github.com/tw-in-js/twind/tree/next"
        title="Go to Twind on GitHub"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <Icon src={Github} class="h-5 w-5" label="Twind on GitHub" />
      </a>

      <a
        class="flex items-center hover:text-brand-12"
        href="https://chat.twind.style"
        title="Go to Twind on Discord"
        rel="external nofollow noopener noreferrer"
        target="_blank"
      >
        <Icon src={Discord} class="h-5 w-5" label="Twind on Discord" />
      </a>

      <a
        class="flex items-center hover:text-brand-12"
        href="https://mas.to/@twind"
        title="Go to Twind on Mastodon"
        rel="external nofollow noopener noreferrer me"
        target="_blank"
      >
        <Icon src={Mastodon} class="h-5 w-5" label="Twind on Mastodon" />
      </a>

      <hr class="w-0 h-6 border-l border-brand-6" aria-orientation="vertical" />

      <ThemeSwitcher class="block w-5 hover:text-brand-12" />
    </nav>
  </div>
</header>
