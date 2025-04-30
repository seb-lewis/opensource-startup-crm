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
    // Pass logged-in user id to page for UI logic
    return { organization, users, user: { id: user.id } };
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
    },

    add_user: async ({ request, params, locals }) => {
        const org_id = params.org_id;
        const user = locals.user;
        if (!user) return fail(401, { error: 'Unauthorized' });

        // Only ADMIN can add
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const email = formData.get('email')?.toString().trim().toLowerCase();
        const role = formData.get('role')?.toString();
        if (!email || !role) return fail(400, { error: 'Email and role are required' });

        // Find user by email
        const foundUser = await prisma.user.findUnique({ where: { email } });
        if (!foundUser) return fail(404, { error: 'No user found with that email' });

        // Check if already in org
        const already = await prisma.userOrganization.findFirst({
            where: { userId: foundUser.id, organizationId: org_id }
        });
        if (already) return fail(400, { error: 'User already in organization' });

        // Add user to org
        await prisma.userOrganization.create({
            data: {
                userId: foundUser.id,
                organizationId: org_id,
                role
            }
        });
        return { success: true };
    },

    edit_role: async ({ request, params, locals }) => {
        const org_id = params.org_id;
        const user = locals.user;
        if (!user) return fail(401, { error: 'Unauthorized' });

        // Only ADMIN can edit
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const user_id = formData.get('user_id')?.toString();
        const role = formData.get('role')?.toString();
        if (!user_id || !role) return fail(400, { error: 'User and role are required' });

        // Don't allow editing own role (prevent lockout)
        if (user_id === user.id) return fail(400, { error: 'You cannot change your own role' });

        // Don't allow editing role of the only remaining admin
        if (role !== 'ADMIN') {
            // Count number of admins in org
            const adminCount = await prisma.userOrganization.count({
                where: {
                    organizationId: org_id,
                    role: 'ADMIN'
                }
            });
            // If target user is admin and only one admin left, prevent demotion
            const target = await prisma.userOrganization.findUnique({
                where: { userId_organizationId: { userId: user_id, organizationId: org_id } }
            });
            if (target && target.role === 'ADMIN' && adminCount === 1) {
                return fail(400, { error: 'Organization must have at least one admin' });
            }
        }

        await prisma.userOrganization.update({
            where: { userId_organizationId: { userId: user_id, organizationId: org_id } },
            data: { role }
        });
        return { success: true };
    },

    remove_user: async ({ request, params, locals }) => {
        const org_id = params.org_id;
        const user = locals.user;
        if (!user) return fail(401, { error: 'Unauthorized' });

        // Only ADMIN can remove
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const user_id = formData.get('user_id')?.toString();
        if (!user_id) return fail(400, { error: 'User is required' });

        // Don't allow removing self (prevent lockout)
        if (user_id === user.id) return fail(400, { error: 'You cannot remove yourself' });

        // Don't allow removing the only remaining admin
        const target = await prisma.userOrganization.findUnique({
            where: { userId_organizationId: { userId: user_id, organizationId: org_id } }
        });
        if (target && target.role === 'ADMIN') {
            const adminCount = await prisma.userOrganization.count({
                where: {
                    organizationId: org_id,
                    role: 'ADMIN'
                }
            });
            if (adminCount === 1) {
                return fail(400, { error: 'Organization must have at least one admin' });
            }
        }

        await prisma.userOrganization.delete({
            where: { userId_organizationId: { userId: user_id, organizationId: org_id } }
        });
        return { success: true };
    }
};
