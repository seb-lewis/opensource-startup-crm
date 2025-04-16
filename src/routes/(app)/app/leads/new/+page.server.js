import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  const user = locals.user;
  const org = locals.org;

  if (!user || !org) {
    throw redirect(307, '/login');
  }

  // Get data for dropdowns
  return {
    data: {
      industries: [
        ['', 'Select Industry'],
        ['TECHNOLOGY', 'Technology'],
        ['HEALTHCARE', 'Healthcare'],
        ['FINANCE', 'Finance'],
        ['EDUCATION', 'Education'],
        ['RETAIL', 'Retail'],
        ['MANUFACTURING', 'Manufacturing'],
        ['ENERGY', 'Energy'],
        ['REAL_ESTATE', 'Real Estate'],
        ['CONSTRUCTION', 'Construction'],
        ['TRANSPORTATION', 'Transportation'],
        ['HOSPITALITY', 'Hospitality'],
        ['AGRICULTURE', 'Agriculture'],
        ['OTHER', 'Other']
      ],
      status: Object.entries({
        'NEW': 'New',
        'PENDING': 'Pending',
        'CONTACTED': 'Contacted',
        'QUALIFIED': 'Qualified',
        'UNQUALIFIED': 'Unqualified'
      }),
      source: Object.entries({
        'WEB': 'Website',
        'PHONE_INQUIRY': 'Phone Inquiry',
        'PARTNER_REFERRAL': 'Partner Referral',
        'COLD_CALL': 'Cold Call',
        'TRADE_SHOW': 'Trade Show',
        'EMPLOYEE_REFERRAL': 'Employee Referral',
        'ADVERTISEMENT': 'Advertisement',
        'OTHER': 'Other'
      }),
      countries: [
        ['', 'Select Country'],
        ['US', 'United States'],
        ['UK', 'United Kingdom'],
        ['CA', 'Canada'],
        ['AU', 'Australia'],
        ['IN', 'India'],
        ['DE', 'Germany'],
        ['FR', 'France'],
        ['JP', 'Japan'],
        ['OTHER', 'Other']
      ]
    }
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals }) => {
    // Get user and org from locals
    const user = locals.user;
    const org = locals.org;

    if (!user || !org) {
      return fail(401, { error: 'Unauthorized' });
    }

    // Get the submitted form data
    const formData = await request.formData();
    
    // Extract and validate required fields
    const firstName = formData.get('first_name')?.toString().trim();
    const lastName = formData.get('last_name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim();
    const leadTitle = formData.get('lead_title')?.toString().trim();
    
    if (!firstName) {
      return fail(400, { error: 'First name is required' });
    }
    
    if (!lastName) {
      return fail(400, { error: 'Last name is required' });
    }
    
    if (!leadTitle) {
      return fail(400, { error: 'Lead title is required' });
    }

    // Extract all form fields
    const leadData = {
      firstName,
      lastName,
      title: leadTitle,
      email: email || null,
      phone: formData.get('phone')?.toString() || null,
      company: formData.get('company')?.toString() || null,
      status: formData.get('status')?.toString() || 'PENDING',
      leadSource: formData.get('source')?.toString() || null,
      industry: formData.get('industry')?.toString() || null,
      description: formData.get('description')?.toString() || null,
      
      // Store opportunity amount in description since it's not in the Lead schema
      opportunityAmount: formData.get('opportunity_amount') ? 
        parseFloat(formData.get('opportunity_amount')) : null,
      
      // Store probability in description since it's not in the Lead schema
      probability: formData.get('probability') ? 
        parseFloat(formData.get('probability')) : null,
      
      // Address fields
      street: formData.get('street')?.toString() || null,
      city: formData.get('city')?.toString() || null,
      state: formData.get('state')?.toString() || null,
      postalCode: formData.get('postcode')?.toString() || null,
      country: formData.get('country')?.toString() || null,
      
      // Save these to include in description if not available in the model
      website: formData.get('website')?.toString() || null,
      skypeID: formData.get('skype_ID')?.toString() || null,
    };
    
    try {
      // Prepare basic lead data that matches the Prisma schema
      let leadCreateData = {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        title: leadData.title,
        status: leadData.status,
        // Use conditional check for enum fields
        ...(leadData.leadSource ? { leadSource: leadData.leadSource } : {}),
        industry: leadData.industry,
        description: leadData.description || '',
        rating: null, // This is in the schema
        owner: {
          connect: {
            id: user.id
          }
        },
        organization: {
          connect: {
            id: org.id
          }
        }
      };

      // Add lead title to description since it's not in the Lead schema
      let additionalInfo = [`Lead Title: ${leadData.leadTitle}`];
      
      // Add address info to description if model doesn't support it
      const addressText = [
        leadData.street, 
        leadData.city, 
        leadData.state, 
        leadData.postalCode, 
        leadData.country
      ].filter(Boolean).join(', ');
          
      // Add website, skype, opportunity amount, and probability info to description
      if (addressText) additionalInfo.push(`Address: ${addressText}`);
      if (leadData.website) additionalInfo.push(`Website: ${leadData.website}`);
      if (leadData.skypeID) additionalInfo.push(`Skype ID: ${leadData.skypeID}`);
      if (leadData.opportunityAmount) additionalInfo.push(`Opportunity Amount: ${leadData.opportunityAmount}`);
      if (leadData.probability) additionalInfo.push(`Probability: ${leadData.probability}%`);
      
      if (additionalInfo.length > 0) {
        leadCreateData.description = [
          leadCreateData.description,
          ...additionalInfo
        ].filter(Boolean).join('\n\n');
      }

      // Create new lead in the database
      const lead = await prisma.lead.create({
        data: leadCreateData
      });
      
      // Return success instead of redirecting
      return {
        status: 'success',
        message: 'Lead created successfully',
        lead: {
          id: lead.id,
          name: `${lead.firstName} ${lead.lastName}`
        }
      };
      
    } catch (err) {
      console.error('Error creating lead:', err);
      return fail(500, { 
        error: 'Failed to create lead: ' + err.message,
        values: leadData // Return entered values so the form can be repopulated
      });
    }
  }
};