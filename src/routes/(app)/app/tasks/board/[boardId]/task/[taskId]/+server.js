// import prisma from '$lib/prisma';

// export async function GET({ params, locals }) {
//   const user = locals.user;
//   const org = locals.org;
//   if (!user || !org) return new Response('Unauthorized', { status: 401 });
//   const task = await prisma.boardTask.findUnique({
//     where: { id: params.taskId },
//     include: {
//       assignee: { select: { id: true, name: true } },
//       column: { include: { board: true } }
//     }
//   });
//   if (!task || task.column.board.ownerId !== user.id || task.column.board.organizationId !== org.id) return new Response('Forbidden', { status: 403 });
//   const comments = await prisma.boardTaskActivity.findMany({
//     where: { taskId: params.taskId, type: 'comment' },
//     orderBy: { createdAt: 'asc' },
//     include: { author: { select: { id: true, name: true } } }
//   });
//   return new Response(JSON.stringify({ task, comments }), { headers: { 'Content-Type': 'application/json' } });
// }
