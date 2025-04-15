import { error, redirect } from '@sveltejs/kit';
// export const ssr = true

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, cookies }) {
  if (await cookies.get('session')) {
    await cookies.delete('session', { path: '/' });
  }
  if (locals.user) {

    delete locals.user
    await cookies.delete('session', { path: '/' });
  }
  throw redirect(303, '/bounce');

}
