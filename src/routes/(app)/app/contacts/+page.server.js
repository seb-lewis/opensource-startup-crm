import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, locals }) {
    try {
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const search = url.searchParams.get('search') || '';
        const ownerId = url.searchParams.get('owner') || '';
        
        const skip = (page - 1) * limit;
        
        // Build where clause
        const where = {
            organizationId: locals.user?.organizationId, // Assuming user context
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                    { title: { contains: search, mode: 'insensitive' } },
                    { department: { contains: search, mode: 'insensitive' } }
                ]
            }),
            ...(ownerId && { ownerId })
        };

        // Fetch contacts with owner info
        const [contacts, totalCount, owners] = await Promise.all([
            prisma.contact.findMany({
                where,
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    relatedAccounts: {
                        include: {
                            account: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            tasks: true,
                            events: true,
                            opportunities: true,
                            cases: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.contact.count({ where }),
            prisma.user.findMany({
                where: { organizationId: locals.user?.organizationId },
                select: {
                    id: true,
                    name: true,
                    email: true
                },
                orderBy: { name: 'asc' }
            })
        ]);

        return {
            contacts,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            limit,
            search,
            ownerId,
            owners
        };
    } catch (err) {
        console.error('Error loading contacts:', err);
        throw error(500, 'Failed to load contacts');
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    delete: async ({ request, locals }) => {
        try {
            const data = await request.formData();
            const contactId = data.get('contactId');

            if (!contactId) {
                throw error(400, 'Contact ID is required');
            }

            await prisma.contact.delete({
                where: {
                    id: contactId,
                    organizationId: locals.user?.organizationId
                }
            });

            return { success: true };
        } catch (err) {
            console.error('Error deleting contact:', err);
            throw error(500, 'Failed to delete contact');
        }
    }
};