import prisma from '$lib/prisma.js';

export async function load({ locals }) {
  const user = locals.user;
  const org = locals.org;
  if (!user || !org) return { status: 302, redirect: '/login' };

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

  // Fetch Kanban board tasks
  const boardTasks = await prisma.boardTask.findMany({
    where: {
      assigneeId: user.id,
      dueDate: { not: null },
      column: { board: { organizationId: org.id } }
    },
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      completed: true,
      createdAt: true,
      updatedAt: true,
      column: { select: { boardId: true } }
    },
    orderBy: { dueDate: 'asc' }
  });

  return { tasks, boardTasks };
}
