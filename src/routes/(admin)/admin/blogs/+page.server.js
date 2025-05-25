import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const blogs = await prisma.blogPost.findMany({
        select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            draft: true
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
    return { blogs };
};