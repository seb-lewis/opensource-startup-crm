import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
    const user = locals.user;
    const org = locals.org;
    
    // Get accountId from URL parameters for validation
    const urlAccountId = url.searchParams.get('accountId');
    
    const users = await prisma.user.findMany({
        where: {
            organizations: {
                some: {
                    organizationId: org.id
                }
            }
        }
    });
    
    const accounts = await prisma.account.findMany({
        where: {
            organizationId: org.id
        }
    });

    // If accountId is provided in URL, validate it exists
    if (urlAccountId) {
        const accountExists = accounts.some(account => account.id === urlAccountId);
        if (!accountExists) {
            throw redirect(303, '/app/tasks/new');
        }
    }
    
    return { users, accounts };
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, locals }) => {
        const { user, org } = locals;

        const formData = await request.formData();

        const subject = formData.get('subject')?.toString();
        const status = formData.get('status')?.toString() || 'Not Started';
        const priority = formData.get('priority')?.toString() || 'Normal';
        const dueDateStr = formData.get('dueDate')?.toString();
        const ownerId = formData.get('ownerId')?.toString();
        let accountId = formData.get('accountId')?.toString();
        const description = formData.get('description')?.toString();

        console.log('Form data received:', { subject, status, priority, dueDateStr, ownerId, accountId, description });

        if (!subject) {
            return fail(400, { 
                error: 'Subject is required.',
                subject, status, priority, dueDate: dueDateStr, ownerId, accountId, description
            });
        }
        if (!ownerId) {
            return fail(400, { 
                error: 'Owner is required.',
                subject, status, priority, dueDate: dueDateStr, ownerId, accountId, description
            });
        }

        // Validate ownerId
        const taskOwner = await prisma.user.findFirst({
            where: {
                id: ownerId,
                organizations: {
                    some: { organizationId: org.id }
                }
            }
        });
        if (!taskOwner) {
            return fail(400, { 
                error: 'Invalid owner selected or owner does not belong to this organization.',
                subject, status, priority, dueDate: dueDateStr, ownerId, accountId, description
            });
        }

        // Validate accountId if provided
        if (accountId && accountId !== "" && accountId !== "null") {
            const taskAccount = await prisma.account.findFirst({
                where: {
                    id: accountId,
                    organizationId: org.id
                }
            });
            if (!taskAccount) {
                return fail(400, { 
                    error: 'Invalid account selected or account does not belong to this organization.',
                    subject, status, priority, dueDate: dueDateStr, ownerId, accountId, description
                });
            }
        } else {
            accountId = undefined;
        }

        const dueDate = dueDateStr ? new Date(dueDateStr) : null;

        try {
            // Prepare task data
            const taskData = {
                subject,
                status,
                priority,
                dueDate,
                description: description || null,
                ownerId: ownerId,
                createdById: user.id,
                organizationId: org.id,
                ...(accountId && { accountId })
            };

            console.log('Creating task with data:', taskData);

            const task = await prisma.task.create({
                data: taskData
            });

            console.log('Task created successfully:', task);

            // Redirect based on where the task was created from
            if (accountId) {
                // If task was created from an account page, redirect back to that account
                throw redirect(303, `/app/accounts/${accountId}`);
            } else {
                // Otherwise, redirect to the tasks list
                throw redirect(303, '/app/tasks/list');
            }

        } catch (e) {
            // If it's a redirect, let it pass through
            if (e && typeof e === 'object' && 'status' in e && e.status === 303) {
                throw e;
            }
            
            console.error('Failed to create task:', e);
            return fail(500, {
                error: 'Failed to create task. Please try again.',
                subject, status, priority, dueDate: dueDateStr, ownerId, accountId, description
            });
        }
    }
};