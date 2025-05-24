import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    const user = locals.user;
    const org = locals.org;
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
    return { users, accounts };
};

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
        let accountId = formData.get('accountId')?.toString(); // Retain as string for now, convert to null later if empty
        const description = formData.get('description')?.toString();

        if (!subject) {
            return fail(400, { error: 'Subject is required.' });
        }
        if (!ownerId) {
            return fail(400, { error: 'Owner is required.' });
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
            return fail(400, { error: 'Invalid owner selected or owner does not belong to this organization.' });
        }

        // Validate accountId if provided
        if (accountId && accountId !== "") {
            const taskAccount = await prisma.account.findFirst({
                where: {
                    id: accountId,
                    organizationId: org.id
                }
            });
            if (!taskAccount) {
                return fail(400, { error: 'Invalid account selected or account does not belong to this organization.' });
            }
        } else {
            accountId = null; // Set to null if empty or not provided
        }

        const dueDate = dueDateStr ? new Date(dueDateStr) : null;

        try {
            await prisma.task.create({
                data: {
                    subject,
                    status,
                    priority,
                    dueDate,
                    description: description || null,
                    ownerId: ownerId,
                    createdById: user.id,
                    organizationId: org.id,
                    ...(accountId && { accountId: accountId }),
                }
            });
        } catch (e) {
            console.error('Failed to create task:', e);
            return fail(500, {
                error: 'Failed to create task. Please try again.',
                subject,
                status,
                priority,
                dueDate: dueDateStr,
                ownerId,
                accountId,
                description
            });
        }

        throw redirect(303, '/app/tasks/list');
    }
};