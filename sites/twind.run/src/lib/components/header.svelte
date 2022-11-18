<script>
  import { page } from '$app/stores'

  import Icon, {
    TwindLogo,
    Github,
    Discord,
    BookHalf,
    CodeBracketSquareSolid,
    ChatBubbleLeftRightSolid,
    LoadingSpin,
    BugAntSolid,
  } from '$lib/icons'

  import ThemeSwitcher from './theme-switcher.svelte'

  /** @type {undefined | ((share: (link: string, workspace: import('../types').Workspace, manifest: import('../types').Manifest) => any | Promise<any>) => Promise<void>)} */
  export let withShareLink = undefined

  let sharing = false

  function createBugReportURL(reproduction = $page.url.toString(), systemInfo = '') {
    const url = new URL('https://github.com/tw-in-js/twind/issues/new')
    url.searchParams.set('template', 'bug_report.yml')
    url.searchParams.set('reproduction', reproduction)
    if (systemInfo) {
      url.searchParams.set('system-info', systemInfo)
    }
    return url.toString()
  }
</script>

<header
  class="relative flex-none overflow-visible flex items-center space-x-(1 md:2 lg:4) text-small py-1 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6"
>
  <div class="flex-auto flex items-center justify-between gap-(1 md:3 lg:4)">
    <div class="flex gap-(2 lg:4 xl:10)">
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
        <div class="flex items-center gap-(1 md:2 lg:4)">
          <slot />
        </div>
      {/if}
    </div>

    <div class="flex gap-(1 md:2 lg:4) items-center">
      <button
        type="button"
        class="flex gap-2 items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-brand-11 enabled:(hover:(text-brand-12 bg-brand-4 border-brand-8 shadow-sm) focus:(text-brand-12 bg-brand-5 border-brand-8 shadow-sm outline-none ring-1 ring-brand-7)) disabled:opacity-70"
        title="Create a bug report on GitHub"
        disabled={sharing}
        on:click={(event) => {
          event.preventDefault()

          if (withShareLink) {
            sharing = true
            withShareLink((reproduction, workspace, manifest) => {
              open(
                createBugReportURL(
                  reproduction,
                  [
                    `Version: ${manifest.version} (${[
                      manifest['dist-tag'],
                      manifest['git-sha'].slice(0, 7),
                      manifest.pr && `#${manifest.pr}`,
                    ]
                      .filter(Boolean)
                      .join(', ')})`,
                    Object.entries(manifest.packages)
                      .map(([pkg, version]) => `- ${pkg}: ${version}`)
                      .join('\n'),
                  ].join('\n\n'),
                ),
                '_blank',
              )
            }).finally(() => {
              sharing = false
            })
          } else {
            // use current url because after share the page.url is not updated
            open(createBugReportURL(location.href), '_blank')
          }
        }}
      >
        {#if sharing}
          <Icon
            src={LoadingSpin}
            class="-ml-1 h-5 w-5 animate-spin"
            label="Creating a bug report"
          />
        {:else}
          <Icon src={BugAntSolid} class="-ml-1 h-5 w-5" label="Something broken? File a bug!" />
        {/if}
        <span class="sr-only xl:not-sr-only">Something broken? File a bug!</span>
      </button>

      <hr class="w-0 h-5 border-l border-brand-6" aria-orientation="vertical" />

      <!-- <button type="button" class="ml-2 flex items-center text-accent-11">
        <Icon src={PanelLeftFilled} class="h-5 w-5" label="Switch to vertical split layout" />
      </button>

      <button type="button" class="ml-2 flex items-center hover:text-brand-12">
        <Icon src={PanelBottomFilled} class="h-5 w-5" label="Switch to horizontal split layout" />
      </button>

      <hr class="ml-3 w-0 h-5 border-l border-brand-6" aria-orientation="vertical" /> -->

      <nav
        class="flex gap-3 lg:gap-4 items-center text-base justify-center"
        aria-label="Site Navigation"
      >
        <a
          class="flex items-center hover:text-brand-12"
          href="https://twind.style/docs"
          title="Go to Twind documentation"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <Icon src={BookHalf} class="h-4 w-4" label="Twind Documentation" />
        </a>

        <a
          class="flex items-center hover:text-brand-12"
          href="https://twind.run"
          title="Go to Twind Playground"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <Icon src={CodeBracketSquareSolid} class="h-4 w-4" label="Twind Playground" />
        </a>

        <a
          class="flex items-center hover:text-brand-12"
          href="https://github.com/tw-in-js/twind/discussions"
          title="Go to Twind discussions on GitHub"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <Icon src={ChatBubbleLeftRightSolid} class="h-4 w-4" label="Discussions on GitHub" />
        </a>

        <a
          class="flex items-center hover:text-brand-12"
          href="https://github.com/tw-in-js/twind"
          title="Go to Twind on GitHub"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <Icon src={Github} class="h-4 w-4" label="Twind on GitHub" />
        </a>

        <a
          class="flex items-center hover:text-brand-12"
          href="https://chat.twind.style"
          title="Go to Twind on Discord"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <Icon src={Discord} class="h-4 w-4" label="Twind on Discord" />
        </a>

        <hr class="w-0 h-5 border-l border-brand-6" aria-orientation="vertical" />

        <ThemeSwitcher class="block w-5 hover:text-brand-12" />
      </nav>
    </div>
  </div>
</header>
