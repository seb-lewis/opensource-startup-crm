import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load({ locals }) {
    // Get user and organization from locals (assuming auth is handled)
    const userId = locals.user?.id;
    const organizationId = locals.org?.id;

    if (!userId || !organizationId) {
        return {
            error: 'User not authenticated'
        };
    }

    try {
        // Fetch dashboard metrics
        const [
            totalLeads,
            totalOpportunities,
            totalAccounts,
            totalContacts,
            pendingTasks,
            recentLeads,
            recentOpportunities,
            upcomingTasks,
            recentActivities
        ] = await Promise.all([
            // Count metrics
            prisma.lead.count({
                where: { organizationId, isConverted: false }
            }),
            prisma.opportunity.count({
                where: { organizationId, stage: { not: 'CLOSED_WON' } }
            }),
            prisma.account.count({
                where: { organizationId, isActive: true }
            }),
            prisma.contact.count({
                where: { organizationId }
            }),
            prisma.task.count({
                where: { 
                    organizationId,
                    status: { not: 'Completed' },
                    ownerId: userId
                }
            }),

            // Recent data
            prisma.lead.findMany({
                where: { organizationId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    company: true,
                    status: true,
                    createdAt: true
                }
            }),
            prisma.opportunity.findMany({
                where: { organizationId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    account: {
                        select: { name: true }
                    }
                }
            }),
            prisma.task.findMany({
                where: { 
                    organizationId,
                    ownerId: userId,
                    status: { not: 'Completed' },
                    dueDate: { gte: new Date() }
                },
                orderBy: { dueDate: 'asc' },
                take: 5,
                select: {
                    id: true,
                    subject: true,
                    status: true,
                    priority: true,
                    dueDate: true
                }
            }),
            prisma.auditLog.findMany({
                where: { organizationId },
                orderBy: { timestamp: 'desc' },
                take: 10,
                include: {
                    user: {
                        select: { name: true }
                    }
                }
            })
        ]);

        // Calculate opportunity revenue
        const opportunityRevenue = await prisma.opportunity.aggregate({
            where: { organizationId },
            _sum: { amount: true }
        });

        return {
            metrics: {
                totalLeads,
                totalOpportunities,
                totalAccounts,
                totalContacts,
                pendingTasks,
                opportunityRevenue: opportunityRevenue._sum.amount || 0
            },
            recentData: {
                leads: recentLeads,
                opportunities: recentOpportunities,
                tasks: upcomingTasks,
                activities: recentActivities
            }
        };
    } catch (error) {
        console.error('Dashboard load error:', error);
        return {
            error: 'Failed to load dashboard data'
        };
    }
}
