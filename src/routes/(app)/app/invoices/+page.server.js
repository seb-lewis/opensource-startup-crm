import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  if (!locals.user || !locals.org) {
    throw redirect(302, '/login');
  }

  // Get quotes that serve as invoices for this organization
  const invoices = await prisma.quote.findMany({
    where: {
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
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return {
    invoices
  };
};
