// import prisma from '$lib/prisma';

// export async function load({ params, locals }) {
//   const user = locals.user;
//   const org = locals.org;
//   if (!user || !org) return { status: 302, redirect: '/login' };
//   const board = await prisma.board.findUnique({
//     where: { id: params.boardId, organizationId: org.id },
//     select: { id: true, name: true, ownerId: true }
//   });
//   if (!board || board.ownerId !== user.id) return { status: 403 };
//   const columns = await prisma.boardColumn.findMany({
//     where: { boardId: board.id },
//     orderBy: { order: 'asc' },
//     select: {
//       id: true,
//       name: true,
//       order: true,
//       tasks: {
//         orderBy: { order: 'asc' },
//         select: { id: true, title: true, order: true }
//       }
//     }
//   });
//   return { board, columns };
// }

// export const actions = {
//   createTask: async ({ request, params, locals }) => {
//     const user = locals.user;
//     if (!user) return { status: 401 };
//     const form = await request.formData();
//     const title = form.get('title');
//     const columnId = form.get('columnId');
//     if (!title || !columnId) return { status: 400 };
//     const maxOrder = await prisma.boardTask.aggregate({
//       where: { columnId },
//       _max: { order: true }
//     });
//     await prisma.boardTask.create({
//       data: {
//         title,
//         columnId,
//         order: (maxOrder._max.order ?? 0) + 1
//       }
//     });
//     return { success: true };
//   },
//   createColumn: async ({ request, params, locals }) => {
//     const user = locals.user;
//     if (!user) return { status: 401 };
//     const form = await request.formData();
//     const columnName = form.get('columnName');
//     if (!columnName) return { status: 400 };
//     const maxOrder = await prisma.boardColumn.aggregate({
//       where: { boardId: params.boardId },
//       _max: { order: true }
//     });
//     await prisma.boardColumn.create({
//       data: {
//         name: columnName,
//         boardId: params.boardId,
//         order: (maxOrder._max.order ?? 0) + 1
//       }
//     });
//     return { success: true };
//   },
//   moveTask: async ({ request, params, locals }) => {
//     const user = locals.user;
//     if (!user) return { status: 401 };
//     const { columnId, orderedTaskIds } = await request.json();
//     if (!columnId || !Array.isArray(orderedTaskIds)) return { status: 400 };
//     // Update all tasks in the column to match the new order
//     await Promise.all(
//       orderedTaskIds.map((taskId, idx) =>
//         prisma.boardTask.update({
//           where: { id: taskId },
//           data: { columnId, order: idx + 1 }
//         })
//       )
//     );
//     return { success: true };
//   }
// };
