import prisma from '$lib/prisma';
import { fail, redirect, error } from '@sveltejs/kit';

export async function load({ params, locals }) {
  const org = locals.org;
  const caseId = params.caseId;
  const caseItem = await prisma.case.findUnique({
    where: { id: caseId, organizationId: org.id },
    include: {
      owner: { select: { id: true, name: true } },
      account: { select: { id: true, name: true } }
    }
  });
  if (!caseItem) throw error(404, 'Case not found');
  // Fetch all users and accounts for dropdowns
  const [users, accounts] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true } }),
    prisma.account.findMany({ select: { id: true, name: true } })
  ]);
  return { caseItem, users, accounts };
}

export const actions = {
  update: async ({ request, params, locals }) => {
    const org = locals.org;
    const form = await request.formData();
    const subject = form.get('title')?.toString().trim();
    const description = form.get('description')?.toString().trim();
    const accountId = form.get('accountId')?.toString();
    const dueDateRaw = form.get('dueDate');
    const dueDate = dueDateRaw ? new Date(dueDateRaw.toString()) : null;
    const priority = form.get('priority')?.toString() || 'Medium';
    const ownerId = form.get('assignedId')?.toString();
    if (!subject || !accountId || !ownerId) {
      return fail(400, { error: 'Missing required fields.' });
    }
    // Validate case is part of the organization
    const caseExists = await prisma.case.findFirst({
      where: { id: params.caseId, organizationId: org.id }
    });
    if (!caseExists) {
      return fail(404, { error: 'Case not found or does not belong to this organization.' });
    } 
    await prisma.case.update({
      where: { id: params.caseId },
      data: { subject, description, accountId, dueDate, priority, ownerId }
    });
    return { success: true };
  },
  close: async ({ params }) => {
    await prisma.case.update({
      where: { id: params.caseId },
      data: { status: 'CLOSED', closedAt: new Date() }
    });
    throw redirect(303, `/app/cases/${params.caseId}`);
  }
};
