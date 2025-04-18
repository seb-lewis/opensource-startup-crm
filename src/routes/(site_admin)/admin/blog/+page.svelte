<script>
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { fade } from 'svelte/transition';
  
  export let data;
  
  let { posts } = data;
  let showDeleteModal = false;
  let postToDelete = null;
  let isDeleting = false;
  let errorMessage = '';
  let successMessage = '';
  
  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Open delete confirmation modal
  function confirmDelete(post) {
    postToDelete = post;
    showDeleteModal = true;
  }
  
  // Close delete modal
  function cancelDelete() {
    showDeleteModal = false;
    postToDelete = null;
  }
  
  // Show success message for a few seconds
  function showSuccess(message) {
    successMessage = message;
    setTimeout(() => {
      successMessage = '';
    }, 3000);
  }
</script>

<div>
  <!-- Header with add button -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-semibold text-gray-900">Blog Posts</h1>
    <a 
      href="/admin/blog/new" 
      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Add New Post
    </a>
  </div>
  
  <!-- Success message -->
  {#if successMessage}
    <div class="mb-4 p-3 bg-green-100 text-green-800 rounded" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
      {successMessage}
    </div>
  {/if}
  
  <!-- Error message -->
  {#if errorMessage}
    <div class="mb-4 p-3 bg-red-100 text-red-800 rounded" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
      {errorMessage}
    </div>
  {/if}
  
  <!-- Blog posts table -->
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#if posts && posts.length > 0}
            {#each posts as post}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {post.title}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.slug}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.author?.name || 'Unknown'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  {#if post.published}
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Published
                    </span>
                  {:else}
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Draft
                    </span>
                  {/if}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(post.updatedAt)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <!-- View button -->
                    <a href="/blog/{post.slug}" target="_blank" class="text-blue-600 hover:text-blue-900">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </a>
                    <!-- Edit button -->
                    <a href="/admin/blog/{post.id}/edit" class="text-yellow-600 hover:text-yellow-900">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </a>
                    <!-- Delete button -->
                    <button 
                      type="button" 
                      class="text-red-600 hover:text-red-900" 
                      on:click={() => confirmDelete(post)}
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
                No blog posts found. <a href="/admin/blog/new" class="text-blue-600 hover:underline">Create your first post</a>.
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Delete confirmation modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" transition:fade={{ duration: 150 }}>
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
      <p class="text-sm text-gray-500 mb-4">
        Are you sure you want to delete the post "{postToDelete?.title}"? This action cannot be undone.
      </p>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
          on:click={cancelDelete}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <form
          method="POST"
          action="?/delete"
          use:enhance={() => {
            isDeleting = true;
            
            return async ({ result }) => {
              isDeleting = false;
              showDeleteModal = false;
              
              if (result.type === 'success') {
                showSuccess('Blog post deleted successfully');
                await invalidateAll();
              } else {
                errorMessage = result.data?.error || 'Failed to delete blog post';
                setTimeout(() => {
                  errorMessage = '';
                }, 3000);
              }
            };
          }}
        >
          <input type="hidden" name="id" value={postToDelete?.id || ''} />
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </form>
      </div>
    </div>
  </div>
{/if}
