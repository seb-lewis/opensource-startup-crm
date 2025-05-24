import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, locals }) {
  // Get user and org from locals (set in hooks.server.js)
  const user = locals.user;
  const org = locals.org;
  
  
  // Fetch open leads for the user's organization
  // We're considering NEW, PENDING, CONTACTED, and QUALIFIED statuses as "open"
  const leads = await prisma.lead.findMany({
    where: {
      organizationId: org.id,
      status: {
        in: ['NEW', 'PENDING', 'CONTACTED', 'QUALIFIED']
      },
      isConverted: false
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
  
  return {
    leads
  };
}