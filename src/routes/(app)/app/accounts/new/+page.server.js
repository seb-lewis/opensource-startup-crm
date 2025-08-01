import { fail } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { validatePhoneNumber, formatPhoneForStorage } from '$lib/utils/phone.js';
import { 
  industries, 
  accountTypes, 
  accountOwnership, 
  ratings, 
  countries 
} from '$lib/data/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {

  // Get data for dropdowns
  return {
    data: {
      industries,
      accountTypes,
      accountOwnership,
      ratings,
      countries
    }
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals }) => {
    // Get user and org from locals
    const user = locals.user;
    const org = locals.org;

    // Get the submitted form data
    const formData = await request.formData();
    
    // Extract and validate required fields
    const name = formData.get('name')?.toString().trim();
    
    if (!name) {
      return fail(400, { error: 'Account name is required' });
    }

    // Validate phone number if provided
    let formattedPhone = null;
    const phone = formData.get('phone')?.toString();
    if (phone && phone.trim().length > 0) {
      const phoneValidation = validatePhoneNumber(phone.trim());
      if (!phoneValidation.isValid) {
        return fail(400, { error: phoneValidation.error || 'Please enter a valid phone number' });
      }
      formattedPhone = formatPhoneForStorage(phone.trim());
    }

    // Extract all form fields
    const accountData = {
      name,
      type: formData.get('type')?.toString() || null,
      industry: formData.get('industry')?.toString() || null,
      website: formData.get('website')?.toString() || null,
      phone: formattedPhone,
      street: formData.get('street')?.toString() || null,
      city: formData.get('city')?.toString() || null,
      state: formData.get('state')?.toString() || null,
      postalCode: formData.get('postalCode')?.toString() || null,
      country: formData.get('country')?.toString() || null,
      description: formData.get('description')?.toString() || null,
      numberOfEmployees: formData.get('numberOfEmployees') ? 
        parseInt(formData.get('numberOfEmployees')?.toString() || '0') : null,
      annualRevenue: formData.get('annualRevenue') ? 
        parseFloat(formData.get('annualRevenue')?.toString() || '0') : null,
      accountOwnership: formData.get('accountOwnership')?.toString() || null,
      tickerSymbol: formData.get('tickerSymbol')?.toString() || null,
      rating: formData.get('rating')?.toString() || null,
      sicCode: formData.get('sicCode')?.toString() || null
    };
    
    try {
      // Create new account in the database
      const account = await prisma.account.create({
        data: {
          ...accountData,
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
      
      // Return success instead of redirecting
      return {
        status: 'success',
        message: 'Account created successfully',
        account: {
          id: account.id,
          name: account.name
        }
      };
      
    } catch (err) {
      console.error('Error creating account:', err);
      return fail(500, { 
        error: 'Failed to create account: ' + (err instanceof Error ? err.message : 'Unknown error'),
        values: accountData // Return entered values so the form can be repopulated
      });
    }
  }
};