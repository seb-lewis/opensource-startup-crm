import prisma from '$lib/prisma';
import { fail, redirect, error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const { id } = params;
  const showCreatedMessage = url.searchParams.get('created') === 'true';
  
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!post) {
      throw error(404, 'Blog post not found');
    }
    
    return { 
      post,
      showCreatedMessage
    };
  } catch (err) {
    console.error('Error loading blog post:', err);
    throw error(500, 'Error loading blog post');
  }
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
  default: async ({ request, params }) => {
    const { id } = params;
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
      
      // Check if slug is unique (excluding the current post)
      const existingPost = await prisma.blogPost.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      });
      
      if (existingPost) {
        return fail(400, { 
          error: 'A post with this slug already exists. Please choose a different slug.',
          data: { title, content, excerpt, slug, published }
        });
      }
      
      // Update the blog post
      await prisma.blogPost.update({
        where: { id },
        data: {
          title,
          slug,
          content,
          excerpt: excerpt || null,
          published,
          updatedAt: new Date()
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating blog post:', error);
      
      return fail(500, { 
        error: 'Failed to update blog post. Please try again.',
        data: { title, content, excerpt, slug: slugInput, published }
      });
    }
  }
};
