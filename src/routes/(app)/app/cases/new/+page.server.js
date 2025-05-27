import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  const org = locals.org;
  const accounts = await prisma.account.findMany(
    {
      where: { organizationId: org.id },
      select: { id: true, name: true }
    }
  );
  const users = await prisma.userOrganization.findMany({
    where: { organizationId: org.id },
    select: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  
  return { accounts, users };
}

export const actions = {
  create: async ({ request, locals }) => {
    const org = locals.org;
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

    // check if the ownerId is valid and related to the organization
    const isValidOwner = await prisma.userOrganization.findFirst({
      where: {
        userId: ownerId,
        organizationId: org.id
      }
    });
    if (!isValidOwner) {
      return fail(400, { error: 'Invalid owner ID.' });
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
  }
};
