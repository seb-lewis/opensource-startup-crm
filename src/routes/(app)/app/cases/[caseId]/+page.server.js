import prisma from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
  const org = locals.org;
  const caseId = params.caseId;
  const caseItem = await prisma.case.findUnique({
    where: { id: caseId, organizationId: org.id },
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
    const org = locals.org;

    // check if the case is related to the organization
    const caseExists = await prisma.case.findFirst({
      where: { id: params.caseId, organizationId: org.id }
    });
    if (!caseExists) {
      return fail(404, { error: 'Case not found or does not belong to this organization.' });
    }
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
