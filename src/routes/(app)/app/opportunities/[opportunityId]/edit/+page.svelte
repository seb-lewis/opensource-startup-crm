<script>
  export let data;
  let opportunity = { ...data.opportunity };
  let error = '';
  let isSubmitting = false;
  let closeDateStr = opportunity.closeDate
    ? new Date(opportunity.closeDate).toISOString().slice(0, 10)
    : '';
  $: opportunity.closeDate = closeDateStr;
  async function handleSubmit(e) {
    e.preventDefault();
    isSubmitting = true;
    error = '';
    const formData = new FormData(e.target);
    const res = await fetch('', { method: 'POST', body: formData });
    if (res.ok) {
      window.location.href = `/app/opportunities/${opportunity.id}`;
    } else {
      const result = await res.json();
      error = result?.message || 'Failed to update opportunity.';
    }
    isSubmitting = false;
  }
</script>

<div class="max-w-xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Edit Opportunity</h1>
  <form on:submit={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="block mb-1 font-medium">Name</label>
      <input id="name" class="w-full border rounded px-3 py-2" name="name" bind:value={opportunity.name} required />
    </div>
    <div>
      <label for="amount" class="block mb-1 font-medium">Amount</label>
      <input id="amount" class="w-full border rounded px-3 py-2" name="amount" type="number" bind:value={opportunity.amount} />
    </div>
    <div>
      <label for="stage" class="block mb-1 font-medium">Stage</label>
      <select class="w-full border rounded px-3 py-2" name="stage" bind:value={opportunity.stage}>
        <option value="PROSPECTING">Prospecting</option>
        <option value="QUALIFICATION">Qualification</option>
        <option value="PROPOSAL">Proposal</option>
        <option value="NEGOTIATION">Negotiation</option>
        <option value="CLOSED_WON">Closed Won</option>
        <option value="CLOSED_LOST">Closed Lost</option>
      </select>
    </div>
    <div>
      <label for="probability" class="block mb-1 font-medium">Probability (%)</label>
      <input id="probability" class="w-full border rounded px-3 py-2" name="probability" type="number" min="0" max="100" bind:value={opportunity.probability} />
    </div>
    <div>
      <label for="closeDate" class="block mb-1 font-medium">Close Date</label>
      <input id="closeDate" class="w-full border rounded px-3 py-2" name="closeDate" type="date" bind:value={closeDateStr} />
    </div>
    <div>
      <label for="description" class="block mb-1 font-medium">Description</label>
      <textarea id="description" class="w-full border rounded px-3 py-2" name="description" rows="3" bind:value={opportunity.description}></textarea>
    </div>
    {#if error}
      <div class="text-red-600">{error}</div>
    {/if}
    <div class="flex gap-2">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
      <a href={`/app/opportunities/${opportunity.id}`} class="px-4 py-2 rounded border border-gray-300">Cancel</a>
    </div>
  </form>
</div>
<style>
  @media (max-width: 640px) {
    .max-w-xl { max-width: 100%; padding: 0.5rem; }
  }
</style>
