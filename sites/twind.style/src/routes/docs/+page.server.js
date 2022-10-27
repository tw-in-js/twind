import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent }) {
  const { docStartHref } = await parent()

  if (docStartHref) {
    throw redirect(307, docStartHref);
  }
}
