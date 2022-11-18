<script>
  import { page } from '$app/stores'

  import { tw } from '$lib/twind'
  import { scrollspy, wicked, lazy } from '$lib/actions'
  import Head from '$lib/template/head.svelte'

  /** @type {import('./$types').PageData}*/
  export let data
</script>

<Head
  title={[data.section, data.label].filter(Boolean).join(': ')}
  description={data.description}
/>

<header class="flex flex-col gap-4">
  {#if data.section}
    <p class="text-sm leading-6 font-semibold text-accent-11">
      {data.section}
    </p>
  {/if}
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-12 tracking-tight">
      {data.title}
    </h1>
    {#if data.badges}
      <div class="flex &>p:(flex gap-2)">{@html data.badges}</div>
    {/if}
  </div>
  {#if data.excerpt}
    <div class="prose prose-lg">{@html data.excerpt}</div>
  {/if}

  {#if data.package || data.playground}
    <div class="prose">
      <ul>
        {#if data.package && $page.url.pathname.startsWith('/packages/') && !['@twind/core', 'twind'].includes(data.package)}
          <li>
            📖 Study <a
              href="/{data.package === '@twind/cdn' ? 'installation#twind-cdn' : data.folder}"
              >the documentation</a
            >
          </li>
        {/if}
        {#if data.playground}
          <li>
            🤖 Try <a
              href="https://twind.run{data.package === 'twind' ? '' : '/' + data.playground}"
              >the playground</a
            >
          </li>
        {/if}
        {#if data.example}
          <li>
            📝 Inspect <a href="https://github.com/tw-in-js/twind/tree/main/examples/{data.example}"
              >the example</a
            >
          </li>
        {/if}
        {#if data.package}
          {#if !data.example}
            <li>
              🧭 Explore <a href="/examples">the examples</a>
            </li>
          {/if}
          {#if !$page.url.pathname.startsWith('/packages/')}
            <li>
              📓 Consult <a href="/packages/{data.package}">the API reference</a>
            </li>
          {/if}
          <li>
            📜 Read <a
              href="https://github.com/tw-in-js/twind/tree/main/packages/{data.folder}/CHANGELOG.md"
              >the changelog</a
            >
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</header>

<div
  class="mt-4 lg:mt-8 prose max-w-none prose-headings:scroll-mt-24"
  use:scrollspy={{ className: tw('text-accent-11') }}
  use:wicked={[['[data-clipboard-copy]', lazy(() => import('$lib/actions/clipboard-copy'))]]}
>
  {@html data.content}
</div>

{#if data.prev || data.next}
  <footer
    class="text-sm leading-6 mt-8 font-semibold flex items-center justify-between text-brand-11"
  >
    <!-- TODO: add dimmed "PREVIOUS" -->
    {#if data.prev}
      <a
        href={data.prev.href}
        class="flex place-content-center gap-2 p-2 hover:text-brand-12"
        rel="prev"
        data-sveltekit-prefetch
      >
        <span aria-hidden="true">‹</span>
        {#if data.section !== data.prev.section}
          {data.prev.section}:
        {/if}
        {data.prev.label}
      </a>
    {/if}
    {#if data.next}
      <!-- TODO: add dimmed "NEXT" -->
      <a
        href={data.next.href}
        class="ml-auto flex place-content-center gap-2 p-2 hover:text-brand-12"
        rel="next"
        data-sveltekit-prefetch
      >
        {#if data.section !== data.next.section}
          {data.next.section}:
        {/if}
        {data.next.label}
        <span aria-hidden="true">›</span>
      </a>
    {/if}
  </footer>
{/if}
