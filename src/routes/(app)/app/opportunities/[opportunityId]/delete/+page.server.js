import { error, fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ params }) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: params.opportunityId }
  });
  if (!opportunity) throw error(404, 'Opportunity not found');
  return { opportunity };
}

export const actions = {
  default: async ({ params }) => {
    try {
      await prisma.opportunity.delete({ where: { id: params.opportunityId } });
      throw redirect(303, `/app/accounts/${params.accountId}`);
    } catch (err) {
      return fail(500, { message: 'Failed to delete opportunity.' });
    }
  }
};
