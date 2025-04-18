<script>
  export let data;
  let opportunity = data.opportunity;
  let error = '';
  let isDeleting = false;
  async function handleDelete(e) {
    e.preventDefault();
    isDeleting = true;
    error = '';
    const res = await fetch('', { method: 'POST' });
    if (res.ok) {
      window.location.href = `/app/accounts/${opportunity.accountId}`;
    } else {
      const result = await res.json();
      error = result?.message || 'Failed to delete opportunity.';
    }
    isDeleting = false;
  }
</script>
<div class="max-w-md mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Delete Opportunity</h1>
  <p class="mb-4">Are you sure you want to delete the opportunity <span class="font-semibold">{opportunity.name}</span>? This action cannot be undone.</p>
  {#if error}
    <div class="text-red-600 mb-2">{error}</div>
  {/if}
  <form on:submit={handleDelete} class="flex gap-2">
    <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded" disabled={isDeleting}>
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
    <a href={`/app/opportunities/${opportunity.id}`} class="px-4 py-2 rounded border border-gray-300">Cancel</a>
  </form>
</div>
<style>
  @media (max-width: 640px) {
    .max-w-md { max-width: 100%; padding: 0.5rem; }
  }
</style>
