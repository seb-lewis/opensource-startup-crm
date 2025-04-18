import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ params }) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: params.opportunityId },
    include: {
      account: true,
      owner: true
    }
  });
  if (!opportunity) {
    throw error(404, 'Opportunity not found');
  }
  return {
    opportunity,
    account: opportunity.account,
    owner: opportunity.owner
  };
}
