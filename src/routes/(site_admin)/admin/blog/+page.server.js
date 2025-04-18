import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return { posts };
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return { posts: [], error: 'Failed to load blog posts' };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  delete: async ({ request }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString();
    
    if (!id) {
      return fail(400, { error: 'Missing blog post ID' });
    }
    
    try {
      await prisma.blogPost.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return fail(500, { error: 'Failed to delete blog post' });
    }
  }
};
