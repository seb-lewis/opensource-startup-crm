import axios from 'axios';
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
  const productsUrl = env.API_HOST + '/api/org/';
  console.log('Access Token:', access_token);

  try {
    // Call the products API endpoint with the JWT in the Authorization header
    const response = await axios.get(productsUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    console.log('Products Response:', response.data);
    return { products: response.data };
  } catch (error) {
    console.error('Error fetching products:', error);

    // Check if the error status is 401 (unauthorized)
    if (error.response && error.response.status === 401) {
      throw redirect(307, '/login');
    }
    
    // Handle other errors or return an empty product list
    return { products: [] };
  }
}
