import prisma from '$lib/prisma';
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const blog = await prisma.blogPost.findUnique({
    where: {
      id: params.id
    },
    include: {
      contentBlocks: {
        orderBy: { displayOrder: 'asc' }
      }
    }
  });
  return {
    blog
  };
};

/** @type {import('./$types').Actions} */
export const actions = {

  'add-block': async ({ request, params }) => {
    const form = await request.formData();
    await prisma.blogContentBlock.create({
      data: {
        blogId: params.id,
        type: form.get('type'),
        content: form.get('content'),
        displayOrder: Number(form.get('displayOrder')),
        draft: form.get('draft') === 'on'
      }
    });
    return { success: true };
  },
  'edit-block': async ({ request }) => {
    const form = await request.formData();
    await prisma.blogContentBlock.update({
      where: { id: form.get('id') },
      data: {
        type: form.get('type'),
        content: form.get('content'),
        draft: form.get('draft') === 'on'
      }
    });
    return { success: true };
  },
  'delete-block': async ({ request }) => {
    const form = await request.formData();
    await prisma.blogContentBlock.delete({
      where: { id: form.get('id') }
    });
    return { success: true };
  },
  'update-blog': async ({ request, params }) => {
    const form = await request.formData();
    const data = {
      title: form.get('title'),
      seoTitle: form.get('seoTitle'),
      seoDescription: form.get('seoDescription'),
      excerpt: form.get('excerpt'),
      slug: form.get('slug'),
      draft: form.get('draft') === 'on'
    };
    await prisma.blogPost.update({
      where: { id: params.id },
      data
    });
    return { success: true };
  }
  ,
  'reorder-blocks': async ({ request, params }) => {
    const form = await request.formData();
    const order = JSON.parse(form.get('order'));
    for (const { id, displayOrder } of order) {
      await prisma.blogContentBlock.update({
        where: { id },
        data: { displayOrder }
      });
    }
    return { success: true };
  }
};