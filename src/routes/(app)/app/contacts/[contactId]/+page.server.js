import prisma from '$lib/prisma';

export async function load({ params, locals }) {
  const org = locals.org;
  const contact = await prisma.contact.findUnique({
    where: { id: params.contactId, organizationId: org.id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!contact) {
    return {
      status: 404,
      error: new Error('Contact not found')
    };
  }

  // Get all related accounts via AccountContactRelationship
  const accountRels = await prisma.accountContactRelationship.findMany({
    where: { contactId: params.contactId },
    include: { account: true },
    orderBy: [
      { isPrimary: 'desc' }, // Primary relationships first
      { startDate: 'desc' }  // Then by most recent
    ]
  });

  // Fetch related opportunities
  const opportunities = await prisma.opportunity.findMany({
    where: { 
      contacts: { some: { id: params.contactId } },
      organization: { id: org.id }
    },
    include: { account: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Fetch related tasks
  const tasks = await prisma.task.findMany({
    where: { contactId: params.contactId, organizationId: org.id },
    include: { owner: true, createdBy: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Fetch related events
  const events = await prisma.event.findMany({
    where: { contactId: params.contactId, organizationId: org.id },
    include: { owner: true, createdBy: true },
    orderBy: { startDate: 'desc' },
    take: 5
  });

  return { 
    contact: {
      ...contact,
      accountRelationships: accountRels,
      opportunities,
      tasks,
      events
    }
  };
}
