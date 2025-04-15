<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  export let data;
  
  let { accounts, pagination } = data;
  let sortField = $page.url.searchParams.get('sort') || 'name';
  let sortOrder = $page.url.searchParams.get('order') || 'asc';
  let isLoading = false;
  
  function updateQueryParams() {
    isLoading = true;
    const params = new URLSearchParams($page.url.searchParams);
    
    params.set('sort', sortField);
    params.set('order', sortOrder);
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
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <a href="/app/accounts/{account.id}" class="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                  {account.name}
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
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center space-x-3">
                  <a href="/app/accounts/{account.id}" 
                     class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    View
                  </a>
                  <a href="/app/accounts/{account.id}/edit" 
                     class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    Edit
                  </a>
                </div>
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
