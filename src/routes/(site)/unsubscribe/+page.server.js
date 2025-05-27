import { fail } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const token = url.searchParams.get('token');
  
  if (!token) {
    return {
      error: 'Invalid unsubscribe link. Please check your email for the correct link.'
    };
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { confirmationToken: token }
    });

    if (!subscriber) {
      return {
        error: 'Invalid unsubscribe token. This link may have expired or already been used.'
      };
    }

    return {
      subscriber: {
        email: subscriber.email,
        token: subscriber.confirmationToken
      }
    };
  } catch (error) {
    console.error('Unsubscribe load error:', error);
    return {
      error: 'An error occurred while processing your request. Please try again later.'
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  unsubscribe: async ({ request }) => {
    const formData = await request.formData();
    const token = formData.get('token')?.toString();
    
    if (!token) {
      return fail(400, { message: 'Invalid unsubscribe token' });
    }
    
    try {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { confirmationToken: token }
      });
      
      if (!subscriber) {
        return fail(404, { message: 'Subscriber not found or already unsubscribed' });
      }
      
      if (!subscriber.isActive) {
        return { success: true, message: 'You have already been unsubscribed from our newsletter' };
      }
      
      // Update subscriber to inactive
      await prisma.newsletterSubscriber.update({
        where: { confirmationToken: token },
        data: {
          isActive: false,
          unsubscribedAt: new Date()
        }
      });
      
      return { success: true, message: 'Successfully unsubscribed from newsletter' };
      
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return fail(500, { message: 'Failed to unsubscribe. Please try again later.' });
    }
  }
};
