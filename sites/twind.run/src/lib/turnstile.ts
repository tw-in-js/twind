import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'

declare var turnstile: any

export async function getTurnstileToken(action: string): Promise<string | null | undefined | void> {
  if (!browser) return

  if (typeof turnstile !== 'object') {
    await new Promise((resolve) => {
      ;(self as any).onloadTurnstileCallback = resolve

      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'

      document.head.appendChild(script)
    })
  }

  const container = document.createElement('div')
  container.hidden = true

  return new Promise<string | null | undefined | void>((resolve) => {
    const widgetId = turnstile.render(document.body.appendChild(container), {
      sitekey: env.PUBLIC_TURNSTILE_SITE,
      action,
      callback: (token: string) => done(token),
      'expired-callback': () => done(),
      'error-callback': () => done(),
    })

    function done(token?: string) {
      turnstile.remove(widgetId)
      container.remove()
      resolve(token)
    }
  }).catch((error) => {
    console.error('failed to render turnstile widget', error)
  })
}
