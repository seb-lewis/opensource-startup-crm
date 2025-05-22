<script>
  // UI state only, no backend logic
  let showModal = false;
  let modalMode = 'create'; // or 'edit'
  let selectedTask = null;

  // Example static data for UI preview
  let tasks = [
    {
      id: '1',
      subject: 'Follow up with client',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2025-05-05',
      owner: { name: 'Alice' },
      account: { name: 'Acme Corp' }
    },
    {
      id: '2',
      subject: 'Prepare proposal',
      status: 'Not Started',
      priority: 'Normal',
      dueDate: '2025-05-10',
      owner: { name: 'Bob' },
      account: { name: 'Globex' }
    }
  ];

  function openModal(mode, task = null) {
    modalMode = mode;
    selectedTask = task;
    showModal = true;
  }
  function closeModal() {
    showModal = false;
    selectedTask = null;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Tasks</h1>
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
      on:click={() => openModal('create')}
    >
      + New Task
    </button>
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
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each tasks as task}
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-3 font-medium text-gray-800">{task.subject}</td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-1 rounded text-xs font-semibold
                {task.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                {task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : ''}
                {task.status === 'Not Started' ? 'bg-gray-100 text-gray-700' : ''}
              ">
                {task.status}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-1 rounded text-xs font-semibold
                {task.priority === 'High' ? 'bg-red-100 text-red-700' : ''}
                {task.priority === 'Normal' ? 'bg-blue-100 text-blue-700' : ''}
                {task.priority === 'Low' ? 'bg-gray-100 text-gray-700' : ''}
              ">
                {task.priority}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{task.dueDate}</td>
            <td class="px-4 py-3 text-gray-700">{task.owner?.name}</td>
            <td class="px-4 py-3 text-gray-700">{task.account?.name}</td>
            <td class="px-4 py-3 flex gap-2">
              <button
                class="text-blue-600 hover:underline"
                on:click={() => openModal('edit', task)}
                aria-label="Edit"
              >Edit</button>
              <button
                class="text-red-600 hover:underline"
                aria-label="Delete"
                disabled
                title="Delete (UI only)"
              >Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if tasks.length === 0}
      <div class="p-8 text-center text-gray-400">No tasks found.</div>
    {/if}
  </div>
</div>

{#if showModal}
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fade-in">
      <button
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        on:click={closeModal}
        aria-label="Close"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <h2 class="text-xl font-semibold mb-4">
        {modalMode === 'create' ? 'Create Task' : 'Edit Task'}
      </h2>
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input type="text" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Task subject" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>High</option>
              <option>Normal</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input type="date" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Owner</label>
            <input type="text" class="w-full border rounded px-3 py-2" placeholder="Owner name" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Account</label>
            <input type="text" class="w-full border rounded px-3 py-2" placeholder="Account name" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Task details"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700" on:click={closeModal}>Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">Save</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Optional: fade-in animation for modal */
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px);}
    to { opacity: 1; transform: translateY(0);}
  }
  .animate-fade-in {
    animation: fade-in 0.2s ease;
  }
</style>