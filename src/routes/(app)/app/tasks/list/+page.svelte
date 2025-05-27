<script>
  import { Plus, Calendar, User, Building2, Edit3, Trash2, Clock, AlertCircle, CheckCircle2, PlayCircle, Pause, XCircle } from '@lucide/svelte';
  
  export let data;

  // Function to format date, can be moved to a utility file if used elsewhere
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'Completed': return CheckCircle2;
      case 'In Progress': return PlayCircle;
      case 'Not Started': return Pause;
      case 'Waiting on someone else': return Clock;
      case 'Deferred': return XCircle;
      default: return AlertCircle;
    }
  }

  function getPriorityIcon(priority) {
    switch (priority) {
      case 'High': return AlertCircle;
      case 'Normal': return Clock;
      case 'Low': return Clock;
      default: return Clock;
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
          <p class="mt-2 text-sm text-gray-600">Manage and track your team's tasks</p>
        </div>
        <a
          href="/app/tasks/new"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
        >
          <Plus size={20} />
          New Task
        </a>
      </div>
    </div>

    <!-- Tasks Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {#if data.tasks.length === 0}
        <div class="text-center py-16">
          <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} class="text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p class="text-gray-500 mb-6">Get started by creating your first task</p>
          <a
            href="/app/tasks/new"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
          >
            <Plus size={20} />
            Create Task
          </a>
        </div>
      {:else}
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each data.tasks as task (task.id)}
                <tr class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-6 py-4">
                    <div class="flex items-start">
                      <div class="min-w-0 flex-1">
                        <a 
                          href="/app/tasks/{task.id}" 
                          class="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {task.subject}
                        </a>
                        {#if task.description}
                          <p class="text-sm text-gray-500 mt-1 truncate max-w-xs">
                            {task.description}
                          </p>
                        {/if}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <svelte:component 
                        this={getStatusIcon(task.status)} 
                        size={16} 
                        class={
                          task.status === 'Completed' ? 'text-green-500' :
                          task.status === 'In Progress' ? 'text-yellow-500' :
                          task.status === 'Not Started' ? 'text-gray-400' :
                          task.status === 'Waiting on someone else' ? 'text-purple-500' :
                          task.status === 'Deferred' ? 'text-pink-500' : 'text-gray-400'
                        }
                      />
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        {task.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                        {task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                        {task.status === 'Not Started' ? 'bg-gray-100 text-gray-800' : ''}
                        {task.status === 'Waiting on someone else' ? 'bg-purple-100 text-purple-800' : ''}
                        {task.status === 'Deferred' ? 'bg-pink-100 text-pink-800' : ''}
                      ">
                        {task.status || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <svelte:component 
                        this={getPriorityIcon(task.priority)} 
                        size={16} 
                        class={
                          task.priority === 'High' ? 'text-red-500' :
                          task.priority === 'Normal' ? 'text-blue-500' :
                          task.priority === 'Low' ? 'text-gray-400' : 'text-gray-400'
                        }
                      />
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        {task.priority === 'High' ? 'bg-red-100 text-red-800' : ''}
                        {task.priority === 'Normal' ? 'bg-blue-100 text-blue-800' : ''}
                        {task.priority === 'Low' ? 'bg-gray-100 text-gray-800' : ''}
                      ">
                        {task.priority || 'Normal'}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar size={16} class="text-gray-400" />
                      {formatDate(task.dueDate)}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <User size={16} class="text-gray-400" />
                      <span class="text-sm text-gray-900">{task.owner?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <Building2 size={16} class="text-gray-400" />
                      <span class="text-sm text-gray-900">{task.account?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <a
                        href="/app/tasks/{task.id}/edit"
                        class="inline-flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors p-1"
                        aria-label="Edit Task"
                      >
                        <Edit3 size={16} />
                      </a>
                      <button
                        class="inline-flex items-center gap-1 text-gray-400 p-1 cursor-not-allowed"
                        disabled
                        title="Delete (functionality to be implemented)"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden">
          {#each data.tasks as task (task.id)}
            <div class="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start justify-between mb-3">
                <div class="min-w-0 flex-1">
                  <a 
                    href="/app/tasks/{task.id}" 
                    class="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors block"
                  >
                    {task.subject}
                  </a>
                  {#if task.description}
                    <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  {/if}
                </div>
                <div class="flex items-center gap-2 ml-4">
                  <a
                    href="/app/tasks/{task.id}/edit"
                    class="text-gray-400 hover:text-blue-600 transition-colors p-1"
                  >
                    <Edit3 size={16} />
                  </a>
                  <button class="text-gray-300 p-1 cursor-not-allowed" disabled>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2 mb-3">
                <div class="flex items-center gap-1">
                  <svelte:component 
                    this={getStatusIcon(task.status)} 
                    size={14} 
                    class={
                      task.status === 'Completed' ? 'text-green-500' :
                      task.status === 'In Progress' ? 'text-yellow-500' :
                      task.status === 'Not Started' ? 'text-gray-400' :
                      task.status === 'Waiting on someone else' ? 'text-purple-500' :
                      task.status === 'Deferred' ? 'text-pink-500' : 'text-gray-400'
                    }
                  />
                  <span class="text-xs px-2 py-1 rounded-full font-medium
                    {task.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                    {task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : ''}
                    {task.status === 'Not Started' ? 'bg-gray-100 text-gray-700' : ''}
                    {task.status === 'Waiting on someone else' ? 'bg-purple-100 text-purple-700' : ''}
                    {task.status === 'Deferred' ? 'bg-pink-100 text-pink-700' : ''}
                  ">
                    {task.status || 'N/A'}
                  </span>
                </div>
                
                <div class="flex items-center gap-1">
                  <svelte:component 
                    this={getPriorityIcon(task.priority)} 
                    size={14} 
                    class={
                      task.priority === 'High' ? 'text-red-500' :
                      task.priority === 'Normal' ? 'text-blue-500' :
                      task.priority === 'Low' ? 'text-gray-400' : 'text-gray-400'
                    }
                  />
                  <span class="text-xs px-2 py-1 rounded-full font-medium
                    {task.priority === 'High' ? 'bg-red-100 text-red-700' : ''}
                    {task.priority === 'Normal' ? 'bg-blue-100 text-blue-700' : ''}
                    {task.priority === 'Low' ? 'bg-gray-100 text-gray-700' : ''}
                  ">
                    {task.priority || 'Normal'}
                  </span>
                </div>
              </div>
              
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center gap-2 text-gray-600">
                  <Calendar size={14} class="text-gray-400" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <User size={14} class="text-gray-400" />
                  <span>{task.owner?.name || 'Unassigned'}</span>
                </div>
                {#if task.account?.name}
                  <div class="flex items-center gap-2 text-gray-600">
                    <Building2 size={14} class="text-gray-400" />
                    <span>{task.account.name}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
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