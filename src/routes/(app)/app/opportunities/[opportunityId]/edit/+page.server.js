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
  default: async ({ request, params }) => {
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    const amount = form.get('amount') ? parseFloat(form.get('amount')) : null;
    const stage = form.get('stage')?.toString();
    const probability = form.get('probability') ? parseFloat(form.get('probability')) : null;
    const closeDate = form.get('closeDate') ? new Date(form.get('closeDate')) : null;
    const description = form.get('description')?.toString();
    if (!name) return fail(400, { message: 'Name is required.' });
    try {
      await prisma.opportunity.update({
        where: { id: params.opportunityId },
        data: { name, amount, stage, probability, closeDate, description }
      });
      throw redirect(303, `/app/opportunities/${params.opportunityId}`);
    } catch (err) {
      return fail(500, { message: 'Failed to update opportunity.' });
    }
  }
};
