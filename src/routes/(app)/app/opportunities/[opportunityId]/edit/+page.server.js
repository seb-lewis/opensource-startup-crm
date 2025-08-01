import { error, fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/**
 * @param {Object} options
 * @param {Record<string, string>} options.params
 * @param {App.Locals} options.locals
 */
export async function load({ params, locals }) {
  if (!locals.org?.id) {
    throw error(403, 'Organization access required');
  }

  const opportunity = await prisma.opportunity.findFirst({
    where: { 
      id: params.opportunityId,
      organizationId: locals.org.id
    },
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
  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Record<string, string>} options.params
   * @param {App.Locals} options.locals
   */
  default: async ({ request, params, locals }) => {
    if (!locals.org?.id) {
      return fail(403, { error: 'Organization access required' });
    }

    const form = await request.formData();
    
    const name = form.get('name')?.toString().trim();
    const amount = form.get('amount') ? parseFloat(form.get('amount')?.toString() || '') : null;
    const expectedRevenue = form.get('expectedRevenue') ? parseFloat(form.get('expectedRevenue')?.toString() || '') : null;
    const stage = form.get('stage')?.toString();
    const probability = form.get('probability') ? parseFloat(form.get('probability')?.toString() || '') : null;
    const closeDateValue = form.get('closeDate')?.toString();
    const closeDate = closeDateValue ? new Date(closeDateValue) : null;
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

    // Validate stage is a valid enum value
    const validStages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
    if (!validStages.includes(stage)) {
      return fail(400, { message: 'Invalid stage selected.' });
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
      // Verify the opportunity exists and belongs to the organization
      const existingOpportunity = await prisma.opportunity.findFirst({
        where: { 
          id: params.opportunityId,
          organizationId: locals.org.id
        }
      });

      if (!existingOpportunity) {
        return fail(404, { message: 'Opportunity not found' });
      }

      const opportunityStage = /** @type {import('@prisma/client').OpportunityStage} */ (stage);
      
      await prisma.opportunity.update({
        where: { id: params.opportunityId },
        data: { 
          name, 
          amount, 
          expectedRevenue,
          stage: opportunityStage, 
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
