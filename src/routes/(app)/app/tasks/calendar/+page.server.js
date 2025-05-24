import prisma from '$lib/prisma.js';

export async function load({ locals }) {
  const user = locals.user;
  const org = locals.org;

  // Fetch classic CRM tasks
  const tasks = await prisma.task.findMany({
    where: {
      ownerId: user.id,
      organizationId: org.id,
      dueDate: { not: null }
    },
    select: {
      id: true,
      subject: true,
      description: true,
      dueDate: true,
      status: true,
      priority: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { dueDate: 'asc' }
  });

  return { tasks };
}
