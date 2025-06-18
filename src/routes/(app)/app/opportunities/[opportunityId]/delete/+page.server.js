import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ params, locals }) {
    const userId = locals.user?.id;
    const organizationId = locals.org?.id;

    if (!userId || !organizationId) {
        throw error(401, 'Unauthorized');
    }

    const opportunity = await prisma.opportunity.findFirst({
        where: {
            id: params.opportunityId,
            organizationId: organizationId
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
                    name: true,
                    email: true
                }
            }
        }
    });

    if (!opportunity) {
        throw error(404, 'Opportunity not found');
    }

    return {
        opportunity
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ params, locals }) => {
        try {
            const userId = locals.user?.id;
            const organizationId = locals.org?.id;

            if (!userId || !organizationId) {
                return fail(401, { message: 'Unauthorized' });
            }

            // Check if the opportunity exists and belongs to the user's organization
            const opportunity = await prisma.opportunity.findFirst({
                where: {
                    id: params.opportunityId,
                    organizationId: organizationId
                }
            });

            if (!opportunity) {
                return fail(404, { message: 'Opportunity not found' });
            }

            // Delete the opportunity (this will cascade delete related records)
            await prisma.opportunity.delete({
                where: {
                    id: params.opportunityId
                }
            });

            // Return success response - let client handle redirect
            return { success: true, message: 'Opportunity deleted successfully' };
        } catch (err) {
            console.error('Error deleting opportunity:', err);
            return fail(500, { message: 'Failed to delete opportunity' });
        }
    }
};
