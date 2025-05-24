import prisma from '$lib/prisma';

export async function load({ locals }) {
  const user = locals.user;
  const org = locals.org;
  const boards = await prisma.board.findMany({
    where: { ownerId: user.id, organizationId: org.id },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' }
  });
  return { boards };
}

export const actions = {
  create: async ({ request, locals }) => {
    const user = locals.user;
    const org = locals.org;
    const form = await request.formData();
    const name = form.get('name')?.toString();
    if (!name) return { status: 400 };
    const board = await prisma.board.create({
      data: {
        name,
        ownerId: user.id,
        organizationId: org.id
      }
    });
    const defaultColumns = ["To Do", "In Progress", "Done"];
    await prisma.$transaction(
      defaultColumns.map((col, idx) =>
        prisma.boardColumn.create({
          data: {
            name: col,
            boardId: board.id,
            order: idx + 1
          }
        })
      )
    );
    return { success: true };
  }
};
