import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  // You might want to check for admin permissions here
  return {};
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .trim();                   // Trim leading/trailing whitespace
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals }) => {
    const user = locals.user;
    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    const content = form.get('content')?.toString().trim();
    const excerpt = form.get('excerpt')?.toString().trim();
    const slugInput = form.get('slug')?.toString().trim();
    const published = form.get('published') === 'on';
    
    if (!title) {
      return fail(400, { 
        error: 'Title is required',
        data: { title, content, excerpt, slug: slugInput, published }
      });
    }
    
    if (!content) {
      return fail(400, { 
        error: 'Content is required',
        data: { title, content, excerpt, slug: slugInput, published }
      });
    }
    
    try {
      // Generate slug from title if not provided
      const slug = slugInput || generateSlug(title);
      
      // Check if slug is unique
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug }
      });
      
      if (existingPost) {
        return fail(400, { 
          error: 'A post with this slug already exists. Please choose a different slug.',
          data: { title, content, excerpt, slug, published }
        });
      }
      
      // Create the blog post
      const post = await prisma.blogPost.create({
        data: {
          title,
          slug,
          content,
          excerpt: excerpt || undefined,
          published,
          author: {
            connect: { id: locals.user.id }
          },
        }
      });
      
      // Redirect to the edit page
      // throw redirect(303, `/admin/blog/${post.id}/edit?created=true`);
      return { success: true };
    } catch (error) {
      console.error('Error creating blog post:', error);
      
      return fail(500, { 
        error: 'Failed to create blog post. Please try again.',
        data: { title, content, excerpt, slug: slugInput, published }
      });
    }
  }
};
