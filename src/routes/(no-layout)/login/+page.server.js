import axios from 'axios';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { auth } from '$lib/stores/auth';

/** @type {import('@sveltejs/kit').ServerLoad} */
export async function load({ params, url, cookies, locals }) {
  const code = url.searchParams.get('code')
  const redirect_uri = env.GOOGLE_LOGIN_DOMAIN + '/login'

  if (code != null) {
    params = {
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET
    }
    let info

    try {
      const response = await axios.post('https://accounts.google.com/o/oauth2/token', params)
      info = response.data
    } catch (error) {
      console.error('Error:', error)
    }

    console.log('info', info)
    var payload =
    {
      "token": info.access_token
    }
    try {
      const response = await axios.post(env.API_HOST + '/api/auth/google', payload);
      console.log(response.data);

      cookies.set('access_token', response.data.access_token, {
        path: '/',
        httpOnly: false, // set to true if server-side only
        sameSite: 'strict',
        secure: true,
        maxAge: 60 * 60 * 24, // 1 day
      });

      cookies.set('refresh_token', response.data.refresh_token, {
        path: '/',
        httpOnly: false,
        sameSite: 'strict',
        secure: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      auth.set({
        isAuthenticated: true,
        user: response.data.username,
        access_token: response.data.access_token
      });

      
      
    } catch (error) {
      console.error('Login error:', error || error.message);
    }
    throw redirect(307, '/bounce');

  }

  const google_login_url = (
    'https://accounts.google.com/o/oauth2/auth?client_id=' +
    env.GOOGLE_CLIENT_ID +
    '&response_type=code' +
    '&scope=https://www.googleapis.com/auth/userinfo.profile ' +
    'https://www.googleapis.com/auth/userinfo.email' +
    '&redirect_uri=' + redirect_uri +
    '&state=google'
  )

  return { google_url: google_login_url }
}

