<script context="module">
  import install from '@twind/with-sveltekit'
  import config from '$/twind.config'
  install(config)

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    /** @type {import('./content.json').Body}*/
    const data = await fetch(`/content.json`).then((res) => res.json())

    return { stuff: data }
  }
</script>

<script>
  import Layout from '$/template/layout.svelte'
  import { registerServiceWorker } from '$/service-worker/register'

  // If a new service worker has been registered — do a full page refresh on the next navigation
  registerServiceWorker('/service-worker.js')
  // TODO: show a toast with: `A new update is available. Reload to view the latest and greatest updates.`
  // $: if ($registration === 'installed') {
  // }
</script>

<Layout><slot /></Layout>
