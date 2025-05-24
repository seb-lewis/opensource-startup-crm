import prisma from '$lib/prisma';

export async function load({ params, locals }) {
  const org = locals.org;
  const contact = await prisma.contact.findUnique({
    where: { id: params.contactId, organizationId: org.id },
  });

  if (!contact) {
    return {
      status: 404,
      error: new Error('Contact not found')
    };
  }

  // Get related accounts via AccountContactRelationship
  const accountRels = await prisma.accountContactRelationship.findMany({
    where: { contactId: params.contactId },
    include: { account: true }
  });
  const account = accountRels.length > 0 ? accountRels[0].account : null;
  const isPrimary = accountRels.length > 0 ? accountRels[0].isPrimary : false;
  const role = accountRels.length > 0 ? accountRels[0].role : null;

  // Optionally: fetch related tasks, events, etc. if you want to show them
  // const tasks = await prisma.task.findMany({ where: { contactId: params.contactId } });

  return { contact, account, isPrimary, role };
}
