import prisma from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ params }) {
  const caseId = params.caseId;
  const caseItem = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      owner: { select: { id: true, name: true } },
      account: { select: { id: true, name: true } },
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  if (!caseItem) throw error(404, 'Case not found');
  return { caseItem };
}

export const actions = {
  comment: async ({ request, params, locals }) => {
    const form = await request.formData();
    const body = form.get('body')?.toString().trim();
    if (!body) return fail(400, { error: 'Comment cannot be empty.' });
    await prisma.comment.create({
      data: {
        body,
        authorId: locals.user.id,
        organizationId: locals.org.id,
        caseId: params.caseId
      }
    });
    return { success: true };
  },
  delete: async ({ params }) => {
    await prisma.case.delete({ where: { id: params.caseId } });
    throw redirect(303, '/app/cases');
  }
};
