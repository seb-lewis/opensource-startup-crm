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
    const leads_url = env.API_HOST + '/api/leads/';

    let access_token = cookies.get('access_token');
    let org = cookies.get('org');


    const params = new URLSearchParams({
        lead_status: "new",
        limit: "5"
      });
      
    const response = await fetch(`${leads_url}?${params.toString()}`, {
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
    console.log('Leads data:', data);
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