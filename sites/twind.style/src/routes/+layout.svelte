<script>
  import { browser } from '$app/environment'

  import Layout from '$lib/template/layout.svelte'

  import { registerServiceWorker } from '../service-worker/register'

  // If a new service worker has been registered — do a full page refresh on the next navigation
  const registration = registerServiceWorker('/service-worker.js')
  // TODO: show a toast with: `A new update is available. Reload to view the latest and greatest updates.`
  $: if (browser) {
    console.debug('registration', $registration)
  }
  // $: if ($registration === 'installed') {
  // }
</script>

<Layout><slot /></Layout>
