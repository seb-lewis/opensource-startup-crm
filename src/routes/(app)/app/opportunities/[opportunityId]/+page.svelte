<script>
  export let data;
  let opportunity = data.opportunity;
  let account = data.account;
  let owner = data.owner;
</script>

<div class="max-w-2xl mx-auto p-4">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
    <div class="flex items-center gap-2">
      <a href={account ? `/app/accounts/${account.id}` : '/app/accounts'} class="text-blue-600 hover:underline">Back to Account</a>
      <span class="text-gray-400">/</span>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{opportunity.name}</h1>
    </div>
    <div class="flex gap-2 mt-2 sm:mt-0">
      <a href={`/app/opportunities/${opportunity.id}/edit`} class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm">Edit</a>
      <a href={`/app/opportunities/${opportunity.id}/delete`} class="bg-red-600 text-white px-3 py-1.5 rounded text-sm">Delete</a>
    </div>
  </div>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <div class="text-gray-500 text-xs">Stage</div>
        <div class="font-semibold">{opportunity.stage}</div>
      </div>
      <div>
        <div class="text-gray-500 text-xs">Amount</div>
        <div class="font-semibold">${opportunity.amount?.toLocaleString() ?? 'N/A'}</div>
      </div>
      <div>
        <div class="text-gray-500 text-xs">Probability</div>
        <div class="font-semibold">{opportunity.probability ? `${opportunity.probability}%` : 'N/A'}</div>
      </div>
      <div>
        <div class="text-gray-500 text-xs">Close Date</div>
        <div class="font-semibold">{opportunity.closeDate ? new Date(opportunity.closeDate).toLocaleDateString() : 'N/A'}</div>
      </div>
      <div>
        <div class="text-gray-500 text-xs">Account</div>
        <div class="font-semibold">{account?.name ?? 'N/A'}</div>
      </div>
      <div>
        <div class="text-gray-500 text-xs">Owner</div>
        <div class="font-semibold">{owner?.name ?? 'N/A'}</div>
      </div>
    </div>
    <div class="mb-2">
      <div class="text-gray-500 text-xs">Description</div>
      <div class="whitespace-pre-line">{opportunity.description || 'No description'}</div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <div>
        <div class="text-gray-500 text-xs">Created</div>
        <div>{opportunity.createdAt ? new Date(opportunity.createdAt).toLocaleString() : 'N/A'}</div>
      </div>
      <div>
        <div class="text-gray-500 text-xs">Last Updated</div>
        <div>{opportunity.updatedAt ? new Date(opportunity.updatedAt).toLocaleString() : 'N/A'}</div>
      </div>
    </div>
  </div>
</div>
<style>
  @media (max-width: 640px) {
    .max-w-2xl { max-width: 100%; padding: 0.5rem; }
  }
</style>
