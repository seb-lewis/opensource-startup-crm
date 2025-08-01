import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma'
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies, locals }) => {
    // Get the user from locals
    const user = locals.user;
    
    if (!user) {
      return {
        error: {
          name: 'You must be logged in to create an organization'
        }
      };
    }
    
    // Get the submitted form data
    const formData = await request.formData();
    const orgName = formData.get('org_name')?.toString();

    if (!orgName) {
      return {
        error: {
          name: 'Organization name is required'
        }
      };
    }

    try {
      // Check if organization with the same name already exists
      const existingOrg = await prisma.organization.findFirst({
        where: {
          name: orgName
        }
      });

      if (existingOrg) {
        return { 
          error: { 
            name: 'Organization with this name already exists' 
          } 
        };
      }

      // Use a transaction to create both the organization and user-organization relationship
      const result = await prisma.$transaction(async (prisma) => {
        // Create new organization
        const newOrg = await prisma.organization.create({
          data: {
            name: orgName,
          }
        });

        // Create user-organization relationship with ADMIN role
        const userOrg = await prisma.userOrganization.create({
          data: {
            userId: user.id,
            organizationId: newOrg.id,
            role: 'ADMIN'
          }
        });

        return { newOrg, userOrg };
      });

      // Set org cookie for the newly created org
      cookies.set('org', result.newOrg.id, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict'
      });

      // Redirect to home page after successful creation
      return {
        data:{
          name:orgName
        }
      }
    } catch (err) {
      console.error('Error creating organization:', err);
      return { 
        error: { 
          name: 'An unexpected error occurred while creating the organization.' 
        } 
      };
    }
  }
};