<script>
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { ArrowLeft, Edit3, Calendar, User, Building2, MessageSquare, Send } from '@lucide/svelte';
  
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

<div class="min-h-screen bg-gray-50">
  <div class="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button 
            onclick={() => goto('/app/tasks/list')} 
            class="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            aria-label="Back to tasks"
          >
            <ArrowLeft class="w-4 h-4" />
          </button>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Task Details</h1>
            <p class="text-sm text-gray-600">View and manage task information</p>
          </div>
        </div>
        <button 
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors text-sm" 
          onclick={() => goto(`/app/tasks/${task.id}/edit`)}
        >
          <Edit3 class="w-4 h-4" />
          <span class="hidden sm:inline">Edit</span>
        </button>
      </div>
    </div>

    <!-- Task Detail Card -->
    {#if task}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <!-- Task Header -->
        <div class="p-4 border-b border-gray-100">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
              {task.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
              {task.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
              {task.status === 'Not Started' ? 'bg-gray-50 text-gray-700 border border-gray-200' : ''}">
              {task.status}
            </span>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
              {task.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
              {task.priority === 'Normal' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
              {task.priority === 'Low' ? 'bg-slate-50 text-slate-700 border border-slate-200' : ''}">
              {task.priority}
            </span>
            <div class="flex items-center gap-1.5 text-xs text-gray-600 ml-auto">
              <Calendar class="w-3.5 h-3.5" />
              <span>Due {formatDate(task.dueDate)}</span>
            </div>
          </div>
          
          <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{task.subject}</h2>
          
          {#if task.description}
            <p class="text-sm text-gray-700 leading-relaxed">{task.description}</p>
          {:else}
            <p class="text-sm text-gray-500 italic">No description provided</p>
          {/if}
        </div>

        <!-- Task Meta Information -->
        <div class="p-4 bg-gray-50">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Owner -->
            <div class="space-y-1.5">
              <div class="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <User class="w-3.5 h-3.5" />
                <span>Task Owner</span>
              </div>
              <div class="flex items-center gap-2.5">
                {#if task.owner?.profilePhoto}
                  <img 
                    src={task.owner.profilePhoto} 
                    alt={task.owner.name} 
                    class="w-8 h-8 rounded-full border border-white shadow-sm" 
                    referrerpolicy="no-referrer" 
                  />
                {:else}
                  <div class="w-8 h-8 rounded-full bg-blue-100 border border-white shadow-sm flex items-center justify-center">
                    <span class="text-xs font-medium text-blue-700">
                      {task.owner?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                {/if}
                <div>
                  <div class="text-sm font-medium text-gray-900">{task.owner?.name || 'Unassigned'}</div>
                  <div class="text-xs text-gray-500">Owner</div>
                </div>
              </div>
            </div>

            <!-- Account -->
            <div class="space-y-1.5">
              <div class="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <Building2 class="w-3.5 h-3.5" />
                <span>Related Account</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Building2 class="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{task.account?.name || 'No account assigned'}</div>
                  <div class="text-xs text-gray-500">Account</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <MessageSquare class="w-4 h-4 text-gray-600" />
            <h2 class="text-base font-semibold text-gray-900">Comments</h2>
            {#if task.comments && task.comments.length > 0}
              <span class="text-xs text-gray-500">({task.comments.length})</span>
            {/if}
          </div>
        </div>

        <div class="p-4">
          {#if form?.message}
            <div class="mb-4 p-3 rounded-lg {form.error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}">
              <p class="text-xs font-medium">{form.message}</p>
            </div>
          {/if}
          
          {#if form?.commentBody && form.error}
            {@const _ = newComment = form.commentBody}
          {/if}

          <!-- Comments List -->
          <div class="space-y-3 mb-6">
            {#if task.comments && task.comments.length > 0}
              {#each task.comments as c (c.id || c.createdAt)}
                <div class="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  {#if c.author.profilePhoto}
                    <img 
                      src={c.author.profilePhoto} 
                      alt={c.author.name} 
                      class="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0" 
                      referrerpolicy="no-referrer" 
                    />
                  {:else}
                    <div class="w-8 h-8 rounded-full bg-blue-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <span class="text-xs font-medium text-blue-700">
                        {c.author?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  {/if}
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-sm font-medium text-gray-900">{c.author.name}</span>
                      <span class="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <div class="text-sm text-gray-700 leading-relaxed">{c.body}</div>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="text-center py-6">
                <MessageSquare class="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p class="text-sm text-gray-500 font-medium">No comments yet</p>
                <p class="text-xs text-gray-400">Be the first to add a comment</p>
              </div>
            {/if}
          </div>

          <!-- Add Comment Form -->
          <form method="POST" action="?/addComment" use:enhance class="space-y-3">
            <div>
              <label for="commentBody" class="block text-xs font-medium text-gray-700 mb-1.5">
                Add a comment
              </label>
              <textarea
                id="commentBody"
                name="commentBody"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
                rows="2"
                placeholder="Share your thoughts or updates..."
                bind:value={newComment}
                required
              ></textarea>
            </div>
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm" 
                disabled={!newComment.trim()}
              >
                <Send class="w-3.5 h-3.5" />
                Add Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    {/if}
  </div>
</div>