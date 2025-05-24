// import prisma from '$lib/prisma.js';
// import { json } from '@sveltejs/kit';

// // Returns users related to the board's organization
// export async function GET({ params }) {
//   const { boardId } = params;
//   // Find the board and its organization
//   const board = await prisma.board.findUnique({
//     where: { id: boardId },
//     include: { organization: true }
//   });
//   if (!board) return json([], { status: 404 });
//   // Get users in the same organization
//   const users = await prisma.user.findMany({
//     where: { organizations: { some: { organizationId: board.organizationId } } },
//     select: { id: true, name: true, email: true }
//   });
//   return json(users);
// }
