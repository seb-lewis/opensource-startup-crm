// import prisma from '$lib/prisma.js';
// import { json } from '@sveltejs/kit';

// export async function PATCH({ params, request }) {
//   const { boardId, taskId } = params;
//   const { assigneeId } = await request.json();
//   if (!assigneeId) {
//     // Unassign
//     const updated = await prisma.boardTask.update({
//       where: { id: taskId },
//       data: { assigneeId: null }
//     });
//     return json({ success: true, task: updated });
//   }
//   // Check user is in org via board
//   const board = await prisma.board.findUnique({
//     where: { id: boardId },
//     include: { organization: true }
//   });
//   if (!board) return json({ error: 'Board not found' }, { status: 404 });
//   const user = await prisma.user.findFirst({
//     where: { id: assigneeId, organizations: { some: { organizationId: board.organizationId } } }
//   });
//   if (!user) return json({ error: 'User not in organization' }, { status: 400 });
//   const updated = await prisma.boardTask.update({
//     where: { id: taskId },
//     data: { assigneeId }
//   });
//   return json({ success: true, task: updated });
// }
