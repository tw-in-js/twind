<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    /** @type {import('./index.json').Body}*/
    const nav = await fetch(`/docs.json`).then((res) => res.json())

    return { stuff: { nav } }
  }
</script>

<slot />
