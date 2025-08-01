import { error, fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // For input validation

const prisma = new PrismaClient();

// Input validation schemas
const commentSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long').trim()
});

export async function load({ params, locals }) {
  const lead_id = params.lead_id;
  const org = locals.org;

  const lead = await prisma.lead.findUnique({
    where: { id: lead_id, organizationId: org.id },
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
      },
      contact: true
    }
  });

  if (!lead) {
    throw error(404, 'Lead not found');
  }

  return {
    lead
  };
}

export const actions = {
  convert: async ({ params, locals }) => {
    const lead_id = params.lead_id;
    const user = locals.user;
    const org = locals.org;

    try {
      console.log('Starting lead conversion for lead:', lead_id);
      
      const lead = await prisma.lead.findUnique({
        where: { id: lead_id, organizationId: org.id },
        include: {
          organization: true,
          owner: true
        }
      });

      if (!lead) {
        return fail(404, { status: 'error', message: 'Lead not found' });
      }

      if (lead.status === 'CONVERTED') {
        return { status: 'success', message: 'Lead already converted' };
      }

      console.log('Creating contact...');
      const contact = await prisma.contact.create({
        data: {
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          title: lead.title,
          description: lead.description,
          owner: { connect: { id: lead.ownerId } },
          organization: { connect: { id: lead.organizationId } }
        }
      });
      console.log('Contact created with ID:', contact.id);

      let accountId = null;
      let account = null;
      if (lead.company) {
        console.log('Creating account for company:', lead.company);
        account = await prisma.account.create({
          data: {
            name: lead.company,
            industry: lead.industry,
            owner: { connect: { id: lead.ownerId } },
            organization: { connect: { id: lead.organizationId } }
          }
        });
        accountId = account.id;
        console.log('Account created with ID:', accountId);

        console.log('Creating account-contact relationship...');
        await prisma.accountContactRelationship.create({
          data: {
            account: { connect: { id: account.id } },
            contact: { connect: { id: contact.id } },
            isPrimary: true,
            role: 'Primary Contact'
          }
        });
        console.log('Account-contact relationship created');
      } else {
        console.log('Creating placeholder account...');
        // Create a placeholder account if no company
        account = await prisma.account.create({
          data: {
            name: `${lead.firstName} ${lead.lastName} Account`,
            owner: { connect: { id: lead.ownerId } },
            organization: { connect: { id: lead.organizationId } }
          }
        });
        accountId = account.id;
        console.log('Placeholder account created with ID:', accountId);

        console.log('Creating account-contact relationship...');
        await prisma.accountContactRelationship.create({
          data: {
            account: { connect: { id: account.id } },
            contact: { connect: { id: contact.id } },
            isPrimary: true,
            role: 'Primary Contact'
          }
        });
        console.log('Account-contact relationship created');
      }

      console.log('Creating opportunity...');
      const opportunity = await prisma.opportunity.create({
        data: {
          name: `${lead.company || lead.firstName + ' ' + lead.lastName} Opportunity`,
          stage: 'PROSPECTING',
          amount: 0,
          closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          contacts: { connect: { id: contact.id } },
          owner: { connect: { id: lead.ownerId } },
          organization: { connect: { id: lead.organizationId } },
          account: { connect: { id: accountId } }
        }
      });
      console.log('Opportunity created with ID:', opportunity.id);

      console.log('Updating lead status...');
      await prisma.lead.update({
        where: { id: lead_id },
        data: {
          status: 'CONVERTED',
          isConverted: true,
          convertedAt: new Date(),
          convertedContactId: contact.id,
          convertedAccountId: accountId,
          convertedOpportunityId: opportunity.id,
          contact: { connect: { id: contact.id } }
        }
      });
      console.log('Lead status updated successfully');

      console.log('Lead conversion completed, account created:', accountId);
      
      return {
        status: 'success',
        message: 'Lead successfully converted',
        redirectTo: `/app/accounts/${accountId}`,
        contact,
        account,
        opportunity
      };
    } catch (err) {
      console.error('Error converting lead:', err);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to convert lead';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
        errorMessage = err.message;
      }
      
      return fail(500, { 
        status: 'error', 
        message: `Error converting lead: ${errorMessage}` 
      });
    }
  },

  addComment: async ({ params, request, locals }) => {
    const lead_id = params.lead_id;
    const user = locals.user;
    const org = locals.org;


    // Validate form data
    const data = await request.formData();
    const comment = data.get('comment');
    
    try {
      const validatedComment = commentSchema.parse({ comment });
      
      const lead = await prisma.lead.findUnique({
        where: { id: lead_id, organizationId: org.id },
        select: { organizationId: true }
      });

      if (!lead) {
        return fail(404, { status: 'error', message: 'Lead not found' });
      }

      await prisma.comment.create({
        data: {
          body: validatedComment.comment,
          lead: { connect: { id: lead_id } },
          author: { connect: { id: user.id } },
          organization: { connect: { id: lead.organizationId } }
        }
      });

      const updatedLead = await prisma.lead.findUnique({
        where: { id: lead_id },
        include: {
          comments: { include: { author: true }, orderBy: { createdAt: 'desc' } }
        }
      });

      return {
        status: 'success',
        message: 'Comment added successfully',
        commentAdded: true,
        comments: updatedLead?.comments || []
      };
    } catch (err) {
      console.error('Error adding comment:', err instanceof Error ? err.message : String(err));
      if (err instanceof z.ZodError) {
        return fail(400, { status: 'error', message: err.issues[0].message });
      }
      return fail(500, { status: 'error', message: 'Failed to add comment' });
    }
  }
};