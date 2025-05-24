import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  addUser: async ({ request, locals }) => {
    if (!locals.org || !locals.org.id) {
      return fail(500, { error: 'Organization not found' });
    }
    const organizationId = locals.org.id;

    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const name = formData.get('name')?.toString();
    const role = formData.get('role')?.toString();

    // Basic validation
    if (!email || !name || !role) {
      return fail(400, { error: 'Missing required fields', data: { email, name, role } });
    }

    if (role !== 'ADMIN' && role !== 'USER') {
      return fail(400, { error: 'Invalid role specified', data: { email, name, role } });
    }

    let userIdToLink;

    try {
      // Check if user exists globally
      let existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        userIdToLink = existingUser.id;
        // Check if user is already in this organization
        const existingUserOrganization = await prisma.userOrganization.findFirst({
          where: {
            userId: existingUser.id,
            organizationId: organizationId,
          },
        });

        if (existingUserOrganization) {
          return fail(400, { error: 'User already exists in this organization', data: { email, name, role } });
        }
        // If user exists globally but not in this org, we'll link them later
      } else {
        // Create new user if they don't exist globally
        // Assuming user_id should be unique, often email is used or a generated cuid/uuid
        // For now, let's assume user_id can be the email if it's meant to be a unique string identifier
        // and the actual primary key is 'id' (auto-increment or CUID).
        // If 'user_id' is meant to be the Clerk/Auth0 ID, this might need adjustment
        // based on how that ID is obtained or if it's set post-creation.
        // The schema provided has `user_id String @unique`
        const newUser = await prisma.user.create({
          data: {
            email,
            name,
            user_id: email, // Assuming email can serve as the initial unique user_id
          },
        });
        userIdToLink = newUser.id;
      }
    } catch (error) {
      console.error('Error finding or creating user:', error);
      return fail(500, { error: 'Could not process user information', data: { email, name, role } });
    }

    try {
      // Link user to the organization
      await prisma.userOrganization.create({
        data: {
          userId: userIdToLink,
          organizationId: organizationId,
          role: role, // 'ADMIN' or 'USER'
        },
      });
      
      // On success, it's often good to redirect to avoid form resubmission issues,
      // or return a success object that the page can use to update its state.
      // For this task, returning a success object is specified.
      return { success: true, message: 'User added successfully!' };

    } catch (error) {
      console.error('Error linking user to organization:', error);
      // This could happen if, for example, a race condition occurred or a DB constraint was violated.
      // The earlier check for existingUserOrganization should prevent most common cases.
      return fail(500, { error: 'Could not add user to organization', data: { email, name, role } });
    }
  },
};
