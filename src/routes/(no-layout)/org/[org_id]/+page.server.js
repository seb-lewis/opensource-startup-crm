import prisma from '$lib/prisma'
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
    const org_id = params.org_id;
    const user = locals.user;

    // Check if user is admin of the organization
    const userOrg = await prisma.userOrganization.findFirst({
        where: {
            userId: user.id,
            organizationId: org_id,
            role: 'ADMIN'
        }
    });
    if (!userOrg) {
        return {
            error: {
                name: 'You do not have permission to access this organization'
            }
        };
    }
    // Fetch organization details
    const organization = await prisma.organization.findUnique({
        where: {
            id: params.org_id
        }
    });

    // fetch all users in the organization
    const users = await prisma.userOrganization.findMany({
        where: {
            organizationId: org_id
        },
        include: {
            user: true
        }
    });
    return { organization, users };
};

/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({ request, params, locals }) => {
        const org_id = params.org_id;
        const user = locals.user;
        if (!user) return fail(401, { error: 'Unauthorized' });

        // Only ADMIN can update
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const name = formData.get('name')?.toString().trim();
        const domain = formData.get('domain')?.toString().trim();
        const description = formData.get('description')?.toString().trim();

        if (!name) return fail(400, { error: 'Name is required' });

        try {
            await prisma.organization.update({
                where: { id: org_id },
                data: {
                    name,
                    domain,
                    description
                }
            });
            return { success: true };
        } catch (err) {
            return fail(500, { error: 'Failed to update organization' });
        }
    }
};
