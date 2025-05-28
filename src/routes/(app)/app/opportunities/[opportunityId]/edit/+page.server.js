import { error, fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ params }) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: params.opportunityId },
    include: {
      account: {
        select: {
          id: true,
          name: true
        }
      },
      owner: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  if (!opportunity) throw error(404, 'Opportunity not found');
  return { 
    opportunity,
    account: opportunity.account,
    owner: opportunity.owner 
  };
}

export const actions = {
  default: async ({ request, params }) => {
    const form = await request.formData();
    
    const name = form.get('name')?.toString().trim();
    const amount = form.get('amount') ? parseFloat(form.get('amount')) : null;
    const expectedRevenue = form.get('expectedRevenue') ? parseFloat(form.get('expectedRevenue')) : null;
    const stage = form.get('stage')?.toString();
    const probability = form.get('probability') ? parseFloat(form.get('probability')) : null;
    const closeDate = form.get('closeDate') ? new Date(form.get('closeDate')) : null;
    const leadSource = form.get('leadSource')?.toString() || null;
    const forecastCategory = form.get('forecastCategory')?.toString() || null;
    const type = form.get('type')?.toString() || null;
    const nextStep = form.get('nextStep')?.toString() || null;
    const description = form.get('description')?.toString() || null;

    if (!name) {
      return fail(400, { message: 'Opportunity name is required.' });
    }

    if (!stage) {
      return fail(400, { message: 'Stage is required.' });
    }

    // Validate probability range
    if (probability !== null && (probability < 0 || probability > 100)) {
      return fail(400, { message: 'Probability must be between 0 and 100.' });
    }

    // Validate amounts are not negative
    if (amount !== null && amount < 0) {
      return fail(400, { message: 'Amount cannot be negative.' });
    }

    if (expectedRevenue !== null && expectedRevenue < 0) {
      return fail(400, { message: 'Expected revenue cannot be negative.' });
    }

    try {
      await prisma.opportunity.update({
        where: { id: params.opportunityId },
        data: { 
          name, 
          amount, 
          expectedRevenue,
          stage, 
          probability, 
          closeDate, 
          leadSource,
          forecastCategory,
          type,
          nextStep,
          description 
        }
      });
      
      throw redirect(303, `/app/opportunities/${params.opportunityId}`);
    } catch (err) {
      console.error('Failed to update opportunity:', err);
      return fail(500, { message: 'Failed to update opportunity. Please try again.' });
    }
  }
};
