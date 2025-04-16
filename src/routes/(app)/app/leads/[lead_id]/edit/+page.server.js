import { error, redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load({ params }) {
  const { lead_id } = params;
  
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: lead_id },
      include: {
        owner: true,
        contact: true
      }
    });
    
    if (!lead) {
      throw error(404, 'Lead not found');
    }
    
    const users = await prisma.user.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    
    return {
      lead,
      users
    };
  } catch (err) {
    console.error('Error loading lead:', err);
    throw error(500, 'Failed to load lead data');
  }
}

export const actions = {
  default: async ({ request, params, locals }) => {
    const { lead_id } = params;
    const formData = await request.formData();
    
    // Get org from locals
    const org = locals.org;
    if (!org) {
      return { success: false, error: 'Organization not found in session.' };
    }

    const updatedLead = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      title: formData.get('title'),
      status: formData.get('status'),
      leadSource: formData.get('leadSource') || null,
      industry: formData.get('industry') || null,
      rating: formData.get('rating') || null,
      description: formData.get('description') || null,
      ownerId: formData.get('ownerId'),
      organizationId: org.id // Always set from session
    };
    
    try {
      await prisma.lead.update({
        where: { id: lead_id },
        data: updatedLead
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error updating lead:', err);
      return { success: false, error: 'Failed to update lead' };
    }
  }
};
