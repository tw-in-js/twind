<script>
  import { cx } from '$lib/twind'

  /** @type {import('$lib/types').Manifest } */
  export let manifest

  /** Class name for the editor container */
  let className = ''
  export { className as class }
</script>

<section class={cx('px-4 py-5 sm:px-6 max-w-prose mx-auto', className)}>
  <header>
    <h3 class="flex flex-wrap gap-2 text-lg font-medium leading-6 text-brand-12">
      <span>Workspace</span><small>v{manifest.version}</small>
    </h3>
    <p class="mt-3 text-sm">
      <strong class="capitalize"
        >{manifest['dist-tag'] === 'latest' ? 'stable' : manifest['dist-tag']} version</strong
      >
      (<a
        class="underline hover:text-brand-12"
        href={`https://github.com/tw-in-js/twind/${
          manifest.pr ? 'pull/' + manifest.pr : 'commit/' + manifest['git-sha']
        }`}
        rel="external nofollow noopener noreferrer"
        target="_blank">{manifest.pr ? '#' + manifest.pr : manifest['git-sha'].slice(0, 8)}</a
      >) —

      {#if manifest['dist-tag'] === 'latest'}
        recommended for most of users.
      {:else if manifest['dist-tag'] === 'next'}
        not 100% stable, but early adopters can use it to get a preview of what’s coming to the
        stable version and test theirs apps to make sure they’re compatible with the latest API and
        feature changes. It is also a good way to help us by reporting bugs and giving some
        feedback.
        <br />
        Breaking changes can happen on the next version: detailed upgrade instructions are available
        in the changelog and pull requests.
      {:else}
        still in development. Features appear and disappear, making it unstable for everyday use. We
        recommend that you don’t use a canary version or only for testing.
      {/if}
    </p>
  </header>
  <div class="mt-8 flex flex-wrap items-center justify-start gap-4">
    {#each Object.entries(manifest.packages) as [name, version]}
      <div
        class="relative basis-[calc(50%-1rem)] min-w-[16rem] flex-shrink flex-grow rounded-lg border border-brand-7 bg-brand-3 text-brand-11 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-brand-7 focus-within:ring-offset-2 hover:(border-brand-8 bg-brand-4 text-brand-12)"
      >
        <a
          class="focus:outline-none"
          href={`https://www.npmjs.com/package/${name}/v/${version}`}
          title="Open on NPM"
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          <span class="absolute inset-0" aria-hidden="true" />
          <p class="font-medium">{name}</p>
          <p class="truncate text-sm">{version}</p>
        </a>
      </div>
    {/each}
  </div>
</section>
