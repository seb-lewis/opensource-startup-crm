import prisma  from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
  const org = locals.org;
  try {
    const accountId = params.accountId;
    
    const account = await prisma.account.findUnique({
      where: { id: accountId, organizationId: org.id },
      select: {
        id: true,
        name: true,
        industry: true,
        phone: true,
        createdAt: true,
        website: true,
        type: true,
        description: true,
        _count: {
          select: {
            opportunities: true,
            relatedContacts: true,
            tasks: true,
            cases: true,
            quotes: true,
            comments: true,
          }
        }
      }
    });

    if (!account) {
      throw error(404, 'Account not found');
    }

    // Get detailed related records for better user information
    const relatedRecords = await prisma.$transaction([
      prisma.opportunity.findMany({
        where: { accountId },
        select: { id: true, name: true, stage: true }
      }),
      prisma.accountContactRelationship.findMany({
        where: { accountId },
        select: { 
          id: true,
          contact: { select: { firstName: true, lastName: true } }
        }
      }),
      prisma.task.findMany({
        where: { accountId },
        select: { id: true, subject: true }
      }),
      prisma.case.findMany({
        where: { accountId },
        select: { id: true, subject: true }
      })
    ]);

    return {
      account,
      relatedRecords: {
        opportunities: relatedRecords[0],
        contacts: relatedRecords[1],
        tasks: relatedRecords[2],
        cases: relatedRecords[3]
      }
    };
  } catch (e) {
    console.error('Error fetching account for delete page:', e);
    throw error(500, 'Failed to load account details');
  }
}

export const actions = {
  default: async ({ params, locals }) => {
    try {
      const accountId = params.accountId;
      const org = locals.org;

      // Check if account exists first
      const account = await prisma.account.findUnique({
        where: { id: accountId, organizationId: org.id },
        include: {
          _count: {
            select: {
              opportunities: true,
              cases: true,
              quotes: true,
              tasks: true,
              relatedContacts: true
            }
          }
        }
      });

      if (!account) {
        return fail(404, { success: false, message: 'Account not found' });
      }

      // Check for related records before attempting deletion
      if (account._count.opportunities > 0) {
        return fail(400, { 
          success: false, 
          message: `Cannot delete account because it has ${account._count.opportunities} related opportunities. Please delete or reassign these opportunities first.`,
          relatedCount: account._count
        });
      }

      // Delete the account - Prisma will cascade delete related records based on schema
      await prisma.account.delete({
        where: { id: accountId }
      });

      // Redirect after successful deletion
      throw redirect(303, '/app/accounts');
    } catch (err) {
      console.error('Error deleting account:', err);
      
      // Handle specific database constraint errors
      if (err.code === 'P2003') {
        // Extract the relation name from the error
        const relationField = err.meta?.field_name || 'related records';
        const relationName = relationField.includes('_') ? 
          relationField.split('_')[0] : relationField;
          
        return fail(400, { 
          success: false, 
          message: `Cannot delete account because it is referenced by ${relationName}. Please remove these relationships first.`,
          constraintError: relationField
        });
      }
      
      // Don't handle redirect errors
      if (err.status === 303) throw err;
      
      return fail(500, { 
        success: false,
        message: 'Failed to delete account. An unexpected error occurred.'
      });
    }
  }
};
