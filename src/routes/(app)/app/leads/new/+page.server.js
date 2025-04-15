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
    
    if (!firstName) {
      return fail(400, { error: 'First name is required' });
    }

    // Extract all form fields
    const leadData = {
      firstName,
      lastName,
      email: email || null,
      phone: formData.get('phone')?.toString() || null,
      company: formData.get('company')?.toString() || null,
      title: formData.get('title')?.toString() || null,
      status: formData.get('status')?.toString() || 'PENDING',
      leadSource: formData.get('source')?.toString() || null,
      industry: formData.get('industry')?.toString() || null,
      rating: null, // Can be set based on a rating field if added
      description: formData.get('description')?.toString() || null,
    };
    
    try {
      // Create new lead in the database
      const lead = await prisma.lead.create({
        data: {
          ...leadData,
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
        }
      });
      
      // Optionally create an address if provided
      const street = formData.get('street')?.toString() || '';
      const city = formData.get('city')?.toString() || '';
      const state = formData.get('state')?.toString() || '';
      const postalCode = formData.get('postcode')?.toString() || '';
      const country = formData.get('country')?.toString() || '';
      
      if (street || city || state || postalCode || country) {
        // Create address (this would require extending the Prisma schema to link address to lead)
        // For now, we'll just add these fields to lead description
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            description: `${leadData.description || ''}\n\nAddress:\n${street} ${city} ${state} ${postalCode} ${country}`.trim()
          }
        });
      }
      
      // Redirect to the newly created lead
      throw redirect(303, '/app/leads/');
      
    } catch (err) {
      console.error('Error creating lead:', err);
      return fail(500, { 
        error: 'Failed to create lead',
        values: leadData // Return entered values so the form can be repopulated
      });
    }
  }
};