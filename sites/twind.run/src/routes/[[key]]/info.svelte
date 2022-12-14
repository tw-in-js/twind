<script>
  import { writable, get } from 'svelte/store'

  import intellisense from '$lib/intellisense'
  import Loader from './loader.svelte'

  /** @type {import('$lib/types').Manifest } */
  export let manifest

  /** @type {import('$lib/system').ImportMap | null} */
  export let importMap

  /** Class name for the editor container */
  let className = ''
  export { className as class }

  /** @type {[name: string, version: string][]} */
  let packages = []

  /** @type {Record<string, Record<string, string>>} */
  let colors = {}

  /** @type {import('svelte/store').Writable<import('$lib/types').Manifest | null>} */
  const lastManifest = writable(null)

  /** @type {import('svelte/store').Writable<import('$lib/system').ImportMap | null>} */
  const lastImportMap = writable(null)

  $: if (importMap && get(lastImportMap) !== importMap && get(lastManifest) !== manifest) {
    lastImportMap.set(importMap)
    lastManifest.set(manifest)

    const imports = Object.keys(importMap.imports || {})

    packages = Object.entries(manifest.packages).filter(([pkg]) =>
      imports.some((i) => i === pkg || i.startsWith(`${pkg}/`)),
    )

    intellisense
      .getColors()
      .then((_) => {
        if (get(lastImportMap) === importMap) {
          colors = _
        }
      })
      .catch((error) => {
        console.warn(error)
        colors = {}
      })
  }
</script>

<Loader isReady={importMap} class={className}>
  <div class="absolute inset-0 w-full h-full overflow-auto">
    <section class="px-4 py-5 sm:px-6 max-w-3xl mx-auto space-y-10">
      <header>
        <h2 class="flex flex-wrap gap-2 text-2xl font-medium leading-6 text-brand-12">
          <span>Workspace</span><small>v{manifest.version}</small>
        </h2>
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
            stable version and test theirs apps to make sure they’re compatible with the latest API
            and feature changes. It is also a good way to help us by reporting bugs and giving some
            feedback.
            <br />
            Breaking changes can happen on the next version: detailed upgrade instructions are available
            in the changelog and pull requests.
          {:else}
            still in development. Features appear and disappear, making it unstable for everyday
            use. We recommend that you don’t use a canary version or only for testing.
          {/if}
        </p>
      </header>
      <div class="mt-8 flex flex-wrap items-center justify-start gap-4">
        {#each packages as [name, version]}
          <div
            class="relative basis-[calc(50%-1rem)] min-w-[16rem] flex-shrink flex-grow rounded-lg border border-brand-7 bg-brand-3 text-brand-11 px-3 py-2 shadow-sm focus-within:ring-(2 brand-7 offset-2) hover:(border-brand-8 bg-brand-4 text-brand-12)"
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

      <section>
        <header>
          <h3 class="flex flex-wrap gap-2 text-xl font-medium leading-6 text-brand-12">
            <span>Available Theme Colors</span>
          </h3>
          <p class="mt-3 text-sm">
            The following table is dynamically generated from the theme of the current
            configuration.
          </p>
        </header>
        <dl>
          {#each Object.entries(colors) as [section, values]}
            {@const keys = Object.keys(values)}
            {@const standalone = keys.length === 1 && keys[0] === 'DEFAULT'}
            <dt class="mt-4">
              <div class="h-10 flex flex-col justify-center">
                <div class="text-sm font-semibold text-brand-12 capitalize">
                  {section}
                </div>
              </div>
            </dt>
            <dd class="mt-0.5 flex flex-wrap gap-x-2 gap-y-3">
              {#each Object.entries(values) as [key, color]}
                <div class="space-y-1.5 text-xs">
                  <div
                    class="h-10 w-full rounded ring-1 ring-inset ring-brand-7"
                    style="background-color: {color};"
                  />
                  <div class="px-0.5">
                    {#if !standalone}
                      <div class="font-medium text-brand-12 w-full">{key}</div>
                    {/if}
                    <div class="min-w-[3.5rem] text-brand-11 font-mono lowercase select-all">
                      {color}
                    </div>
                  </div>
                </div>
              {/each}
            </dd>
          {/each}
        </dl>
      </section>
    </section>
  </div>
</Loader>
