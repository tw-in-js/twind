/** @type {import('./$types').LayoutServerLoad} */
export function load({ setHeaders }) {
  // Harden security for an application
  setHeaders({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'document-domain=()',
    // TODO: CSP - https://support.cloudflare.com/hc/en-us/articles/216537517-What-is-Content-Security-Policy-CSP-and-how-can-I-use-it-with-Cloudflare-
    'Feature-Policy': `fullscreen 'self' https://challenges.cloudflare.com`,
  })
}
