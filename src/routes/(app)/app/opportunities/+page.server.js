import { PrismaClient } from '@prisma/client';

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