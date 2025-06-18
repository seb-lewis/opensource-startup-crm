import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';

const prisma = new PrismaClient();

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    try {
        // Get user's organization (assuming it's available in locals)
        const userId = locals.user?.id;
        const organizationId = locals.org?.id;

        if (!userId) {
            return {
                opportunities: [],
                stats: {
                    total: 0,
                    totalValue: 0,
                    wonValue: 0,
                    pipeline: 0
                }
            };
        }

        // If no organizationId in user object, try to get it from UserOrganization
        let finalOrganizationId = organizationId;
        if (!finalOrganizationId) {
            const userOrg = await prisma.userOrganization.findFirst({
                where: {
                    userId: userId
                },
                select: {
                    organizationId: true
                }
            });
            finalOrganizationId = userOrg?.organizationId;
        }

        if (!finalOrganizationId) {
            return {
                opportunities: [],
                stats: {
                    total: 0,
                    totalValue: 0,
                    wonValue: 0,
                    pipeline: 0
                }
            };
        }

        // Fetch opportunities with related data
        const opportunities = await prisma.opportunity.findMany({
            where: {
                organizationId: finalOrganizationId
            },
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                contacts: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        events: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calculate stats
        const stats = {
            total: opportunities.length,
            totalValue: opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0),
            wonValue: opportunities
                .filter(opp => opp.stage === 'CLOSED_WON')
                .reduce((sum, opp) => sum + (opp.amount || 0), 0),
            pipeline: opportunities
                .filter(opp => !['CLOSED_WON', 'CLOSED_LOST'].includes(opp.stage))
                .reduce((sum, opp) => sum + (opp.amount || 0), 0)
        };

        return {
            opportunities: opportunities.map(opp => ({
                ...opp,
                amount: opp.amount ? Number(opp.amount) : null,
                expectedRevenue: opp.expectedRevenue ? Number(opp.expectedRevenue) : null
            })),
            stats
        };
    } catch (error) {
        console.error('Error loading opportunities:', error);
        return {
            opportunities: [],
            stats: {
                total: 0,
                totalValue: 0,
                wonValue: 0,
                pipeline: 0
            }
        };
    }
};

/** @type {import('./$types').Actions} */
export const actions = {
    delete: async ({ request, locals }) => {
        try {
            const formData = await request.formData();
            const opportunityId = formData.get('opportunityId')?.toString();
            const userId = locals.user?.id;
            const organizationId = locals.org?.id;

            if (!opportunityId || !userId || !organizationId) {
                return fail(400, { message: 'Missing required data' });
            }

            // Check if the opportunity exists and belongs to the user's organization
            const opportunity = await prisma.opportunity.findFirst({
                where: {
                    id: opportunityId,
                    organizationId: organizationId
                }
            });

            if (!opportunity) {
                return fail(404, { message: 'Opportunity not found' });
            }

            // Delete the opportunity
            await prisma.opportunity.delete({
                where: {
                    id: opportunityId
                }
            });

            return { success: true, message: 'Opportunity deleted successfully' };
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            return fail(500, { message: 'Failed to delete opportunity' });
        }
    }
};