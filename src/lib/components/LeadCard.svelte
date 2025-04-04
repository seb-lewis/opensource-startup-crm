<script>
    import { Fa } from 'svelte-fa';
    import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
  
    /** @type {any} */
    export let item;
    export let selectLeadList;
    export let deleteLead;
    export let FormateTime;
  </script>
  
  <div class="p-4 border rounded shadow-sm bg-white space-y-2">
    <div class="flex justify-between items-center">
      <div class="font-semibold text-blue-900 cursor-pointer" on:click={() => selectLeadList(item.id)}>{item.title}</div>
      <button on:click={() => deleteLead(item.id)}>
        <Fa icon={faTrashAlt} class="text-gray-400 hover:text-red-500" />
      </button>
    </div>
  
    <div class="text-gray-600 text-sm capitalize">
      {item.country} - source <span class="text-blue-900 font-medium">{item.source}</span> - status <span class="text-blue-900 font-medium">{item.status}</span>
    </div>
  
    <div class="flex flex-wrap gap-2">
      {#each item.tags as tag}
        <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{tag}</span>
      {/each}
    </div>
  
    <div class="flex items-center gap-2 text-sm">
      Created {FormateTime(item.created_at)} by
      <img class="h-5 w-5 rounded-full" src={item.created_by?.profile_pic} alt={item.first_name} />
      {item.first_name} {item.last_name}
    </div>
  </div>
  