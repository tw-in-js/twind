/** @type {import('./$types').LayoutServerLoad} */
export async function load({ setHeaders }) {
  // Harden security for an application
  try {
    setHeaders({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      // https://www.permissionspolicy.com
      'Permissions-Policy': [
        `cross-origin-isolated=(self)`,
        `fullscreen=(self "https://challenges.cloudflare.com")`,
        // `web-share=(self)`,
        `clipboard-write=(self)`,
        // `focus-without-user-activation=(self)`,
        `idle-detection=(self)`,
        // `unload=(self)`,
      ].join(', '),
      'Feature-Policy': `fullscreen 'self' https://challenges.cloudflare.com`,
      // TODO: CSP - https://support.cloudflare.com/hc/en-us/articles/216537517-What-is-Content-Security-Policy-CSP-and-how-can-I-use-it-with-Cloudflare-
    })
  } catch {}
}
