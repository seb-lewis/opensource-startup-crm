import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ locals, url }) {
    const org = locals.org;

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sort = url.searchParams.get('sort') || 'name';
    const order = url.searchParams.get('order') || 'asc';

    const skip = (page - 1) * limit;

    try {
        // Build the where clause for filtering
        /** @type {import('@prisma/client').Prisma.AccountWhereInput} */
        const where = {organizationId: org.id};

        // Add status filter
        const status = url.searchParams.get('status');
        if (status === 'open') {
            where.isActive = true;
        } else if (status === 'closed') {
            where.isActive = false;
        }

        // Fetch accounts with pagination
        const accounts = await prisma.account.findMany({
            where,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePhoto: true
                    }
                },
                opportunities: {
                    select: {
                        id: true,
                        stage: true,
                        amount: true
                    }
                },
                relatedContacts: {
                    select: {
                        contact: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            },
            orderBy: {
                [sort]: order
            },
            skip,
            take: limit
        });

        // Get the total count for pagination
        const total = await prisma.account.count({ where });

        return {
            accounts: accounts.map(account => ({
                ...account,
                isActive: account.isActive, // Use only the active field, ignore closedAt for display purposes
                opportunityCount: account.opportunities.length,
                contactCount: account.relatedContacts.length,
                taskCount: account.tasks.length,
                openOpportunities: account.opportunities.filter(opp => 
                    !['CLOSED_WON', 'CLOSED_LOST'].includes(opp.stage)
                ).length,
                totalOpportunityValue: account.opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0),
                // Keep the arrays but transformed/simplified
                topContacts: account.relatedContacts.slice(0, 3).map(rc => ({
                    id: rc.contact.id,
                    name: `${rc.contact.firstName} ${rc.contact.lastName}`
                })),
                opportunities: undefined,
                relatedContacts: undefined,
                tasks: undefined
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (err) {
        console.error('Error fetching accounts:', err);
        throw error(500, 'Failed to fetch accounts');
    }
}
