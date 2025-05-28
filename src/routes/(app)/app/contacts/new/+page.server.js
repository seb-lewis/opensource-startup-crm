import { redirect, fail } from '@sveltejs/kit';
import  prisma  from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
    // Ensure user is authenticated
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    // Get user's organizations for the dropdown
    const userOrganizations = await prisma.userOrganization.findMany({
        where: { userId: locals.user.id },
        include: { organization: true }
    });

    // Get accounts for the account dropdown (if no specific accountId is provided)
    const accountId = url.searchParams.get('accountId');
    let accounts = [];
    
    if (!accountId) {
        // Load accounts from user's organizations
        const organizationIds = userOrganizations.map(uo => uo.organizationId);
        accounts = await prisma.account.findMany({
            where: {
                organizationId: { in: organizationIds },
                isDeleted: false
            },
            select: {
                id: true,
                name: true,
                organizationId: true
            },
            orderBy: { name: 'asc' }
        });
    } else {
        // Load the specific account to validate access and show in UI
        const account = await prisma.account.findFirst({
            where: {
                id: accountId,
                organizationId: { in: userOrganizations.map(uo => uo.organizationId) },
                isDeleted: false
            },
            select: {
                id: true,
                name: true,
                organizationId: true
            }
        });
        
        if (account) {
            accounts = [account];
        }
    }

    return {
        organizations: userOrganizations.map(uo => uo.organization),
        accounts
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request, locals, url }) => {
        if (!locals.user) {
            throw redirect(302, '/auth/login');
        }

        const data = await request.formData();
        const firstName = data.get('firstName')?.toString().trim();
        const lastName = data.get('lastName')?.toString().trim();
        const email = data.get('email')?.toString().trim();
        const phone = data.get('phone')?.toString().trim();
        const title = data.get('title')?.toString().trim();
        const department = data.get('department')?.toString().trim();
        const street = data.get('street')?.toString().trim();
        const city = data.get('city')?.toString().trim();
        const state = data.get('state')?.toString().trim();
        const postalCode = data.get('postalCode')?.toString().trim();
        const country = data.get('country')?.toString().trim();
        const description = data.get('description')?.toString().trim();
        const organizationId = data.get('organizationId')?.toString();
        const accountId = data.get('accountId')?.toString();
        const role = data.get('role')?.toString().trim();
        const isPrimary = data.get('isPrimary') === 'on';

        // Validation
        const errors = {};
        
        if (!firstName) errors.firstName = 'First name is required';
        if (!lastName) errors.lastName = 'Last name is required';
        
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, {
                errors,
                values: {
                    firstName, lastName, email, phone, title, department,
                    street, city, state, postalCode, country, description, 
                    organizationId, accountId, role, isPrimary
                }
            });
        }

        try {
            let validatedOrganizationId = organizationId;

            // If accountId is provided, validate it and get its organizationId
            if (accountId) {
                const account = await prisma.account.findFirst({
                    where: {
                        id: accountId,
                        isDeleted: false
                    },
                    include: {
                        organization: {
                            include: {
                                users: {
                                    where: { userId: locals.user.id }
                                }
                            }
                        }
                    }
                });

                if (!account) {
                    return fail(404, {
                        errors: { accountId: 'Account not found' },
                        values: {
                            firstName, lastName, email, phone, title, department,
                            street, city, state, postalCode, country, description, 
                            organizationId, accountId, role, isPrimary
                        }
                    });
                }

                if (account.organization.users.length === 0) {
                    return fail(403, {
                        errors: { accountId: 'You do not have access to this account' },
                        values: {
                            firstName, lastName, email, phone, title, department,
                            street, city, state, postalCode, country, description, 
                            organizationId, accountId, role, isPrimary
                        }
                    });
                }

                validatedOrganizationId = account.organizationId;
            }

            // Verify user has access to the organization
            if (validatedOrganizationId) {
                const userOrg = await prisma.userOrganization.findFirst({
                    where: {
                        userId: locals.user.id,
                        organizationId: validatedOrganizationId
                    }
                });

                if (!userOrg) {
                    return fail(403, {
                        errors: { organizationId: 'You do not have access to this organization' },
                        values: {
                            firstName, lastName, email, phone, title, department,
                            street, city, state, postalCode, country, description, 
                            organizationId, accountId, role, isPrimary
                        }
                    });
                }

                // Check for duplicate email within the organization
                if (email) {
                    const existingContact = await prisma.contact.findFirst({
                        where: {
                            email: email,
                            organizationId: validatedOrganizationId
                        }
                    });

                    if (existingContact) {
                        return fail(400, {
                            errors: { email: 'A contact with this email already exists in this organization' },
                            values: {
                                firstName, lastName, email, phone, title, department,
                                street, city, state, postalCode, country, description, 
                                organizationId, accountId, role, isPrimary
                            }
                        });
                    }
                }
            }

            // Create the contact
            const contact = await prisma.contact.create({
                data: {
                    firstName,
                    lastName,
                    email: email || null,
                    phone: phone || null,
                    title: title || null,
                    department: department || null,
                    street: street || null,
                    city: city || null,
                    state: state || null,
                    postalCode: postalCode || null,
                    country: country || null,
                    description: description || null,
                    ownerId: locals.user.id,
                    organizationId: validatedOrganizationId || null
                }
            });

            // Create account-contact relationship if accountId is provided
            if (accountId) {
                await prisma.accountContactRelationship.create({
                    data: {
                        accountId: accountId,
                        contactId: contact.id,
                        role: role || null,
                        isPrimary: isPrimary
                    }
                });
            }

            // Create audit log
            await prisma.auditLog.create({
                data: {
                    action: 'CREATE',
                    entityType: 'Contact',
                    entityId: contact.id,
                    description: `Created contact: ${firstName} ${lastName}${accountId ? ` and linked to account` : ''}`,
                    newValues: { contact, accountRelationship: accountId ? { accountId, role, isPrimary } : null },
                    userId: locals.user.id,
                    organizationId: validatedOrganizationId || null
                }
            });

        } catch (error) {
            console.error('Error creating contact:', error);
            return fail(500, {
                errors: { general: 'An error occurred while creating the contact. Please try again.' },
                values: {
                    firstName, lastName, email, phone, title, department,
                    street, city, state, postalCode, country, description, 
                    organizationId, accountId, role, isPrimary
                }
            });
        }

        // Redirect back to account if accountId was provided, otherwise to contacts list
        const redirectUrl = accountId ? `/app/accounts/${accountId}` : '/app/contacts';
        throw redirect(302, redirectUrl);
    }
};