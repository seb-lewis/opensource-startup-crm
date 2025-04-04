<script>
    import { Tabs, TabItem } from 'flowbite-svelte';
    import { Button, Modal } from 'flowbite-svelte';
    import { Fa } from 'svelte-fa';
    import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
    import { goto } from '$app/navigation';

    import LeadCard from '$lib/components/LeadCard.svelte';
    // import Spinner from '$lib/components/Spinner.svelte';
  
    /** @type {any[]} */
    export let openLeads = [];
    /** @type {any[]} */
    export let closedLeads = [];
    /** @type {string} */
    export let tab = 'open';
    /** @type {any[]} */
    export let recordsList = [];
    /** @type {number} */
    export let openCurrentPage = 1;
    /** @type {number} */
    export let openTotalPages = 1;
    /** @type {number} */
    export let closedCurrentPage = 1;
    /** @type {number} */
    export let closedTotalPages = 1;
    /** @type {boolean} */
    export let deleteLeadModal = false;
    /** @type {number|string} */
    export let selectedId;
    /** @type {string} */
    export let modalDialog;
    /** @type {string} */
    export let modalTitle;
  
    export let selectLeadList = (id) => {};
    export let deleteLead = (id) => {};
    export let deleteItem = (id) => {};
    export let handleRecordsPerPage = (event) => {};
    export let onAddHandle = () => {};
    export let handleNextPage = () => {};
    export let handlePreviousPage = () => {};
    export let FormateTime = (dateStr) => '';
  
    const changeTab = (newTab) => {
      tab = newTab;
    };
  </script>
  
  <div class="mt-20 p-4">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Tabs tabStyle="underline">
            <TabItem open title="Open" on:click={() => goto('/leads/open')}>
            </TabItem>
            <TabItem title="Closed" on:click={() => goto('/leads/closed')}>
            </TabItem>
          </Tabs>
  
      <div class="flex items-center gap-2">
        <select class="border rounded px-2 py-1" on:change={handleRecordsPerPage}>
          {#each recordsList as record}
            <option value={record[0]}>{record[1]}</option>
          {/each}
        </select>
  
        <div class="flex items-center border bg-white rounded px-2 py-1">
          <button on:click={handlePreviousPage} disabled={tab === 'open' ? openCurrentPage === 1 : closedCurrentPage === 1}>
            <Fa icon={faChevronLeft} class="h-4" />
          </button>
          <span class="text-sm mx-2">
            {tab === 'open' ? `${openCurrentPage} to ${openTotalPages}` : `${closedCurrentPage} to ${closedTotalPages}`}
          </span>
          <button on:click={handleNextPage} disabled={tab === 'open' ? openCurrentPage === openTotalPages : closedCurrentPage === closedTotalPages}>
            <Fa icon={faChevronRight} class="h-4" />
          </button>
        </div>
  
        <Button color="blue" on:click={onAddHandle}>
          <Fa icon={faPlus} class="mr-2" />
          Add Lead
        </Button>
      </div>
    </div>
  
    <div class="mt-4 space-y-3">
      {#if tab === 'open'}
        {#if openLeads.length}
          {#each openLeads as item (item.id)}
            <LeadCard {item} {selectLeadList} {deleteLead} {FormateTime} />
          {/each}
        {:else}
          No Leads Found
        {/if}
      {:else}
        {#if closedLeads.length}
          {#each closedLeads as item (item.id)}
            <LeadCard {item} {selectLeadList} {deleteLead} {FormateTime} />
          {/each}
        {:else}
          No Leads Found
        {/if}
      {/if}
    </div>
  
    <Modal bind:open={deleteLeadModal}>
      <h3 slot="header">{modalTitle}</h3>
      <div slot="body">{modalDialog}</div>
      <div slot="footer" class="flex justify-end gap-2">
        <Button on:click={() => deleteItem(selectedId)}>Confirm</Button>
        <Button color="gray" on:click={() => deleteLeadModal = false}>Cancel</Button>
      </div>
    </Modal>
  </div>
  