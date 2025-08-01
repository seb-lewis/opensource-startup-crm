import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  if (!locals.user || !locals.org) {
    throw redirect(302, '/login');
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
    accounts
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user || !locals.org) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    
    const invoiceNumber = String(formData.get('invoice_number') || '');
    const accountId = String(formData.get('account_id') || '');
    const invoiceDate = String(formData.get('invoice_date') || '');
    const dueDate = String(formData.get('due_date') || '');
    const status = String(formData.get('status') || 'DRAFT');
    const notes = String(formData.get('notes') || '');

    // Validation
    if (!invoiceNumber || !accountId || !invoiceDate || !dueDate) {
      return fail(400, { 
        error: 'Invoice number, account, invoice date, and due date are required' 
      });
    }

    try {
      // For now, we'll create a Quote since that's what exists in the schema
      // In a real implementation, you might want to add an Invoice model
      // or extend the Quote model to handle invoices
      
      // Generate unique quote number (since we're using Quote model)
      const quoteNumber = `INV-${Date.now()}`;
      
      const quote = await prisma.quote.create({
        data: {
          quoteNumber,
          name: `Invoice ${invoiceNumber}`,
          status: status === 'DRAFT' ? 'DRAFT' : 
                 status === 'SENT' ? 'PRESENTED' : 
                 status === 'PAID' ? 'ACCEPTED' : 'DRAFT',
          description: notes,
          expirationDate: new Date(dueDate),
          subtotal: 0, // Will be updated when line items are added
          grandTotal: 0,
          preparedById: locals.user.id,
          accountId: accountId,
          organizationId: locals.org.id
        }
      });

      throw redirect(303, `/app/invoices/${quote.id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      return fail(500, { 
        error: 'Failed to create invoice. Please try again.' 
      });
    }
  }
};
