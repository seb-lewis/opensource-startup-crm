import { error, fail } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url, locals }) {
  const user = locals.user;
  const org = locals.org;
  try {
    const accountId = params.accountId;

    // Fetch account details
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
        organizationId: org.id
      }
    });

    if (!account) {
      throw error(404, 'Account not found');
    }

    // Fetch account contacts
    const contactRelationships = await prisma.accountContactRelationship.findMany({
      where: {
        accountId: accountId
      },
      include: {
        contact: true
      }
    });

    // Format contacts with isPrimary flag
    const contacts = contactRelationships.map(rel => ({
      ...rel.contact,
      isPrimary: rel.isPrimary,
      role: rel.role
    }));

    // Fetch account opportunities
    const opportunities = await prisma.opportunity.findMany({
      where: {
        accountId: accountId
      }
    });

    // Fetch account comments/notes
    const comments = await prisma.comment.findMany({
      where: {
        accountId: accountId
      },
      include: {
        author: {
          select: {
            name: true,
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    // If ?commentsOnly=1, return just comments as JSON
    if (url.searchParams.get('commentsOnly') === '1') {
      return new Response(JSON.stringify({ comments }), { headers: { 'Content-Type': 'application/json' } });
    }

    // Fetch account quotes
    const quotes = await prisma.quote.findMany({
      where: {
        accountId: accountId
      }
    });

    // Fetch account tasks
    const tasks = await prisma.task.findMany({
      where: {
        accountId: accountId
      },
      include: {
        owner: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });

    // Fetch account cases
    const cases = await prisma.case.findMany({
      where: {
        accountId: accountId
      }
    });

    // Load users in the same organization for assignment
    const users = await prisma.user.findMany({
      where: {
        organizations: {
          some: { organizationId: account.organizationId }
        }
      },
      select: { id: true, name: true, email: true }
    });

    return {
      account,
      contacts,
      opportunities,
      comments,
      quotes,
      tasks,
      cases,
      users,
      meta: {
        title: account.name,
        description: `Account details for ${account.name}`
      }
    };
  } catch (err) {
    console.error('Error loading account data:', err);
    throw error(err.status || 500, err.message || 'Error loading account data');
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  closeAccount: async ({ request, locals, params }) => {
    try {
      const user = locals.user;
      const org = locals.org;

      const { accountId } = params;
      const formData = await request.formData();
      const closureReason = formData.get('closureReason')?.toString();

      if (!closureReason) {
        return fail(400, { success: false, message: 'Please provide a reason for closing this account' });
      }

      // Fetch the account to verify it exists
      const account = await prisma.account.findUnique({
        where: { id: accountId, organizationId: org.id },
        select: {
          id: true,
          closedAt: true,
          organizationId: true,
          ownerId: true
        }
      });

      if (!account) {
        return fail(404, { success: false, message: 'Account not found' });
      }

      if (account.closedAt) {
        return fail(400, { success: false, message: 'Account is already closed' });
      }

      // Check user permissions (must be the owner, a sales manager, or admin)
      const userOrg = await prisma.userOrganization.findFirst({
        where: {
          userId: user.id,
          organizationId: account.organizationId
        }
      });

      const hasPermission =
        user.id === account.ownerId ||
        userOrg?.role === 'ADMIN';

      if (!hasPermission) {
        return fail(403, { success: false, message: 'Permission denied. Only account owners, sales managers, or admins can close accounts.' });
      }

      // Update the account to mark it as closed
      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: {
          closedAt: new Date(),
          isActive: false,
          closureReason
        }
      });

      // Log this action in the audit log
      await prisma.auditLog.create({
        data: {
          action: 'UPDATE',
          entityType: 'Account',
          entityId: accountId,
          description: `Account closed: ${closureReason}`,
          oldValues: { closedAt: null, closureReason: null },
          newValues: { closedAt: updatedAccount.closedAt, closureReason },
          userId: user.id,
          organizationId: account.organizationId,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error closing account:', error);
      return fail(500, { success: false, message: 'An unexpected error occurred' });
    }
  },

  reopenAccount: async ({ locals, params }) => {
    try {
      const user = locals.user;
      const org = locals.org;

      const { accountId } = params;

      // Fetch the account to verify it exists
      const account = await prisma.account.findUnique({
        where: { id: accountId, organizationId: org.id },
        select: {
          id: true,
          closedAt: true,
          closureReason: true,
          organizationId: true,
          ownerId: true
        }
      });

      if (!account) {
        return fail(404, { success: false, message: 'Account not found' });
      }

      if (!account.closedAt) {
        return fail(400, { success: false, message: 'Account is not closed' });
      }

      // Check user permissions (must be the owner, a sales manager, or admin)
      const userOrg = await prisma.userOrganization.findFirst({
        where: {
          userId: user.id,
          organizationId: account.organizationId
        }
      });

      const hasPermission =
        user.id === account.ownerId ||
        userOrg?.role === 'ADMIN';

      if (!hasPermission) {
        return fail(403, { success: false, message: 'Permission denied. Only account owners, sales managers, or admins can reopen accounts.' });
      }

      // Save the old values for the audit log
      const oldValues = {
        closedAt: account.closedAt,
        closureReason: account.closureReason
      };

      // Update the account to mark it as reopened
      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: {
          closedAt: null,
          isActive: true,
          closureReason: null
        }
      });

      // Log this action in the audit log
      await prisma.auditLog.create({
        data: {
          action: 'UPDATE',
          entityType: 'Account',
          entityId: accountId,
          description: `Account reopened`,
          oldValues: oldValues,
          newValues: { closedAt: null, closureReason: null },
          userId: user.id,
          organizationId: account.organizationId,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error reopening account:', error);
      return fail(500, { success: false, message: 'An unexpected error occurred' });
    }
  },

  comment: async ({ request, locals, params }) => {
    const user = locals.user;
    const org = locals.org;
    // Fallback: fetch account to get organizationId
    const account = await prisma.account.findUnique({
      where: { id: params.accountId, organizationId: org.id },
      select: { organizationId: true, ownerId: true }
    });
    if (!account) {
      return fail(404, { error: 'Account not found.' });
    }
    // Use the account owner as the author if no user is available (for demo/dev only)
    const authorId = account.ownerId;
    const organizationId = account.organizationId;
    const form = await request.formData();
    const body = form.get('body')?.toString().trim();
    if (!body) return fail(400, { error: 'Comment cannot be empty.' });
    await prisma.comment.create({
      data: {
        body,
        authorId,
        organizationId,
        accountId: params.accountId
      }
    });
    return { success: true };
  }
};
