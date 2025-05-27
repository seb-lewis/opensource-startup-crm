import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    try {
        // Get basic counts
        const [
            totalUsers,
            totalOrganizations,
            totalAccounts,
            totalContacts,
            totalLeads,
            totalOpportunities,
            totalTasks,
            totalCases
        ] = await Promise.all([
            prisma.user.count({ where: { isActive: true } }),
            prisma.organization.count({ where: { isActive: true } }),
            prisma.account.count({ where: { isActive: true, isDeleted: false } }),
            prisma.contact.count(),
            prisma.lead.count(),
            prisma.opportunity.count(),
            prisma.task.count(),
            prisma.case.count()
        ]);

        // Get opportunity metrics
        const [
            wonOpportunities,
            openOpportunities
        ] = await Promise.all([
            prisma.opportunity.count({ where: { stage: 'CLOSED_WON' } }),
            prisma.opportunity.count({ 
                where: { 
                    stage: { 
                        in: ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'] 
                    } 
                } 
            })
        ]);

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            newAccountsThisMonth,
            newLeadsThisMonth,
            newOpportunitiesThisMonth,
            tasksCompletedThisMonth
        ] = await Promise.all([
            prisma.account.count({
                where: {
                    createdAt: { gte: thirtyDaysAgo },
                    isActive: true,
                    isDeleted: false
                }
            }),
            prisma.lead.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            prisma.opportunity.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            prisma.task.count({
                where: {
                    updatedAt: { gte: thirtyDaysAgo },
                    status: 'Completed'
                }
            })
        ]);

        return {
            metrics: {
                totalUsers,
                totalOrganizations,
                totalAccounts,
                totalContacts,
                totalLeads,
                totalOpportunities,
                totalTasks,
                totalCases,
                wonOpportunities,
                openOpportunities,
                newAccountsThisMonth,
                newLeadsThisMonth,
                newOpportunitiesThisMonth,
                tasksCompletedThisMonth
            }
        };
    } catch (error) {
        console.error('Error loading analytics:', error);
        return {
            metrics: {
                totalUsers: 0,
                totalOrganizations: 0,
                totalAccounts: 0,
                totalContacts: 0,
                totalLeads: 0,
                totalOpportunities: 0,
                totalTasks: 0,
                totalCases: 0,
                wonOpportunities: 0,
                openOpportunities: 0,
                newAccountsThisMonth: 0,
                newLeadsThisMonth: 0,
                newOpportunitiesThisMonth: 0,
                tasksCompletedThisMonth: 0
            }
        };
    }
}