<script>
  import { page } from '$app/stores'

  import SkipTo from './skip-to.svelte'
  import Header from './header.svelte'
  import Nav from './nav.svelte'
  import Footer from './footer.svelte'
</script>

<SkipTo />

<Header />

<div class="max-w-8xl mx-auto px-4 relative">
  {#if $page.stuff.nav}
    <Nav nav={$page.stuff.nav} />
  {/if}

  <div class="px-2 md:px-10" class:lg:ml-64={$page.stuff.nav} class:xl:mr-64={$page.stuff.editPath}>
    <main id="main" class="pt-10 scroll-mt-24"><slot /></main>

    <Footer />
  </div>
</div>
