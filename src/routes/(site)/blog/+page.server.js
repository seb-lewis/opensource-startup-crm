import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  try {
    // Pagination parameters
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = 5; // Number of posts per page
    const skip = (page - 1) * pageSize;
    // console.log('Page:', page, 'Skip:', skip, 'Page Size:', pageSize);
    // Fetch posts with pagination
    const posts = await prisma.blogPost.findMany({
      // Temporarily showing all posts for testing
      // where: {
      //   published: true // Only show published posts
      // },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            profilePhoto: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: pageSize
    });
    
    // console.log('Fetched Posts:', posts);
    // Get total count for pagination
    const totalPosts = await prisma.blogPost.count({
      // Temporarily counting all posts for testing
      // where: {
      //   published: true
      // }
    });
    
    // Calculate pagination values
    const totalPages = Math.ceil(totalPosts / pageSize);
    
    return { 
      posts,
      pagination: {
        page,
        pageSize,
        totalPosts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return { 
      posts: [], 
      pagination: {
        page: 1,
        pageSize: 5,
        totalPosts: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      },
      error: 'Failed to load blog posts'
    };
  }
}
