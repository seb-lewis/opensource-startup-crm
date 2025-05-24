import { fail, redirect, error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ url, locals }) {
  const org = locals.org;
  const user = locals.user;
  // Filters from query params
  const status = url.searchParams.get('status') || undefined;
  const assigned = url.searchParams.get('assigned') || undefined;
  const account = url.searchParams.get('account') || undefined;

  // Build where clause
  const where = {};
  if (status) where.status = status;
  if (assigned) where.owner = { name: assigned };
  if (account) where.account = { name: account };

  // Fetch all possible filter options
  const [allUsers, allAccounts] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true } }),
    prisma.account.findMany({ select: { id: true, name: true } })
  ]);

  // Optionally, define all possible statuses
  const statusOptions = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

  const cases = await prisma.case.findMany({
    where: { organizationId: org.id },
    include: {
      owner: { select: { id: true, name: true } },
      account: { select: { id: true, name: true } },
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return { cases, allUsers, allAccounts, statusOptions };
}

export const actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const subject = form.get('title')?.toString().trim();
    const description = form.get('description')?.toString().trim();
    const accountId = form.get('accountId')?.toString();
    const dueDate = form.get('dueDate') ? new Date(form.get('dueDate')) : null;
    const priority = form.get('priority')?.toString() || 'Medium';
    const ownerId = form.get('assignedId')?.toString();
    if (!subject || !accountId || !ownerId) {
      return fail(400, { error: 'Missing required fields.' });
    }
    const newCase = await prisma.case.create({
      data: {
        subject,
        description,
        accountId,
        dueDate,
        priority,
        ownerId,
        organizationId: locals.org.id
      }
    });
    throw redirect(303, `/app/cases/${newCase.id}`);
  },
  update: async ({ request, params, locals }) => {
    const form = await request.formData();
    const subject = form.get('title')?.toString().trim();
    const description = form.get('description')?.toString().trim();
    const accountId = form.get('accountId')?.toString();
    const dueDate = form.get('dueDate') ? new Date(form.get('dueDate')) : null;
    const priority = form.get('priority')?.toString() || 'Medium';
    const ownerId = form.get('assignedId')?.toString();
    if (!subject || !accountId || !ownerId) {
      return fail(400, { error: 'Missing required fields.' });
    }
    await prisma.case.update({
      where: { id: params.caseId },
      data: {
        subject,
        description,
        accountId,
        dueDate,
        priority,
        ownerId
      }
    });
    throw redirect(303, `/app/cases/${params.caseId}`);
  },
  delete: async ({ params }) => {
    await prisma.case.delete({ where: { id: params.caseId } });
    throw redirect(303, '/app/cases');
  },
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
  }
};
