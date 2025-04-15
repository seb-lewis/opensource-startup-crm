import { error, fail } from '@sveltejs/kit';
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

// Add form actions
export const actions = {
  // Action to convert a lead to contact/account/opportunity
  convert: async ({ params }) => {
    const lead_id = params.lead_id;
    
    try {
      // Get the lead to convert with organization data
      const lead = await prisma.lead.findUnique({
        where: { id: lead_id },
        include: {
          organization: true,
          owner: true
        }
      });
      
      if (!lead) {
        return fail(404, {
          status: 'error',
          message: 'Lead not found'
        });
      }
      
      if (lead.status === 'CONVERTED') {
        return {
          status: 'success',
          message: 'Lead already converted'
        };
      }
      
      // Create a new contact from the lead
      const contact = await prisma.contact.create({
        data: {
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          title: lead.title,
          description: lead.description,
          // Connect to the required relationships
          owner: {
            connect: { id: lead.ownerId }
          },
          organization: {
            connect: { id: lead.organizationId }
          }
        }
      });
      
      // Create a new account if company info exists
      let accountId = null;
      let account = null;
      if (lead.company) {
        account = await prisma.account.create({
          data: {
            name: lead.company,
            industry: lead.industry,
            // Connect to the required relationships
            owner: {
              connect: { id: lead.ownerId }
            },
            organization: {
              connect: { id: lead.organizationId }
            }
          }
        });
        accountId = account.id;
        
        // Create the relationship between account and contact using AccountContactRelationship model
        await prisma.accountContactRelationship.create({
          data: {
            account: {
              connect: { id: account.id }
            },
            contact: {
              connect: { id: contact.id }
            },
            isPrimary: true,
            role: 'Primary Contact'
          }
        });
      }
      
      // Create an opportunity
      // First build the common data for the opportunity
      const opportunityData = {
        name: `${lead.company || lead.firstName + ' ' + lead.lastName} Opportunity`,
        stage: 'PROSPECTING',
        amount: 0,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        
        // Connect to the required relationships
        contacts: {
          connect: { id: contact.id }
        },
        owner: {
          connect: { id: lead.ownerId }
        },
        organization: {
          connect: { id: lead.organizationId }
        }
      };
      
      // According to the schema, an opportunity must be connected to an account
      // If no account was created, we'll need to create a placeholder account
      if (!accountId) {
        const placeholderAccount = await prisma.account.create({
          data: {
            name: `${lead.firstName} ${lead.lastName} Account`,
            // Connect to the required relationships
            owner: {
              connect: { id: lead.ownerId }
            },
            organization: {
              connect: { id: lead.organizationId }
            }
          }
        });
        
        accountId = placeholderAccount.id;
        account = placeholderAccount;
        
        // Create relationship between contact and placeholder account
        await prisma.accountContactRelationship.create({
          data: {
            account: {
              connect: { id: placeholderAccount.id }
            },
            contact: {
              connect: { id: contact.id }
            },
            isPrimary: true,
            role: 'Primary Contact'
          }
        });
      }
      
      // Now add the account to the opportunity data
      opportunityData.account = {
        connect: { id: accountId }
      };
      
      const opportunity = await prisma.opportunity.create({
        data: opportunityData
      });
      
      // Update the lead as converted
      await prisma.lead.update({
        where: { id: lead_id },
        data: {
          status: 'CONVERTED',
          isConverted: true,
          convertedAt: new Date(),
          convertedContactId: contact.id,
          convertedAccountId: accountId,
          convertedOpportunityId: opportunity.id,
          contact: {
            connect: { id: contact.id }
          }
        }
      });
      
      return {
        status: 'success',
        message: 'Lead successfully converted',
        contact,
        account,
        opportunity
      };
    } catch (err) {
      console.error('Error converting lead:', err);
      return fail(500, {
        status: 'error',
        message: 'Failed to convert lead: ' + (err.message || 'Unknown error')
      });
    }
  },
  
  // Action to add a comment to the lead
  addComment: async ({ params, request }) => {
    const lead_id = params.lead_id;
    const data = await request.formData();
    const comment = data.get('comment');
    
    if (!comment || comment.trim() === '') {
      return fail(400, {
        status: 'error',
        message: 'Comment cannot be empty'
      });
    }
    
    try {
      // For now, we'll use a fixed user ID. In a real app, you would use the logged-in user's ID
      const CURRENT_USER_ID = 'user_01'; // Replace with actual user auth
      
      // Get the lead to obtain its organization ID
      const lead = await prisma.lead.findUnique({
        where: { id: lead_id },
        select: { organizationId: true }
      });
      
      if (!lead) {
        return fail(404, {
          status: 'error',
          message: 'Lead not found'
        });
      }
      
      const newComment = await prisma.comment.create({
        data: {
          body: comment,
          lead: {
            connect: { id: lead_id }
          },
          author: {
            connect: { id: CURRENT_USER_ID }
          },
          organization: {
            connect: { id: lead.organizationId }
          }
        }
      });
      
      return {
        status: 'success',
        message: 'Comment added successfully',
        comment: newComment
      };
    } catch (err) {
      console.error('Error adding comment:', err);
      return fail(500, {
        status: 'error',
        message: 'Failed to add comment'
      });
    }
  }
};
