<script>
  import { onMount } from 'svelte'
  import { mutationObserver, shortcut } from '$lib/actions'
  import { searchOpen } from '$lib/stores'

  /** @type {string[][]}*/
  let active = []

  onMount(() => {
    const { destroy } = mutationObserver(document.body, {
      childList: true,
      subtree: true,
      callback() {
        active = [
          ['#main', 'Skip to main content'],
          ['#nav', 'Skip to site navigation'],
          ['#toc', 'Skip to table of contents'],
        ].filter(([selector]) => document.querySelector(selector))
      },
    })

    return destroy
  })
</script>

<nav
  class="fixed top-0 -translate-y-full transition-transform duration-300 focus-within:(z-50 translate-y-0) flex items-center w-full"
  aria-label="Skip to links"
>
  <ul
    class="bg-brand-7 text-brand-12 mx-auto px-5 py-2 space-y-2 rounded-bl rounded-br shadow list-['›']"
  >
    {#each active as [selector, label] (selector)}
      <li class="pl-2">
        <a href={selector} class="block">
          {label}
        </a>
      </li>
    {/each}

    <li class="pl-2">
      <button
        type="button"
        class="block"
        on:click={() => ($searchOpen = true)}
        use:shortcut={{ control: true, code: 'KeyK' }}>Open search</button
      >
    </li>
  </ul>
</nav>
