import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    const accountId = params.accountId;
    
    // Fetch account details
    const account = await prisma.account.findUnique({
      where: {
        id: accountId
      }
    });
    
    if (!account) {
      throw error(404, 'Account not found');
    }
    
    // Fetch account contacts
    const contactRelationships = await prisma.accountContactRelationship.findMany({
      where: {
        accountId: accountId
      },
      include: {
        contact: true
      }
    });
    
    // Format contacts with isPrimary flag
    const contacts = contactRelationships.map(rel => ({
      ...rel.contact,
      isPrimary: rel.isPrimary,
      role: rel.role
    }));
    
    // Fetch account opportunities
    const opportunities = await prisma.opportunity.findMany({
      where: {
        accountId: accountId
      }
    });
    
    // Fetch account comments/notes
    const comments = await prisma.comment.findMany({
      where: {
        accountId: accountId
      },
      include: {
        author: {
          select: {
            name: true,
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Fetch account quotes
    const quotes = await prisma.quote.findMany({
      where: {
        accountId: accountId
      }
    });
    
    // Fetch account tasks
    const tasks = await prisma.task.findMany({
      where: {
        accountId: accountId
      },
      include: {
        owner: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });
    
    // Fetch account cases
    const cases = await prisma.case.findMany({
      where: {
        accountId: accountId
      }
    });
    
    return {
      account,
      contacts,
      opportunities,
      comments,
      quotes,
      tasks,
      cases,
      meta: {
        title: account.name,
        description: `Account details for ${account.name}`
      }
    };
  } catch (err) {
    console.error('Error loading account data:', err);
    throw error(err.status || 500, err.message || 'Error loading account data');
  }
}
