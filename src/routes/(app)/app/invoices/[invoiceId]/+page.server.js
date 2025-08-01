import { error, redirect } from '@sveltejs/kit';
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
          name: true,
          street: true,
          city: true,
          state: true,
          postalCode: true,
          country: true
        }
      },
      contact: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      lineItems: {
        include: {
          product: {
            select: {
              name: true,
              code: true
            }
          }
        },
        orderBy: {
          id: 'asc'
        }
      },
      preparedBy: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!invoice) {
    throw error(404, 'Invoice not found');
  }

  return {
    invoice
  };
};
