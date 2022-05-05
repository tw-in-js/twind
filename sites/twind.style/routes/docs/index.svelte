<script context="module">
  export const prerender = true
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ stuff }) {
    return {
      status: 307,
      // TODO: this must be available!
      redirect: stuff.docStartHref,
    }
  }
</script>
