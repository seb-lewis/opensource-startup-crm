import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
  const user = locals.user;
  const org = locals.org;

  const task = await prisma.task.findUnique({
    where: {
      id: params.task_id,
      organizationId: org.id
    }
  });

  if (!task) {
    throw redirect(303, '/app/tasks'); // Or a 404 page
  }

  // Format dueDate for input[type=date]
  if (task.dueDate) {
    task.dueDate = new Date(task.dueDate).toISOString().split('T')[0];
  }

  const users = await prisma.user.findMany({
    where: {
      organizations: {
        some: {
          organizationId: org.id
        }
      }
    },
    select: { id: true, name: true }
  });

  const accounts = await prisma.account.findMany({
    where: { organizationId: org.id },
    select: { id: true, name: true }
  });

  return {
    task,
    users,
    accounts
  };
};

/** @type {import('./$types').Actions} */
export const actions = {
  update: async ({ request, params, locals }) => {
    const formData = await request.formData();
    const org = locals.org;
    const user = locals.user;

    const subject = formData.get('subject');
    const description = formData.get('description');
    const status = formData.get('status');
    const priority = formData.get('priority');
    let dueDate = formData.get('dueDate');
    const ownerId = formData.get('ownerId');
    let accountId = formData.get('accountId');

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return fail(400, { fieldError: ['subject', 'Subject is required.'] });
    }
    if (!ownerId || typeof ownerId !== 'string') {
      return fail(400, { fieldError: ['ownerId', 'Owner is required.'] });
    }

    // check if the task is related to org.id and the user is related to the org
    const taskToUpdate = await prisma.task.findUnique({
      where: {
        id: params.task_id,
        organizationId: org.id
      }
    });

    if (!taskToUpdate) {
      return fail(404, { message: 'Task not found or you do not have permission to edit it.' });
    }

    const userExistsInOrg = await prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: org.id
        }
      }
    });
    if (!userExistsInOrg) {
      return fail(400, { fieldError: ['ownerId', 'User is not part of this organization.'] });
    }


    // Convert empty string or null accountId to null for Prisma
    accountId = accountId === '' || accountId === 'null' ? null : accountId;

    // Convert dueDate to ISOString or null if empty
    dueDate = dueDate ? new Date(dueDate).toISOString() : null;

    try {
      await prisma.task.update({
        where: {
          id: params.task_id,
          organizationId: org.id
        },
        data: {
          subject: subject.trim(),
          description: description ? description.toString().trim() : null,
          status: status ? status.toString() : 'Not Started',
          priority: priority ? priority.toString() : 'Normal',
          dueDate,
          ownerId: ownerId.toString(),
          accountId: accountId ? accountId.toString() : null,
        }
      });
    } catch (error) {
      console.error('Error updating task:', error);
      return fail(500, { message: 'Failed to update task. Please try again.' });
    }

    throw redirect(303, `/app/tasks/${params.task_id}`);
  }
};