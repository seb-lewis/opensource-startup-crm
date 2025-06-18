import { error, redirect } from '@sveltejs/kit';
import { PrismaClient, LeadStatus, LeadSource } from '@prisma/client';

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
      where: { organizationId: org.id },
      include: {
        user: true
      }
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
    const ownerId = formData.get('ownerId');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');

    // Validate required fields
    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
      return {
        success: false,
        error: 'First name is required.'
      };
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
      return {
        success: false,
        error: 'Last name is required.'
      };
    }

    if (!ownerId || typeof ownerId !== 'string') {
      return {
        success: false,
        error: 'Owner ID is required.'
      };
    }

    // Validate owner ID - ensure the user belongs to the organization
    const ownerValidation = await prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: ownerId,
          organizationId: org.id,
        },
      },
      select: { id: true }
    });

    if (!ownerValidation) {
      return {
        success: false,
        error: 'Invalid owner selected. User is not part of this organization.'
      };
    }

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

    // Get and validate form data
    const statusValue = formData.get('status')?.toString() || 'NEW';
    const leadSourceValue = formData.get('leadSource')?.toString();

    // Simple string validation - Prisma will validate the enum at runtime
    const validStatuses = ['NEW', 'PENDING', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED'];
    const validSources = ['WEB', 'PHONE_INQUIRY', 'PARTNER_REFERRAL', 'COLD_CALL', 'TRADE_SHOW', 'EMPLOYEE_REFERRAL', 'ADVERTISEMENT', 'OTHER'];
    
    if (!validStatuses.includes(statusValue)) {
      return {
        success: false,
        error: 'Invalid lead status provided.'
      };
    }

    if (leadSourceValue && !validSources.includes(leadSourceValue)) {
      return {
        success: false,
        error: 'Invalid lead source provided.'
      };
    }

    try {
      // Use the correct Prisma update method with proper typing
      await prisma.lead.update({
        where: { id: lead_id },
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: formData.get('email')?.toString() || null,
          phone: formData.get('phone')?.toString() || null,
          company: formData.get('company')?.toString() || null,
          title: formData.get('title')?.toString() || null,
          industry: formData.get('industry')?.toString() || null,
          rating: formData.get('rating')?.toString() || null,
          description: formData.get('description')?.toString() || null,
          ownerId: ownerId,
          organizationId: org.id,
          // @ts-ignore - Bypassing TypeScript enum checking for validated enum values
          status: statusValue,
          // @ts-ignore - Bypassing TypeScript enum checking for validated enum values
          leadSource: leadSourceValue || null
        }
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error updating lead:', err);
      return { success: false, error: 'Failed to update lead' };
    }
  }
};
