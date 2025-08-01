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
    const type = form.get('type')?.toString();
    const content = form.get('content')?.toString();
    const displayOrder = form.get('displayOrder')?.toString();
    
    if (!type || !content || !displayOrder) {
      return { success: false, error: 'Missing required fields' };
    }
    
    await prisma.blogContentBlock.create({
      data: {
        blogId: params.id,
        type: /** @type {import('@prisma/client').ContentBlockType} */ (type),
        content: content,
        displayOrder: Number(displayOrder),
        draft: form.get('draft') === 'on'
      }
    });
    return { success: true };
  },
  'edit-block': async ({ request }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString();
    const type = form.get('type')?.toString();
    const content = form.get('content')?.toString();
    
    if (!id || !type || !content) {
      return { success: false, error: 'Missing required fields' };
    }
    
    await prisma.blogContentBlock.update({
      where: { id: id },
      data: {
        type: /** @type {import('@prisma/client').ContentBlockType} */ (type),
        content: content,
        draft: form.get('draft') === 'on'
      }
    });
    return { success: true };
  },
  'delete-block': async ({ request }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString();
    
    if (!id) {
      return { success: false, error: 'Missing block ID' };
    }
    
    await prisma.blogContentBlock.delete({
      where: { id: id }
    });
    return { success: true };
  },
  'update-blog': async ({ request, params }) => {
    const form = await request.formData();
    const data = {
      title: form.get('title')?.toString() || '',
      seoTitle: form.get('seoTitle')?.toString() || '',
      seoDescription: form.get('seoDescription')?.toString() || '',
      excerpt: form.get('excerpt')?.toString() || '',
      slug: form.get('slug')?.toString() || '',
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
    const orderStr = form.get('order')?.toString();
    
    if (!orderStr) {
      return { success: false, error: 'Missing order data' };
    }
    
    const order = JSON.parse(orderStr);
    for (const { id, displayOrder } of order) {
      await prisma.blogContentBlock.update({
        where: { id },
        data: { displayOrder }
      });
    }
    return { success: true };
  }
};