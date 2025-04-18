<script lang="ts">
  export let data;
  let comment = '';
  let errorMsg = '';
</script>

<section class="container mx-auto p-4 max-w-3xl">
  <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      Case Details
    </h1>
    <div class="flex gap-2">
      <a href="/app/cases/{data.caseItem.id}/edit" class="btn btn-outline">Edit</a>
      <form method="POST" action="?/delete" style="display:inline"><button class="btn btn-error">Delete</button></form>
    </div>
  </div>
  <div class="bg-white rounded shadow p-6 mb-6">
    <div class="flex flex-col md:flex-row md:items-center md:gap-8 mb-4">
      <div class="flex-1">
        <div class="text-2xl font-semibold mb-1">{data.caseItem.subject}</div>
        <div class="text-gray-500 mb-2">{data.caseItem.description}</div>
        <div class="flex flex-wrap gap-4 text-sm">
          <div><span class="font-semibold">Account:</span> {data.caseItem.account?.name}</div>
          <div><span class="font-semibold">Assigned to:</span> {data.caseItem.owner?.name}</div>
          <div><span class="font-semibold">Due date:</span> {data.caseItem.dueDate ? (new Date(data.caseItem.dueDate)).toLocaleDateString() : '-'}</div>
          <div><span class="font-semibold">Priority:</span> <span class="px-2 py-1 rounded text-xs font-medium {data.caseItem.priority === 'High' ? 'bg-red-100 text-red-800' : data.caseItem.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">{data.caseItem.priority}</span></div>
          <div><span class="font-semibold">Status:</span> <span class="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">{data.caseItem.status}</span></div>
        </div>
      </div>
    </div>
    <div class="border-t pt-4 mt-4">
      <h2 class="text-lg font-semibold mb-2">Activity</h2>
      <ul class="space-y-1 text-sm">
        <li class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-green-400"></span>
          <span class="font-medium">Created</span> on {(new Date(data.caseItem.createdAt)).toLocaleDateString()}
        </li>
        {#if data.caseItem.updatedAt && data.caseItem.updatedAt !== data.caseItem.createdAt}
        <li class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
          <span class="font-medium">Updated</span> on {(new Date(data.caseItem.updatedAt)).toLocaleDateString()}
        </li>
        {/if}
        {#if data.caseItem.closedAt}
        <li class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
          <span class="font-medium">Closed</span> on {(new Date(data.caseItem.closedAt)).toLocaleDateString()}
        </li>
        {/if}
      </ul>
    </div>
  </div>
  <div class="bg-white rounded shadow p-4">
    <h2 class="text-lg font-semibold mb-2">Comments</h2>
    <div class="space-y-2 mb-4">
      {#if data.caseItem.comments && data.caseItem.comments.length}
        {#each data.caseItem.comments as c}
          <div class="p-2 bg-gray-50 rounded flex items-center gap-2">
            <span class="inline-block w-7 h-7 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-sm">{c.author?.name?.[0]}</span>
            <div>
              <div class="font-medium">{c.author?.name}</div>
              <div class="text-xs text-gray-400">{(new Date(c.createdAt)).toLocaleDateString()}</div>
              <div>{c.body}</div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="p-2 bg-gray-50 rounded">No comments yet.</div>
      {/if}
    </div>
    <form method="POST" action="?/comment" class="flex gap-2">
      <input type="text" class="input input-bordered flex-1" placeholder="Add a comment..." bind:value={comment} name="body" required />
      <button class="btn btn-primary">Post</button>
    </form>
    {#if errorMsg}
      <div class="text-red-500 mt-2">{errorMsg}</div>
    {/if}
  </div>
</section>
