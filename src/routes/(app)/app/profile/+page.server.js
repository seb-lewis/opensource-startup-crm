import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { validatePhoneNumber, formatPhoneForStorage } from '$lib/utils/phone.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(307, '/login');
    }

    // Get user with their organization memberships
    const user = await prisma.user.findUnique({
        where: {
            id: locals.user.id
        },
        include: {
            organizations: {
                include: {
                    organization: true
                }
            }
        }
    });

    if (!user) {
        throw redirect(307, '/login');
    }

    return {
        user: {
            id: user.id,
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            profilePhoto: user.profilePhoto,
            phone: user.phone,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            organizations: user.organizations
        }
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    updateProfile: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(307, '/login');
        }

        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const phone = formData.get('phone')?.toString();

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return fail(400, {
                error: 'Name is required',
                data: { name, phone }
            });
        }

        if (name.trim().length < 2) {
            return fail(400, {
                error: 'Name must be at least 2 characters long',
                data: { name, phone }
            });
        }

        // Validate phone if provided
        let formattedPhone = null;
        if (phone && phone.trim().length > 0) {
            const phoneValidation = validatePhoneNumber(phone.trim());
            if (!phoneValidation.isValid) {
                return fail(400, {
                    error: phoneValidation.error || 'Please enter a valid phone number',
                    data: { name, phone }
                });
            }
            formattedPhone = formatPhoneForStorage(phone.trim());
        }

        try {
            await prisma.user.update({
                where: {
                    id: locals.user.id
                },
                data: {
                    name: name.trim(),
                    phone: formattedPhone,
                    updatedAt: new Date()
                }
            });

            return {
                success: true,
                message: 'Profile updated successfully'
            };
        } catch (error) {
            console.error('Error updating profile:', error);
            return fail(500, {
                error: 'Failed to update profile. Please try again.',
                data: { name, phone }
            });
        }
    }
};