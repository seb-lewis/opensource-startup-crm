import prisma from '$lib/prisma';
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const blog = await prisma.blogPost.findUnique({
        where: {
            id: params.id
        },
        include: {
            contentBlocks: true
        }
    });
    return { blog };
};