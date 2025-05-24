import prisma from '$lib/prisma.js';

export async function load({ locals }) {
  const user = locals.user; // Ensure user is used if needed for filtering or logging
  const org = locals.org;

  const tasks = await prisma.task.findMany({
    where: {
      organizationId: org.id
    },
    include: {
      owner: {
        select: { name: true, id: true } // Select only necessary fields from owner
      },
      account: {
        select: { name: true, id: true } // Select only necessary fields from account
      }
    },
    orderBy: {
      createdAt: 'desc' // Optional: order tasks, e.g., by creation date
    }
  });
  return { tasks };
}