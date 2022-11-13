<script>
  import { page } from '$app/stores'
  import { browser } from '$app/environment'

  import SkipTo from './skip-to.svelte'
  import Header from './header.svelte'
  import Nav from './nav.svelte'
  import Footer from './footer.svelte'
  import Search from './search.svelte'
</script>

<SkipTo />

<Header />

<div class="max-w-8xl mx-auto px-4 relative" data-sveltekit-prefetch>
  {#if $page.data.nav}
    <Nav nav={$page.data.nav} />
  {/if}

  <div class="px-2 md:px-10" class:lg:ml-64={$page.data.nav} class:xl:mr-64={$page.data.file}>
    <main id="main" class="pt-10 scroll-mt-24">
      <slot />
    </main>

    <Footer />
  </div>
</div>

{#if browser}
  <Search />
{/if}
