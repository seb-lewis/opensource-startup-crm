import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
    const { task_id } = params;
    const org = locals.org;
    const user = locals.user;

    // check if the task is related to org.id and the user is related to the org
    const taskToUpdate = await prisma.task.findUnique({
      where: {
        id: params.task_id,
        organizationId: org.id
      }
    });

    if (!taskToUpdate) {
      return fail(404, { message: 'Task not found or you do not have permission to view it.' });
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



    const task = await prisma.task.findUniqueOrThrow({
        where: { id: task_id },
        include: {
            owner: {
                select: { id: true, name: true, profilePhoto: true }
            },
            account: {
                select: { id: true, name: true }
            },
            // You can include other relations like contact, lead, opportunity, case if needed
            // contact: { select: { id: true, firstName: true, lastName: true } },
            comments: {
                include: {
                    author: {
                        select: { id: true, name: true, profilePhoto: true }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    const users = await prisma.user.findMany({
        select: { id: true, name: true, profilePhoto: true } // Added profilePhoto for comment author
    });

    const accounts = await prisma.account.findMany({
        select: { id: true, name: true }
    });

    // Format dueDate for input[type=date] if it exists, otherwise it might cause issues
    // Also ensure it's in YYYY-MM-DD format for display if not using toLocaleDateString()
    if (task.dueDate) {
        // Ensure it's a string in 'YYYY-MM-DD' format for the input field
        task.dueDate = new Date(task.dueDate).toISOString().split('T')[0];
    }
    
    // Assuming locals.user is populated by your auth setup
    const loggedInUser = locals.user ? {
        id: locals.user.id,
        name: locals.user.name,
        profilePhoto: locals.user.profilePhoto
        // organizationId: locals.user.organizationId // If available and needed directly
    } : null;

    console.log('Loaded task:', task);
    return {
        task,
        users,
        accounts,
        loggedInUser
    };
};

/** @type {import('./$types').Actions} */
export const actions = {
    addComment: async ({ request, params, locals }) => {
        const org = locals.org;

        const formData = await request.formData();
        const commentBody = formData.get('commentBody')?.toString();
        const { task_id } = params;

        const userId = locals.user.id;



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
          userId: userId,
          organizationId: org.id
        }
      }
    });
    if (!userExistsInOrg) {
      return fail(400, { fieldError: ['ownerId', 'User is not part of this organization.'] });
    }

    
        if (!commentBody || commentBody.trim() === '') {
            return fail(400, { error: true, message: 'Comment body cannot be empty.', commentBody });
        }

        try {
            const task = await prisma.task.findUnique({
                where: { id: task_id },
                select: { organizationId: true }
            });

            if (!task) {
                return fail(404, { error: true, message: 'Task not found.' });
            }
            
            if (!task.organizationId) {
                // This case should ideally not happen if tasks always have an organizationId
                return fail(500, { error: true, message: 'Task is not associated with an organization.' });
            }

            await prisma.comment.create({
                data: {
                    body: commentBody,
                    authorId: userId,
                    taskId: task_id,
                    organizationId: task.organizationId, // Use task's organizationId
                }
            });
            // No need to return the comment, page will reload data.
            // SvelteKit will invalidate the page data, causing `load` to re-run.
            // The form will be reset by default with `enhance`.
            return { success: true, message: 'Comment added successfully.' };
        } catch (error) {
            console.error('Error adding comment:', error);
            return fail(500, { error: true, message: 'Failed to add comment.' });
        }
    }
};