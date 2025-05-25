<script>
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  export let data;
  /** @type {import('./$types').ActionData} */
  export let form;

  // Reactive assignment for task to allow modifications in edit mode
  $: task = data.task;
  // Comments are now part of the task object from the server

  let newComment = '';

  // The addComment function is no longer needed here,
  // form submission with `enhance` will handle it.

  // Helper to format date for display, if not already a string
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    // If it's already YYYY-MM-DD, it's fine. Otherwise, format it.
    try {
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString; // Fallback to original string if not a valid date
    }
  }
</script>

<div class="max-w-2xl mx-auto p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-3">
      <button onclick={() => goto('/app/tasks/list')} class="text-blue-600 hover:text-blue-800" aria-label="Back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-800">Task Details</h1>
    </div>
    <button 
      class="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700" 
      onclick={() => goto(`/app/tasks/${task.id}/edit`)}
    >
      Edit
    </button>
  </div>

  <!-- Task Detail View -->
  {#if task}
    <div class="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="inline-block px-2 py-1 rounded text-xs font-semibold
            {task.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
            {task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : ''}
            {task.status === 'Not Started' ? 'bg-gray-100 text-gray-700' : ''}">
            {task.status}
          </span>
          <span class="inline-block px-2 py-1 rounded text-xs font-semibold
            {task.priority === 'High' ? 'bg-red-100 text-red-700' : ''}
            {task.priority === 'Normal' ? 'bg-blue-100 text-blue-700' : ''}
            {task.priority === 'Low' ? 'bg-gray-100 text-gray-700' : ''}">
            {task.priority}
          </span>
          <span class="ml-auto text-sm text-gray-500">Due: {formatDate(task.dueDate)}</span>
        </div>
        <h2 class="text-xl font-semibold text-blue-900">{task.subject}</h2>
        <p class="mt-2 text-gray-700">{task.description || 'No description provided.'}</p>
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="text-sm text-gray-500">Owner</div>
          <div class="flex items-center gap-2 mt-1">
            {#if task.owner?.profilePhoto}
              <img src={task.owner.profilePhoto} alt={task.owner.name} class="w-7 h-7 rounded-full border" referrerpolicy="no-referrer" />
            {:else}
              <div class="w-7 h-7 rounded-full border bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                {task.owner?.name?.charAt(0) || 'U'}
              </div>
            {/if}
            <span class="font-medium">{task.owner?.name || 'Unassigned'}</span>
          </div>
        </div>
        <div class="flex-1">
          <div class="text-sm text-gray-500">Account</div>
          <div class="mt-1 font-medium">{task.account?.name || 'N/A'}</div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Comments Section -->
  {#if task}
  <div class="mt-10">
    <h2 class="text-lg font-semibold text-blue-900 mb-4">Comments</h2>

    {#if form?.message}
      <div class="p-3 my-2 rounded-md {form.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
        <p>{form.message}</p>
      </div>
    {/if}
    {#if form?.commentBody && form.error} <!-- Preserve comment body on error if returned by action -->
      {@const _ = newComment = form.commentBody}
    {/if}

    <div class="space-y-4">
      {#if task.comments && task.comments.length > 0}
        {#each task.comments as c (c.id || c.createdAt) } <!-- Use a unique key, c.id if available from backend, else c.createdAt for client-added -->
          <div class="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
            {#if c.author.profilePhoto}
              <img src={c.author.profilePhoto} alt={c.author.name} class="w-8 h-8 rounded-full border" referrerpolicy="no-referrer" />
            {:else}
              <div class="w-8 h-8 rounded-full border bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                {c.author?.name?.charAt(0) || 'U'}
              </div>
            {/if}
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-800">{c.author.name}</span>
                <span class="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <div class="text-gray-700 mt-1">{c.body}</div> <!-- Changed from c.content to c.body -->
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-gray-500">No comments yet.</p>
      {/if}
    </div>
    <form class="mt-6 flex flex-col gap-2" method="POST" action="?/addComment" use:enhance>
      <textarea
        name="commentBody"
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="2"
        placeholder="Add a comment..."
        bind:value={newComment}
        required
      ></textarea>
      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:opacity-50" disabled={!newComment.trim()}>
          Add Comment
        </button>
      </div>
    </form>
  </div>
  {/if}
</div>