import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  // Retrieve the stored access token from cookies
  let access_token = cookies.get('access_token');
  if (!access_token) {
    // Redirect to login if the token is missing
    throw redirect(307, '/login');
  }

  try {
    const leads_url = env.API_HOST + '/api/leads/meta/';

    let access_token = cookies.get('access_token');
    let org = cookies.get('org');

    const response = await fetch(leads_url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'org': org,
        'Content-Type': 'application/json'
      },
    });

    // Check if the API response is not ok
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting lead meta:', errorData.detail);
      return { error: errorData.detail || 'Failed to get lead meta.' };
    }

    // Parse and return the JSON response from the API
    const data = await response.json();
    console.log('Lead meta data:', data);
    // Redirect to the leads list page on success
    return {
      data: data,
    };
    
    // Alternative: return success data for client-side handling
    // return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    // Handle any unexpected errors
    return { error: 'An unexpected error occurred while creating the lead.' };
  }
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch, cookies }) => {
    // Get the submitted form data
    const formData = await request.formData();
    
    // Extract all form fields
    const leadData = {
      opportunity_amount: parseInt(String(formData.get('opportunity_amount') || '0')),
      website: formData.get('website'),
      industry: formData.get('industry'),
      status: formData.get('status'),
      skype_ID: formData.get('skype_ID'),
      source: formData.get('source'),
      probability: parseInt(String(formData.get('probability') || '0')),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      title: formData.get('title'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address_line: formData.get('address_line'),
      city: formData.get('city'),
      street: formData.get('street'),
      state: formData.get('state'),
      postcode: formData.get('postcode'),
      country: formData.get('country'),
      description: formData.get('description')
    };
    
    try {
      const leads_url = env.API_HOST + '/api/leads/';

      let access_token = cookies.get('access_token');
      let org = cookies.get('org');

      // Add organization ID if needed by your API
     

      const response = await fetch(leads_url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'org': org,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });

      // Check if the API response is not ok
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating lead:', errorData.detail);
        return { error: errorData.detail || 'Failed to create lead.' };
      }

      // Parse and return the JSON response from the API
      const data = await response.json();
      
      // Redirect to the leads list page on success
      throw redirect(303, '/leads');
      
      // Alternative: return success data for client-side handling
      // return { success: true, data };
    } catch (err) {
      console.error('Unexpected error:', err);
      // Handle any unexpected errors
      return { error: 'An unexpected error occurred while creating the lead.' };
    }
  }
};