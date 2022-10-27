<script>
  import Layout from '$lib/template/layout.svelte'
  import { registerServiceWorker } from '$lib/service-worker/register'

  // If a new service worker has been registered — do a full page refresh on the next navigation
  registerServiceWorker('/service-worker.js')
  // TODO: show a toast with: `A new update is available. Reload to view the latest and greatest updates.`
  // $: if ($registration === 'installed') {
  // }
</script>

<Layout><slot /></Layout>
