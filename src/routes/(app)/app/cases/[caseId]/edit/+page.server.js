import prisma from '$lib/prisma';
import { fail, redirect, error } from '@sveltejs/kit';

export async function load({ params }) {
  const caseId = params.caseId;
  const caseItem = await prisma.case.findUnique({
    where: { id: caseId },
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
  update: async ({ request, params }) => {
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
