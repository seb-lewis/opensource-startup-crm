import prisma from '$lib/prisma';
/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const contacts = await prisma.contactSubmission.findMany();
    return { contacts };
};