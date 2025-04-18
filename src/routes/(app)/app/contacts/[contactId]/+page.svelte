<script>
  export let data;
  const { contact } = data;

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
</script>

<div class="p-4 max-w-3xl mx-auto">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div class="flex items-center gap-3">
      <a href="/app/accounts/{contact.accountId}" class="text-gray-500 hover:text-blue-600 flex items-center">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to Account
      </a>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{contact.firstName} {contact.lastName}</h1>
      {#if contact.isPrimary}
        <span class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Primary</span>
      {/if}
    </div>
    <a href="/app/contacts/{contact.id}/edit" class="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</a>
  </div>

  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h3 class="text-sm font-medium text-gray-500">Title</h3>
      <p class="text-base text-gray-900 dark:text-white">{contact.title || 'N/A'}</p>
    </div>
    <div>
      <h3 class="text-sm font-medium text-gray-500">Role</h3>
      <p class="text-base text-gray-900 dark:text-white">{contact.role || 'N/A'}</p>
    </div>
    <div>
      <h3 class="text-sm font-medium text-gray-500">Email</h3>
      {#if contact.email}
        <a href="mailto:{contact.email}" class="text-blue-600 hover:underline">{contact.email}</a>
      {:else}
        <span>N/A</span>
      {/if}
    </div>
    <div>
      <h3 class="text-sm font-medium text-gray-500">Phone</h3>
      {#if contact.phone}
        <a href="tel:{contact.phone}" class="text-blue-600 hover:underline">{contact.phone}</a>
      {:else}
        <span>N/A</span>
      {/if}
    </div>
    <div>
      <h3 class="text-sm font-medium text-gray-500">Account</h3>
      <a href="/app/accounts/{contact.accountId}" class="text-blue-600 hover:underline">{contact.account?.name || 'N/A'}</a>
    </div>
    <div>
      <h3 class="text-sm font-medium text-gray-500">Created</h3>
      <p class="text-base text-gray-900 dark:text-white">{formatDate(contact.createdAt)}</p>
    </div>
    <div>
      <h3 class="text-sm font-medium text-gray-500">Last Updated</h3>
      <p class="text-base text-gray-900 dark:text-white">{formatDate(contact.updatedAt)}</p>
    </div>
  </div>

  {#if contact.activities && contact.activities.length}
    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-4">Recent Activities</h2>
      <ul class="divide-y divide-gray-200">
        {#each contact.activities as activity}
          <li class="py-3">
            <div class="flex justify-between">
              <span>{activity.type}</span>
              <span class="text-sm text-gray-500">{formatDate(activity.date)}</span>
            </div>
            <div class="text-gray-700">{activity.description}</div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
