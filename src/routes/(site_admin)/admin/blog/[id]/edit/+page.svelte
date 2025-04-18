<script>
  import { enhance } from '$app/forms';
  import { fade, fly } from 'svelte/transition';
  
  export let data;
  export let form;
  
  const { post, showCreatedMessage } = data;
  
  let title = form?.data?.title || post.title;
  let slug = form?.data?.slug || post.slug;
  let content = form?.data?.content || post.content;
  let excerpt = form?.data?.excerpt || post.excerpt || '';
  let published = form?.data?.published !== undefined ? form.data.published : post.published;
  
  let isSubmitting = false;
  let successMessage = showCreatedMessage ? 'Blog post created successfully!' : '';
  let formSuccess = false;
  
  // Auto-generate slug from title
  function generateSlug() {
    if (!title) return '';
    
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
      .trim();                   // Trim leading/trailing whitespace
  }
  
  // Clear success message after a few seconds
  if (successMessage) {
    setTimeout(() => {
      successMessage = '';
    }, 5000);
  }
</script>

<div>
  <!-- Header -->
  <div class="mb-6">
    <div class="flex items-center">
      <a 
        href="/admin/blog" 
        class="mr-4 text-blue-600 hover:text-blue-800"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </a>
      <h1 class="text-2xl font-semibold text-gray-900">Edit Blog Post</h1>
    </div>
    <p class="mt-1 text-sm text-gray-500">
      Created on {new Date(post.createdAt).toLocaleDateString()} by {post.author?.name || 'Unknown'}
    </p>
  </div>
  
  <!-- Success message -->
  {#if successMessage}
    <div class="mb-6 p-4 bg-green-100 text-green-700 rounded-md" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
      {successMessage}
    </div>
  {/if}
  
  <!-- Form success message -->
  {#if formSuccess}
    <div class="mb-6 p-4 bg-green-100 text-green-700 rounded-md" in:fly={{ y: -20, duration: 300 }} out:fade={{ duration: 200 }}>
      Blog post updated successfully!
    </div>
  {/if}
  
  <!-- Error alert -->
  {#if form?.error}
    <div class="mb-6 p-4 bg-red-100 text-red-700 rounded-md" in:fly={{ y: -20, duration: 300 }} out:fade={{ duration: 200 }}>
      {form.error}
    </div>
  {/if}
  
  <!-- Blog post form -->
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <form 
      method="POST"
      use:enhance={() => {
        isSubmitting = true;
        formSuccess = false;
        
        return async ({ result }) => {
          isSubmitting = false;
          
          if (result.type === 'success') {
            formSuccess = true;
            setTimeout(() => {
              formSuccess = false;
            }, 5000);
          }
        };
      }}
    >
      <div class="p-6 space-y-6">
        <!-- Title field -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            bind:value={title}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>
        
        <!-- Slug field -->
        <div>
          <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">
            Slug <span class="text-red-500">*</span>
          </label>
          <div class="flex">
            <input
              type="text"
              id="slug"
              name="slug"
              bind:value={slug}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="url-friendly-title"
            />
            <button
              type="button"
              class="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              on:click={() => { slug = generateSlug(); }}
            >
              Generate
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-500">
            The URL-friendly version of the title. Example: "my-blog-post"
          </p>
        </div>
        
        <!-- Excerpt field -->
        <div>
          <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            bind:value={excerpt}
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder="A brief summary of the post (optional)"
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">
            A short summary that appears in blog listings.
          </p>
        </div>
        
        <!-- Content field -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
            Content <span class="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            bind:value={content}
            rows="12"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
          ></textarea>
        </div>
        
        <!-- Published checkbox -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              type="checkbox"
              id="published"
              name="published"
              bind:checked={published}
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="published" class="font-medium text-gray-700">Published</label>
            <p class="text-gray-500">
              {#if published}
                This post is currently visible to the public
              {:else}
                This post is saved as a draft and not visible to the public
              {/if}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Form footer -->
      <div class="px-6 py-4 bg-gray-50 text-right space-x-2">
        <a
          href="/admin/blog"
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </a>
        {#if post.published}
          <a
            href="/blog/{post.slug}"
            target="_blank"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Post
          </a>
        {/if}
        <button
          type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Update Blog Post'}
        </button>
      </div>
    </form>
  </div>
</div>
