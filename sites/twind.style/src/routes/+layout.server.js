import { data } from '$lib/documentation'

export const prerender = true

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ setHeaders, request }) {
  // Harden security for an application
  try {
    setHeaders({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      // 'Permissions-Policy': 'document-domain=()',
      // TODO: CSP - https://support.cloudflare.com/hc/en-us/articles/216537517-What-is-Content-Security-Policy-CSP-and-how-can-I-use-it-with-Cloudflare-
    })
  } catch {}

  const { startHref } = await data

  return { docStartHref: startHref }
}
