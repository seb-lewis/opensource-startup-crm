<script>
  export let data;

  // Function to format date, can be moved to a utility file if used elsewhere
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Tasks</h1>
    <a
      href="/app/tasks/new"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
    >
      + New Task
    </a>
  </div>

  <div class="overflow-x-auto bg-white rounded shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Related Account</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each data.tasks as task (task.id)}
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-3 font-medium text-gray-800">
              <a href="/app/tasks/{task.id}" class="text-blue-600 hover:underline">
                {task.subject}
              </a>
            </td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-1 rounded text-xs font-semibold
                {task.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                {task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : ''}
                {task.status === 'Not Started' ? 'bg-gray-100 text-gray-700' : ''}
                {task.status === 'Waiting on someone else' ? 'bg-purple-100 text-purple-700' : ''}
                {task.status === 'Deferred' ? 'bg-pink-100 text-pink-700' : ''}
              ">
                {task.status || 'N/A'}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-1 rounded text-xs font-semibold
                {task.priority === 'High' ? 'bg-red-100 text-red-700' : ''}
                {task.priority === 'Normal' ? 'bg-blue-100 text-blue-700' : ''}
                {task.priority === 'Low' ? 'bg-gray-100 text-gray-700' : ''}
              ">
                {task.priority || 'N/A'}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{formatDate(task.dueDate)}</td>
            <td class="px-4 py-3 text-gray-700">{task.owner?.name || 'N/A'}</td>
            <td class="px-4 py-3 text-gray-700">{task.account?.name || 'N/A'}</td>
            <td class="px-4 py-3 flex gap-2">
              <a
                href="/app/tasks/{task.id}/edit"
                class="text-blue-600 hover:underline"
                aria-label="Edit Task"
              >Edit</a>
              <button
                class="text-red-600 hover:underline"
                aria-label="Delete"
                disabled
                title="Delete (functionality to be implemented)"
              >Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if data.tasks.length === 0}
      <div class="p-8 text-center text-gray-400">No tasks found. Create one!</div>
    {/if}
  </div>
</div>

<style>
  /* Optional: fade-in animation for modal (can be removed if no other modals use it) */
  /* Or keep if edit modal will use it */
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px);}
    to { opacity: 1; transform: translateY(0);}
  }
  
</style>