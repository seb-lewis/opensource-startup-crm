import { fail, redirect, error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const account = await prisma.account.findUnique({
    where: { id: params.accountId }
  });
  if (!account) throw error(404, 'Account not found');
  return { account };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, params }) => {
    const form = await request.formData();
    const name = form.get('name');
    const industry = form.get('industry');
    const type = form.get('type');
    const website = form.get('website');
    const phone = form.get('phone');

    if (!name) {
      return fail(400, { name, missing: true });
    }

    await prisma.account.update({
      where: { id: params.accountId },
      data: { name, industry, type, website, phone }
    });
    throw redirect(303, `/app/accounts/${params.accountId}`);
  }
};
