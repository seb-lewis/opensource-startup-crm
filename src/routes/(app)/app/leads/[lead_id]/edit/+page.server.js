import { error, redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load({ params, locals }) {
  const { lead_id } = params;
  const org = locals.org;

    const lead = await prisma.lead.findUnique({
      where: { id: lead_id, organizationId: org.id },
      include: {
        owner: true,
        contact: true
      }
    });
    
    if (!lead) {
      throw error(404, 'Lead not found');
    }
    
    const users = await prisma.userOrganization.findMany({
      where: {  organizationId: org.id }
    });
    
    return {
      lead,
      users
    };
 
}

export const actions = {
  default: async ({ request, params, locals }) => {
    const { lead_id } = params;
    const formData = await request.formData();
    const org = locals.org;

    const leadEmail = formData.get('email');

    // Check if leadEmail is a non-empty string before proceeding
    if (typeof leadEmail === 'string' && leadEmail.trim() !== '') {
      // Step 1: Find the user by email
      const user = await prisma.user.findUnique({
        where: { email: leadEmail },
        select: { id: true }, // Select only the user ID
      });

      if (user) {
        // Step 2: Find the UserOrganization record using the user's ID and organization ID
        // This uses the compound unique key @@unique([userId, organizationId])
        const userOrgMembership = await prisma.userOrganization.findUnique({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: org.id,
            },
          },
          select: { id: true } // Fetch only id to confirm existence
        });
        if (!userOrgMembership) {
          return {
            success: false,
            error: 'User is not part of this organization.'
          };
        } 
        // If userOrgMembership exists, validation passes.
      } else {
        return {
          success: false,
          error: 'User with this email does not exist.'
        };
      }
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
