<script>
  import { Button, Badge, Spinner } from 'flowbite-svelte';
  import { fade, fly } from 'svelte/transition';
  
  // Get leads from the data prop passed from the server
  export let data;
  const { leads } = data;
  
  // Function to get the full name of a lead
  function getFullName(lead) {
    return `${lead.firstName} ${lead.lastName}`.trim();
  }
  
  // Function to map lead status to badge color
  function getStatusColor(status) {
    switch (status) {
      case 'NEW':
        return 'blue';
      case 'PENDING':
        return 'purple';
      case 'CONTACTED':
        return 'green';
      case 'QUALIFIED':
        return 'success';
      case 'UNQUALIFIED':
        return 'warning';
      case 'CONVERTED':
        return 'indigo';
      default:
        return 'info';
    }
  }

  // For demonstration purpose - loading state
  let isLoading = false;
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 class="text-white text-2xl md:text-3xl font-bold flex items-center">
          <span class="mr-2">📋</span> Open Leads
        </h1>
        <Button href="/app/leads/new" size="sm" color="light" class="px-4 py-2 flex-shrink-0">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          New Lead
        </Button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {#if isLoading}
      <div class="flex justify-center items-center py-20" transition:fade>
        <Spinner size="xl" />
      </div>
    {:else if leads.length === 0}
      <div class="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100" transition:fade>
        <div class="text-gray-400 text-5xl mb-4">📭</div>
        <p class="text-gray-600 text-lg mb-6">No open leads found</p>
        <Button href="/app/leads/new" color="blue" class="mt-2 px-6">Create a new lead</Button>
      </div>
    {:else}
      <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100" in:fade={{duration: 300}}>
        <!-- Desktop Table View -->
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each leads as lead, i}
                <tr 
                  class="hover:bg-blue-50 transition-colors duration-150"
                  in:fly={{y: 20, duration: 300, delay: i * 50}}
                >
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                  <a href="/app/leads/{lead.id}" class="text-blue-600 hover:text-blue-800 font-medium">
                    {lead.title || '-'}
                  </a>
                </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      {getFullName(lead)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">{lead.email || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">{lead.phone || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">{lead.company || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Badge color={getStatusColor(lead.status)}>{lead.status}</Badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">{lead.owner?.name || '-'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        
        <!-- Mobile Card View -->
        <div class="md:hidden divide-y divide-gray-200">
          {#each leads as lead, i}
            <div 
              class="p-4 bg-white hover:bg-blue-50 transition-colors duration-150" 
              in:fly={{y: 20, duration: 300, delay: i * 50}}
            >
              <div class="flex justify-between items-start mb-2">
                <a href="/app/leads/{lead.id}" class="text-blue-600 hover:text-blue-800 font-medium text-lg">
                  {getFullName(lead)}
                </a>
                <Badge color={getStatusColor(lead.status)}>{lead.status}</Badge>
              </div>
              
              <div class="grid grid-cols-1 gap-1 text-sm">
                {#if lead.title}
                  <div class="flex items-center">
                    <span class="w-20 text-gray-500">Title:</span>
                    <span class="text-gray-700">{lead.title}</span>
                  </div>
                {/if}
                
                {#if lead.email}
                  <div class="flex items-center">
                    <span class="w-20 text-gray-500">Email:</span>
                    <span class="text-gray-700">{lead.email}</span>
                  </div>
                {/if}
                
                {#if lead.phone}
                  <div class="flex items-center">
                    <span class="w-20 text-gray-500">Phone:</span>
                    <span class="text-gray-700">{lead.phone}</span>
                  </div>
                {/if}
                
                {#if lead.company}
                  <div class="flex items-center">
                    <span class="w-20 text-gray-500">Company:</span>
                    <span class="text-gray-700">{lead.company}</span>
                  </div>
                {/if}
                
                {#if lead.owner?.name}
                  <div class="flex items-center">
                    <span class="w-20 text-gray-500">Owner:</span>
                    <span class="text-gray-700">{lead.owner.name}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </main>
</div>
