import prisma from '$lib/prisma';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {};
}

// Handle POST request for creating a new blog
/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title');
    const excerpt = data.get('excerpt');
    const slug = data.get('slug');
    
    if (!title || !excerpt || !slug) {
      return { error: 'All fields are required' };
    }
    try {
      await prisma.blogPost.create({
        data: {
          title,
          excerpt,
          slug,
          seoTitle:"",
          seoDescription: "",
          draft: true
        }
      });
      return { success: true };
    } catch (e) {
      return { error: e?.message || 'Error creating blog' };
    }
  }
};