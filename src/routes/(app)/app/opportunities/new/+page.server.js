import prisma from '$lib/prisma';
import { redirect, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
    if (!locals.org) {
        throw redirect(302, '/org');
    }

    const preSelectedAccountId = url.searchParams.get('accountId');

    try {
        const [accounts, contacts, users] = await Promise.all([
            // Get active accounts for the organization
            prisma.account.findMany({
                where: {
                    organizationId: locals.org.id,
                    isActive: true,
                    isDeleted: false
                },
                select: {
                    id: true,
                    name: true,
                    type: true
                },
                orderBy: { name: 'asc' }
            }),
            
            // Get contacts for the organization or specific account
            prisma.contact.findMany({
                where: {
                    organizationId: locals.org.id,
                    ...(preSelectedAccountId && {
                        relatedAccounts: {
                            some: {
                                accountId: preSelectedAccountId
                            }
                        }
                    })
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                },
                orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
            }),
            
            // Get users in the organization for assignment
            prisma.user.findMany({
                where: {
                    organizations: {
                        some: {
                            organizationId: locals.org.id
                        }
                    },
                    isActive: true
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                },
                orderBy: { name: 'asc' }
            })
        ]);

        // Get pre-selected account details if provided
        let preSelectedAccount = null;
        if (preSelectedAccountId) {
            preSelectedAccount = accounts.find(account => account.id === preSelectedAccountId);
        }

        return {
            accounts,
            contacts: [], // Keep for backward compatibility
            accountContacts: contacts, // Renamed for clarity
            users,
            preSelectedAccountId,
            preSelectedAccountName: preSelectedAccount?.name || null
        };
    } catch (error) {
        console.error('Error loading opportunity form data:', error);
        return {
            accounts: [],
            contacts: [],
            accountContacts: [],
            users: [],
            preSelectedAccountId: null,
            preSelectedAccountName: null
        };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request, locals }) => {
        if (!locals.user || !locals.org) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const data = {
            name: formData.get('name'),
            accountId: formData.get('accountId'),
            stage: formData.get('stage'),
            amount: formData.get('amount'),
            closeDate: formData.get('closeDate'),
            probability: formData.get('probability'),
            type: formData.get('type'),
            leadSource: formData.get('leadSource'),
            nextStep: formData.get('nextStep'),
            description: formData.get('description'),
            ownerId: formData.get('ownerId'),
            contactIds: formData.getAll('contactIds')
        };

        // Validation
        const errors = {};
        
        if (!data.name || data.name.length < 2) {
            errors.name = 'Opportunity name must be at least 2 characters';
        }
        
        if (!data.accountId) {
            errors.accountId = 'Account is required';
        }
        
        if (!data.stage) {
            errors.stage = 'Stage is required';
        }
        
        if (data.amount && (isNaN(parseFloat(data.amount)) || parseFloat(data.amount) < 0)) {
            errors.amount = 'Amount must be a valid positive number';
        }
        
        if (data.probability && (isNaN(parseFloat(data.probability)) || parseFloat(data.probability) < 0 || parseFloat(data.probability) > 100)) {
            errors.probability = 'Probability must be between 0 and 100';
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, { errors, data });
        }

        try {
            // Verify account belongs to organization
            const account = await prisma.account.findFirst({
                where: {
                    id: data.accountId,
                    organizationId: locals.org.id,
                    isActive: true,
                    isDeleted: false
                }
            });

            if (!account) {
                return fail(400, { error: 'Invalid account selected' });
            }

            // Create opportunity
            const opportunity = await prisma.opportunity.create({
                data: {
                    name: data.name,
                    accountId: data.accountId,
                    stage: data.stage,
                    amount: data.amount ? parseFloat(data.amount) : null,
                    closeDate: data.closeDate ? new Date(data.closeDate) : null,
                    probability: data.probability ? parseFloat(data.probability) : null,
                    type: data.type || null,
                    leadSource: data.leadSource || null,
                    nextStep: data.nextStep || null,
                    description: data.description || null,
                    ownerId: data.ownerId || locals.user.id,
                    organizationId: locals.org.id,
                    expectedRevenue: data.amount && data.probability 
                        ? (parseFloat(data.amount) * parseFloat(data.probability)) / 100 
                        : null,
                    // Connect contacts if any selected
                    ...(data.contactIds.length > 0 && {
                        contacts: {
                            connect: data.contactIds.map(id => ({ id }))
                        }
                    })
                }
            });

            // Create audit log
            await prisma.auditLog.create({
                data: {
                    action: 'CREATE',
                    entityType: 'Opportunity',
                    entityId: opportunity.id,
                    description: `Created opportunity: ${opportunity.name}`,
                    newValues: {
                        name: opportunity.name,
                        stage: opportunity.stage,
                        amount: opportunity.amount
                    },
                    userId: locals.user.id,
                    organizationId: locals.org.id
                }
            });

            throw redirect(302, `/app/opportunities/${opportunity.id}`);
        } catch (error) {
            if (error.status === 302) {
                throw error; // Re-throw redirect
            }
            console.error('Error creating opportunity:', error);
            return fail(500, { error: 'Failed to create opportunity' });
        }
    }
};