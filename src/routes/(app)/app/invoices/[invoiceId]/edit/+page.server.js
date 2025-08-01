import { error, fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
  if (!locals.user || !locals.org) {
    throw redirect(302, '/login');
  }

  const invoice = await prisma.quote.findFirst({
    where: {
      id: params.invoiceId,
      organizationId: locals.org.id
    },
    include: {
      account: {
        select: {
          id: true,
          name: true
        }
      },
      lineItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        },
        orderBy: {
          id: 'asc'
        }
      }
    }
  });

  if (!invoice) {
    throw error(404, 'Invoice not found');
  }

  // Get accounts for the dropdown
  const accounts = await prisma.account.findMany({
    where: {
      organizationId: locals.org.id,
      isActive: true,
      isDeleted: false
    },
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return {
    invoice,
    accounts
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, params, locals }) => {
    if (!locals.user || !locals.org) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    
    const accountId = String(formData.get('account_id') || '');
    const invoiceDate = String(formData.get('invoice_date') || '');
    const dueDate = String(formData.get('due_date') || '');
    const status = String(formData.get('status') || 'DRAFT');
    const notes = String(formData.get('notes') || '');

    // Validation
    if (!accountId || !invoiceDate || !dueDate) {
      return fail(400, { 
        error: 'Account, invoice date, and due date are required' 
      });
    }

    try {
      const invoice = await prisma.quote.findFirst({
        where: {
          id: params.invoiceId,
          organizationId: locals.org.id
        }
      });

      if (!invoice) {
        return fail(404, { error: 'Invoice not found' });
      }

      // Convert status for Quote model
      const quoteStatus = status === 'DRAFT' ? 'DRAFT' : 
                         status === 'SENT' ? 'PRESENTED' : 
                         status === 'PAID' ? 'ACCEPTED' : 'DRAFT';

      await prisma.quote.update({
        where: {
          id: params.invoiceId
        },
        data: {
          accountId,
          status: quoteStatus,
          description: notes,
          expirationDate: new Date(dueDate),
          updatedAt: new Date()
        }
      });

      throw redirect(303, `/app/invoices/${params.invoiceId}`);
    } catch (err) {
      if (err instanceof Response) throw err; // Re-throw redirects
      
      console.error('Error updating invoice:', err);
      return fail(500, { 
        error: 'Failed to update invoice. Please try again.' 
      });
    }
  }
};
