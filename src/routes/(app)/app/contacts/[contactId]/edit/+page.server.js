import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
  const org = locals.org;
  const user = locals.user;

  const contact = await prisma.contact.findUnique({
    where: { id: params.contactId, organizationId: org.id }
  });
  if (!contact) {
    return fail(404, { message: 'Contact not found' });
  }
  // Get related account info
  const accountRel = await prisma.accountContactRelationship.findFirst({
    where: { contactId: params.contactId },
    include: { account: true }
  });
  return {
    contact,
    account: accountRel?.account || null,
    isPrimary: accountRel?.isPrimary || false,
    role: accountRel?.role || ''
  };
}

export const actions = {
  default: async ({ request, params, locals }) => {
    const org = locals.org;
    const user = locals.user;

    const formData = await request.formData();
    const firstName = formData.get('firstName')?.toString().trim();
    const lastName = formData.get('lastName')?.toString().trim();
    const email = formData.get('email')?.toString().trim() || null;
    const phone = formData.get('phone')?.toString().trim() || null;
    const title = formData.get('title')?.toString().trim() || null;
    const description = formData.get('description')?.toString().trim() || null;
    const isPrimary = formData.get('isPrimary') === 'true';
    const role = formData.get('role')?.toString().trim() || null;

    if (!firstName || !lastName) {
      return fail(400, { message: 'First and last name are required.' });
    }


    const contact = await prisma.contact.findUnique({
      where: { id: params.contactId, organizationId: org.id }
    });
    if (!contact) {
      return fail(404, { message: 'Contact not found' });
    }

    // Update contact
    await prisma.contact.update({
      where: { id: params.contactId },
      data: { firstName, lastName, email, phone, title, description }
    });

    // Update AccountContactRelationship if exists
    const accountRel = await prisma.accountContactRelationship.findFirst({
      where: { contactId: params.contactId }
    });
    if (accountRel) {
      await prisma.accountContactRelationship.update({
        where: { id: accountRel.id },
        data: { isPrimary, role }
      });
    }

    return { success: true };
  }
};
