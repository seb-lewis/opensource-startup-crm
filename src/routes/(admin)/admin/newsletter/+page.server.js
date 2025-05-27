import prisma from '$lib/prisma.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        id: true,
        email: true,
        isActive: true,
        isConfirmed: true,
        subscribedAt: true,
        unsubscribedAt: true,
        confirmedAt: true,
        ipAddress: true
      }
    });

    const stats = await prisma.newsletterSubscriber.aggregate({
      _count: {
        id: true
      },
      where: {
        isActive: true
      }
    });

    const totalSubscribers = await prisma.newsletterSubscriber.count();
    
    return {
      subscribers,
      activeCount: stats._count.id,
      totalCount: totalSubscribers
    };
  } catch (error) {
    console.error('Failed to load newsletter subscribers:', error);
    return {
      subscribers: [],
      activeCount: 0,
      totalCount: 0,
      error: 'Failed to load subscribers'
    };
  }
}
