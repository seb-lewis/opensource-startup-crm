<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  export let data;
  let statusFilter = '';
  let assignedFilter = '';
  let accountFilter = '';

  // Use options from server data
  const statusOptions = data.statusOptions;
  const assignedOptions = data.allUsers.map((u: any) => u.name);
  const accountOptions = data.allAccounts.map((a: any) => a.name);

  $: filteredCases = data.cases.filter((c: any) =>
    (!statusFilter || c.status === statusFilter) &&
    (!assignedFilter || c.owner?.name === assignedFilter) &&
    (!accountFilter || c.account?.name === accountFilter)
  );

  function statusColor(status: string) {
    return status === 'OPEN' ? 'bg-green-100 text-green-800' :
           status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
           'bg-gray-100 text-gray-800';
  }

  function onFilterChange() {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (assignedFilter) params.set('assigned', assignedFilter);
    if (accountFilter) params.set('account', accountFilter);
    goto(`/app/cases?${params.toString()}`);
  }
</script>

<section class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      Cases
    </h1>
    <a href="/app/cases/new" class="btn btn-primary">+ New Case</a>
  </div>
  <div class="mb-4 flex flex-wrap gap-4 items-end">
    <div>
      <label class="block text-xs font-semibold mb-1">Status</label>
      <select class="select select-bordered" bind:value={statusFilter} on:change={onFilterChange}>
        <option value="">All</option>
        {#each statusOptions as s}
          <option value={s}>{s}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1">Assigned To</label>
      <select class="select select-bordered" bind:value={assignedFilter} on:change={onFilterChange}>
        <option value="">All</option>
        {#each assignedOptions as a}
          <option value={a}>{a}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1">Account</label>
      <select class="select select-bordered" bind:value={accountFilter} on:change={onFilterChange}>
        <option value="">All</option>
        {#each accountOptions as acc}
          <option value={acc}>{acc}</option>
        {/each}
      </select>
    </div>
    {#if statusFilter || assignedFilter || accountFilter}
      <button class="btn btn-sm btn-ghost ml-2" on:click={() => { statusFilter = ''; assignedFilter = ''; accountFilter = ''; onFilterChange(); }}>
        Clear Filters
      </button>
    {/if}
  </div>
  <div class="bg-white rounded shadow p-4 min-h-[200px]">
    {#if filteredCases.length}
      <table class="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr class="text-gray-600 text-sm">
            <th class="p-2">Title</th>
            <th class="p-2">Account</th>
            <th class="p-2">Assigned</th>
            <th class="p-2">Due</th>
            <th class="p-2">Priority</th>
            <th class="p-2">Status</th>
            <th class="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {#each filteredCases as c}
            <tr class="hover:bg-gray-50 rounded transition">
              <td class="p-2 font-semibold">
                <a href={`/app/cases/${c.id}`} class="text-primary hover:underline">{c.subject}</a>
                <div class="text-xs text-gray-400">{c.description}</div>
              </td>
              <td class="p-2">{c.account?.name}</td>
              <td class="p-2 flex items-center gap-2">
                <span class="inline-block w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs">{c.owner?.name?.[0]}</span>
                {c.owner?.name}
              </td>
              <td class="p-2">{c.dueDate ? (new Date(c.dueDate)).toLocaleDateString() : '-'}</td>
              <td class="p-2">
                <span class="px-2 py-1 rounded text-xs font-medium {c.priority === 'High' ? 'bg-red-100 text-red-800' : c.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">{c.priority}</span>
              </td>
              <td class="p-2">
                <span class={`px-2 py-1 rounded text-xs font-medium ${statusColor(c.status)}`}>{c.status}</span>
              </td>
              <td class="p-2">
                <a href={`/app/cases/${c.id}`} class="btn btn-sm btn-outline">View</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p class="text-gray-500">No cases found for selected filters.</p>
    {/if}
  </div>
</section>
