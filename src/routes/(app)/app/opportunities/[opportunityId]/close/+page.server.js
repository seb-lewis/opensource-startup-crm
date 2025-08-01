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
        select: { id: true, name: true }
      }
    }
  });
  
  if (!opportunity) {
    throw error(404, 'Opportunity not found');
  }
  
  return { opportunity };
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

    const formData = await request.formData();
    const status = formData.get('status')?.toString();
    const closeDate = formData.get('closeDate')?.toString();
    const closeReason = formData.get('closeReason')?.toString();

    // Validate required fields
    if (!status || !closeDate) {
      return fail(400, { error: 'Status and close date are required' });
    }

    // Validate status
    const validCloseStatuses = ['CLOSED_WON', 'CLOSED_LOST'];
    if (!status || !validCloseStatuses.includes(status)) {
      return fail(400, { error: 'Invalid status selected' });
    }

    try {
      // First, verify the opportunity exists and belongs to the organization
      const opportunity = await prisma.opportunity.findFirst({
        where: { 
          id: params.opportunityId,
          organizationId: locals.org.id
        },
        include: {
          account: { select: { id: true } }
        }
      });

      if (!opportunity) {
        return fail(404, { error: 'Opportunity not found' });
      }

      // Update the opportunity with closing details
      const opportunityStage = /** @type {import('@prisma/client').OpportunityStage} */ (status);
      
      await prisma.opportunity.update({
        where: { id: params.opportunityId },
        data: {
          stage: opportunityStage, // CLOSED_WON or CLOSED_LOST
          status: status === 'CLOSED_WON' ? 'SUCCESS' : 'FAILED',
          closeDate: closeDate ? new Date(closeDate) : null,
          description: closeReason ? 
            (opportunity.description ? `${opportunity.description}\n\nClose Reason: ${closeReason}` : `Close Reason: ${closeReason}`) 
            : opportunity.description,
          updatedAt: new Date()
        }
      });

      // Create audit log entry
      await prisma.auditLog.create({
        data: {
          action: 'UPDATE',
          entityType: 'Opportunity',
          entityId: opportunity.id,
          description: `Opportunity closed with status: ${status}`,
          newValues: {
            stage: status,
            status: status === 'CLOSED_WON' ? 'SUCCESS' : 'FAILED',
            closeDate: closeDate,
            closeReason: closeReason
          },
          userId: locals.user.id,
          organizationId: locals.org.id
        }
      });

      throw redirect(303, `/app/opportunities/${opportunity.id}`);
    } catch (err) {
      console.error('Error closing opportunity:', err);
      if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
        throw err; // Re-throw redirect
      }
      return fail(500, { error: 'Failed to close opportunity. Please try again.' });
    }
  }
};
