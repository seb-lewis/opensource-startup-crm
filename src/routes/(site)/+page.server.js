import { fail } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';
import crypto from 'crypto';

/** @type {import('./$types').Actions} */
export const actions = {
  subscribe: async ({ request, getClientAddress }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString().trim();
    
    if (!email) {
      return fail(400, { message: 'Email is required' });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { message: 'Please enter a valid email address' });
    }
    
    // Restrict emails with '+' character
    if (email.includes('+')) {
      return fail(400, { message: 'Please enter a valid email address' });
    }
    
    try {
      // Check if email already exists
      const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email }
      });
      
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return fail(400, { message: 'You are already subscribed to our newsletter' });
        } else {
          // Reactivate subscription
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
              isActive: true,
              subscribedAt: new Date(),
              unsubscribedAt: null,
              confirmationToken: crypto.randomUUID(),
              isConfirmed: false,
              confirmedAt: null,
              ipAddress: getClientAddress(),
              userAgent: request.headers.get('user-agent')
            }
          });
          
          return { success: true, message: 'Successfully resubscribed to newsletter' };
        }
      }
      
      // Create new subscription
      await prisma.newsletterSubscriber.create({
        data: {
          email,
          isActive: true,
          confirmationToken: crypto.randomUUID(),
          isConfirmed: false,
          ipAddress: getClientAddress(),
          userAgent: request.headers.get('user-agent')
        }
      });
      
      return { success: true, message: 'Successfully subscribed to newsletter' };
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return fail(500, { message: 'Failed to subscribe. Please try again later.' });
    }
  }
};