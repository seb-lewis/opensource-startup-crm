<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  export let data;
  
  let { accounts, pagination } = data;
  let sortField = $page.url.searchParams.get('sort') || 'name';
  let sortOrder = $page.url.searchParams.get('order') || 'asc';
  let isLoading = false;
  let statusFilter = $page.url.searchParams.get('status') || 'all';
  
  function updateQueryParams() {
    isLoading = true;
    const params = new URLSearchParams($page.url.searchParams);
    params.set('sort', sortField);
    params.set('order', sortOrder);
    params.set('status', statusFilter); // ensure status is included
    params.set('page', '1'); // Reset to first page when filters change
    
    goto(`?${params.toString()}`, { keepFocus: true });
  }
  
  function changePage(newPage) {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', newPage.toString());
    goto(`?${params.toString()}`, { keepFocus: true });
  }
  
  function toggleSort(field) {
    if (sortField === field) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortOrder = 'asc';
    }
    updateQueryParams();
  }
  
  // Update data when it changes from the server
  $: {
    accounts = data.accounts;
    pagination = data.pagination;
    isLoading = false;
  }
</script>

<div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <div class="sm:flex sm:items-center sm:justify-between pb-4">
    <div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h3>
      <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
        Manage all your customer accounts and business relationships
      </p>
    </div>
    <div class="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 items-center">
      <input
        type="text"
        placeholder="Search accounts..."
        class="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:input={(e) => { $page.url.searchParams.set('q', e.target.value); goto(`?${$page.url.searchParams.toString()}`); }}
        value={$page.url.searchParams.get('q') || ''}
      />
      <select
        class="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style="width: 90px;"
        bind:value={statusFilter}
        on:change={updateQueryParams}
      >
        <option value="all">All</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
      <a href="/app/accounts/new" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        + New Account
      </a>
    </div>
  </div>
  
  <!-- Accounts table -->
  <div class="relative overflow-x-auto rounded-lg mt-4">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3 cursor-pointer" on:click={() => toggleSort('name')}>
            <div class="flex items-center">
              Account Name
              {#if sortField === 'name'}
                <svg class="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  {#if sortOrder === 'asc'}
                  <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
                  {:else}
                  <path d="M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10z"></path>
                  {/if}
                </svg>
              {/if}
            </div>
          </th>
          <th scope="col" class="px-6 py-3 cursor-pointer hidden sm:table-cell" on:click={() => toggleSort('industry')}>
            <div class="flex items-center">
              Industry
              {#if sortField === 'industry'}
                <svg class="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  {#if sortOrder === 'asc'}
                  <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
                  {:else}
                  <path d="M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10z"></path>
                  {/if}
                </svg>
              {/if}
            </div>
          </th>
          <th scope="col" class="px-6 py-3 cursor-pointer hidden md:table-cell" on:click={() => toggleSort('type')}>
            <div class="flex items-center">
              Type
              {#if sortField === 'type'}
                <svg class="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  {#if sortOrder === 'asc'}
                  <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
                  {:else}
                  <path d="M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10z"></path>
                  {/if}
                </svg>
              {/if}
            </div>
          </th>
          <th scope="col" class="px-6 py-3 hidden lg:table-cell">Website</th>
          <th scope="col" class="px-6 py-3 hidden xl:table-cell">Phone</th>
          <th scope="col" class="px-6 py-3 hidden md:table-cell">Contacts</th>
          <th scope="col" class="px-6 py-3 hidden md:table-cell">Opportunities</th>
          <th scope="col" class="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if isLoading}
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td colspan="8" class="px-6 py-16 text-center">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
              <p class="mt-2 text-gray-500 dark:text-gray-400">Loading accounts...</p>
            </td>
          </tr>
        {:else if accounts.length === 0}
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td colspan="8" class="px-6 py-16 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p class="mt-2 text-gray-500 dark:text-gray-400">No accounts found</p>
            </td>
          </tr>
        {:else}
          {#each accounts as account}
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 {account.closedAt ? 'opacity-60' : ''}">
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <a href="/app/accounts/{account.id}" class="hover:underline hover:text-blue-600 dark:hover:text-blue-500 flex items-center gap-2">
                  <span class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-gray-500 text-xs font-bold">
                    {account.name?.[0]}
                  </span>
                  {account.name}
                  {#if account.closedAt}
                    <span class="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Closed</span>
                  {/if}
                </a>
              </td>
              <td class="px-6 py-4 hidden sm:table-cell">{account.industry || '-'}</td>
              <td class="px-6 py-4 hidden md:table-cell">{account.type || '-'}</td>
              <td class="px-6 py-4 hidden lg:table-cell">
                {#if account.website}
                  <a href={account.website.startsWith('http') ? account.website : `https://${account.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     class="text-blue-600 dark:text-blue-500 hover:underline">
                    {account.website}
                  </a>
                {:else}
                  -
                {/if}
              </td>
              <td class="px-6 py-4 hidden xl:table-cell">{account.phone || '-'}</td>
              <td class="px-6 py-4 hidden md:table-cell">{account.contactCount}</td>
              <td class="px-6 py-4 hidden md:table-cell">{account.opportunityCount}</td>
              <td class="px-6 py-4 text-right flex gap-2 justify-end">
                <a href="/app/accounts/{account.id}" title="View" aria-label="View Account" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </a>
                <a href="/app/accounts/{account.id}/edit" title="Edit" aria-label="Edit Account" class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m-1 0v14m-7-7h14" /></svg>
                </a>
                <a href="/app/accounts/{account.id}/delete" title="Delete" aria-label="Delete Account" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </a>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  
  <!-- Pagination -->
  {#if pagination.totalPages > 1}
    <div class="flex flex-col md:flex-row items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="text-sm text-gray-700 dark:text-gray-400 mb-4 md:mb-0">
        Showing <span class="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to 
        <span class="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of 
        <span class="font-medium">{pagination.total}</span> accounts
      </div>
      <div class="inline-flex space-x-2">
        <button 
          on:click={() => changePage(1)}
          class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pagination.page === 1}
        >
          First
        </button>
        <button 
          on:click={() => changePage(pagination.page - 1)}
          class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
          {pagination.page} / {pagination.totalPages}
        </span>
        <button 
          on:click={() => changePage(pagination.page + 1)}
          class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
        <button 
          on:click={() => changePage(pagination.totalPages)}
          class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pagination.page === pagination.totalPages}
        >
          Last
        </button>
      </div>
    </div>
  {/if}
</div>
