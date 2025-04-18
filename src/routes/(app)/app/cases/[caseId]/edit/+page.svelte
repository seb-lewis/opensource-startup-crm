<script lang="ts">
  export let data;
  import { enhance } from '$app/forms';
  let title = data.caseItem.subject;
  let description = data.caseItem.description || '';
  let accountId = data.caseItem.accountId;
  let dueDate = data.caseItem.dueDate ? data.caseItem.dueDate.split('T')[0] : '';
  let assignedId = data.caseItem.ownerId;
  let priority = data.caseItem.priority || 'Medium';
  let errorMsg = '';
</script>

<section class="container mx-auto p-4 max-w-xl">
  <h1 class="text-xl font-semibold mb-4">Edit Case</h1>
  <form method="POST" action="?/update" use:enhance class="space-y-4 bg-white rounded shadow p-6">
    <div>
      <label for="title" class="block mb-1 font-medium">Title <span class="text-red-500">*</span></label>
      <input id="title" type="text" class="input input-bordered w-full" required bind:value={title} name="title" />
    </div>
    <div>
      <label for="description" class="block mb-1 font-medium">Description</label>
      <textarea id="description" class="textarea textarea-bordered w-full" rows="4" bind:value={description} name="description"></textarea>
    </div>
    <div>
      <label for="accountId" class="block mb-1 font-medium">Account <span class="text-red-500">*</span></label>
      <select id="accountId" class="select select-bordered w-full" bind:value={accountId} name="accountId" required>
        <option value="">-- Select Account --</option>
        {#each data.accounts as acc}
          <option value={acc.id}>{acc.name}</option>
        {/each}
      </select>
    </div>
    <div class="flex gap-4">
      <div class="flex-1">
        <label for="dueDate" class="block mb-1 font-medium">Due Date</label>
        <input id="dueDate" type="date" class="input input-bordered w-full" bind:value={dueDate} name="dueDate" />
      </div>
      <div class="flex-1">
        <label for="assignedId" class="block mb-1 font-medium">Assign To <span class="text-red-500">*</span></label>
        <select id="assignedId" class="select select-bordered w-full" bind:value={assignedId} name="assignedId" required>
          <option value="">-- Select User --</option>
          {#each data.users as u}
            <option value={u.id}>{u.name}</option>
          {/each}
        </select>
      </div>
    </div>
    <div>
      <label for="priority" class="block mb-1 font-medium">Priority</label>
      <select id="priority" class="select select-bordered w-full" bind:value={priority} name="priority">
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
    {#if errorMsg}
      <div class="text-red-500">{errorMsg}</div>
    {/if}
    <button type="submit" class="btn btn-primary w-full">Save Changes</button>
  </form>
  <form method="POST" action="?/close" class="mt-6">
    <button type="submit" class="btn btn-warning w-full" disabled={data.caseItem.status === 'CLOSED'}>
      {data.caseItem.status === 'CLOSED' ? 'Case Closed' : 'Close Case'}
    </button>
  </form>
</section>
