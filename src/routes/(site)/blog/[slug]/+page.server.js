import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const { slug } = params;
  
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true // Only show published posts
      },
      include: {
        author: {
          select: {
            name: true,
            profilePhoto: true
          }
        }
      }
    });
    
    if (!post) {
      throw error(404, 'Blog post not found');
    }
    
    // Get related posts (same author, excluding current post)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        authorId: post.authorId,
        id: { not: post.id }
      },
      select: {
        title: true,
        slug: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });
    
    return { post, relatedPosts };
  } catch (err) {
    console.error('Error loading blog post:', err);
    throw error(404, 'Blog post not found');
  }
}
