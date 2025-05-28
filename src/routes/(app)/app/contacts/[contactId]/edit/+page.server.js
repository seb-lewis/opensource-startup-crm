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
    const department = formData.get('department')?.toString().trim() || null;
    const street = formData.get('street')?.toString().trim() || null;
    const city = formData.get('city')?.toString().trim() || null;
    const state = formData.get('state')?.toString().trim() || null;
    const postalCode = formData.get('postalCode')?.toString().trim() || null;
    const country = formData.get('country')?.toString().trim() || null;
    const description = formData.get('description')?.toString().trim() || null;

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
      data: { 
        firstName, 
        lastName, 
        email, 
        phone, 
        title, 
        department,
        street,
        city,
        state,
        postalCode,
        country,
        description 
      }
    });

    return { success: true };
  }
};
