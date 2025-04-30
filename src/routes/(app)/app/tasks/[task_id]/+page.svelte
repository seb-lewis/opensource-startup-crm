<script>
  // UI only: example data for preview
  let task = {
    subject: 'Follow up with client',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2025-05-05',
    description: 'Call the client to discuss the proposal and next steps.',
    owner: { name: 'Alice', avatar: '/avatar1.png' },
    account: { name: 'Acme Corp' }
  };
  let users = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' }
  ];
  let accounts = [
    { id: 'a1', name: 'Acme Corp' },
    { id: 'a2', name: 'Globex' }
  ];
  // UI only: example comments
  let comments = [
    {
      id: 1,
      author: { name: 'Alice', avatar: '/avatar1.png' },
      content: 'Please update the client after the call.',
      createdAt: '2025-04-29T10:00:00Z'
    },
    {
      id: 2,
      author: { name: 'Bob', avatar: '/avatar2.png' },
      content: 'Will do! I will add a note here.',
      createdAt: '2025-04-29T12:30:00Z'
    }
  ];
  let newComment = '';
  let editing = false;

  function addComment() {
    if (!newComment.trim()) return;
    comments = [
      ...comments,
      {
        id: comments.length + 1,
        author: users[0], // Assume Alice for demo
        content: newComment,
        createdAt: new Date().toISOString()
      }
    ];
    newComment = '';
  }
</script>

<div class="max-w-2xl mx-auto p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-3">
      <button class="text-blue-600 hover:text-blue-800" aria-label="Back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-800">Task Details</h1>
    </div>
    <button class="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700" on:click={() => editing = !editing}>
      {editing ? 'Cancel' : 'Edit'}
    </button>
  </div>

  <!-- Task Detail View -->
  {#if !editing}
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
          <span class="ml-auto text-sm text-gray-500">Due: {task.dueDate}</span>
        </div>
        <h2 class="text-xl font-semibold text-blue-900">{task.subject}</h2>
        <p class="mt-2 text-gray-700">{task.description}</p>
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="text-sm text-gray-500">Owner</div>
          <div class="flex items-center gap-2 mt-1">
            {#if task.owner?.avatar}
              <img src={task.owner.avatar} alt={task.owner.name} class="w-7 h-7 rounded-full border" />
            {/if}
            <span class="font-medium">{task.owner?.name}</span>
          </div>
        </div>
        <div class="flex-1">
          <div class="text-sm text-gray-500">Account</div>
          <div class="mt-1 font-medium">{task.account?.name}</div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Task Edit Form -->
  {#if editing}
    <form class="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input type="text" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={task.subject} />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">{task.description}</textarea>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>High</option>
            <option>Normal</option>
            <option>Low</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input type="date" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={task.dueDate} />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Owner</label>
          <select class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {#each users as user}
              <option value={user.id}>{user.name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Account</label>
        <select class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {#each accounts as acc}
            <option value={acc.id}>{acc.name}</option>
          {/each}
        </select>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700" on:click={() => editing = false}>Cancel</button>
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">Save</button>
      </div>
    </form>
  {/if}

  <!-- Comments Section -->
  <div class="mt-10">
    <h2 class="text-lg font-semibold text-blue-900 mb-4">Comments</h2>
    <div class="space-y-4">
      {#each comments as c}
        <div class="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
          {#if c.author.avatar}
            <img src={c.author.avatar} alt={c.author.name} class="w-8 h-8 rounded-full border" />
          {/if}
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-800">{c.author.name}</span>
              <span class="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <div class="text-gray-700 mt-1">{c.content}</div>
          </div>
        </div>
      {/each}
    </div>
    <form class="mt-6 flex flex-col gap-2" on:submit|preventDefault={addComment}>
      <textarea
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="2"
        placeholder="Add a comment..."
        bind:value={newComment}
      ></textarea>
      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:opacity-50" disabled={!newComment.trim()}>
          Add Comment
        </button>
      </div>
    </form>
  </div>
</div>