import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load({ params }) {
  const lead_id = params.lead_id;
  
  try {
    // Fetch lead with owner information
    const lead = await prisma.lead.findUnique({
      where: { id: lead_id },
      include: {
        owner: true,
        tasks: {
          orderBy: { createdAt: 'desc' }
        },
        events: {
          orderBy: { startDate: 'asc' }
        },
        comments: {
          include: {
            author: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!lead) {
      throw error(404, 'Lead not found');
    }
    
    return {
      lead
    };
  } catch (err) {
    console.error('Error fetching lead:', err);
    throw error(500, 'Failed to load lead details');
  }
}
