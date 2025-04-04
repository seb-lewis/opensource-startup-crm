import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
  // Retrieve the stored access token from cookies
  let access_token = cookies.get('access_token');
  if (!access_token) {
    // Redirect to login if the token is missing
    throw redirect(307, '/login');
  }

  // Build your products endpoint URL (adjust as needed)
  const productsUrl = env.API_HOST + '/api/org';
  console.log('Access Token:', access_token);

  
}

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		// Get the submitted form data
		const formData = await request.formData();
		const orgName = formData.get('org_name'); // Ensure your <Input> has a corresponding "name" attribute, e.g., name="org_name"

		try {
            const orgs_url = env.API_HOST + '/api/org/';

			// Send a POST request to the /api/org/ endpoint with the form data as JSON
            console.log('orgs_url', orgs_url);
  let access_token = cookies.get('access_token');
           
			const response = await fetch(orgs_url, {
                method: 'POST',
				headers: {
                    'Authorization': `Bearer ${access_token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ org_name: orgName })
			});

			// Check if the API response is not ok
			if (!response.ok) {
				return { error: 'Failed to create organization.' };
			}

			// Parse and return the JSON response from the API
			const data = await response.json();
			return { data };
		} catch (err) {
			// Handle any unexpected errors
			return { error: 'An unexpected error occurred.' };
		}
	}
};