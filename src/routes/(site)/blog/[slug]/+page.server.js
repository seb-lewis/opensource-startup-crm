import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const { slug } = params;
  
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        draft: false // Only show published posts
      },
      include: {
        contentBlocks: {
          orderBy: { displayOrder: 'asc' }
        }
      }
      
    });
    
    if (!post) {
      throw error(404, 'Blog post not found');
    }


    return { post };
  } catch (err) {
    console.error('Error loading blog post:', err);
    throw error(404, 'Blog post not found');
  }
}
