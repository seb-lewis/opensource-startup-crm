<script>
  import { Button, Badge, Spinner, Select, Input } from 'flowbite-svelte';
  import { fade, fly } from 'svelte/transition';
  import { formatDistanceToNow } from 'date-fns';
  
  // Get leads from the data prop passed from the server
  export let data;
  const { leads } = data;
  
  // State management
  let searchQuery = '';
  let statusFilter = 'ALL';
  let sortBy = 'createdAt';
  let sortOrder = 'desc';
  let isLoading = false;
  
  // Available statuses for filtering
  const statuses = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'NEW', label: 'New' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'UNQUALIFIED', label: 'Unqualified' },
    { value: 'CONVERTED', label: 'Converted' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'company', label: 'Company' }
  ];
  
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
        return 'indigo';
      case 'UNQUALIFIED':
        return 'red';
      case 'CONVERTED':
        return 'dark';
      default:
        return 'blue';
    }
  }
  
  // Replace fixed date formatting with relative time
  function formatDate(dateString) {
    if (!dateString) return '-';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }
  
  // Computed filtered and sorted leads
  $: filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' || 
      getFullName(lead).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Function to toggle sort order
  function toggleSort(field) {
    if (sortBy === field) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = field;
      sortOrder = 'desc';
    }
  }
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
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          New Lead
        </Button>
      </div>
    </div>
  </header>

  <!-- Filters and Search -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="col-span-1 md:col-span-2">
          <Input
            type="text"
            placeholder="Search by name or company..."
            bind:value={searchQuery}
            class="w-full"
          >
            <svg slot="prefix" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </Input>
        </div>
        <div class="col-span-1">
          <Select bind:value={statusFilter} class="w-full">
            {#each statuses as status}
              <option value={status.value}>{status.label}</option>
            {/each}
          </Select>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    {#if isLoading}
      <div class="flex justify-center items-center py-20" transition:fade>
        <Spinner size="xl" />
      </div>
    {:else if filteredLeads.length === 0}
      <div class="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100" transition:fade>
        <div class="text-gray-400 text-5xl mb-4">📭</div>
        <p class="text-gray-600 text-lg mb-6">No leads found</p>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick={() => toggleSort('firstName')}>
                  <div class="flex items-center">
                    Name
                    {#if sortBy === 'firstName'}
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                      </svg>
                    {/if}
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick={() => toggleSort('createdAt')}>
                  <div class="flex items-center">
                    Created
                    {#if sortBy === 'createdAt'}
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                      </svg>
                    {/if}
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each filteredLeads as lead, i}
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
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {lead.company || '-'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {#if lead.phone}
                      <a href="tel:{lead.phone}" class="hover:text-blue-600">{lead.phone}</a>
                    {:else}
                      -
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Badge color={getStatusColor(lead.status)}>{lead.status}</Badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {lead.owner?.name || '-'}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        
        <!-- Mobile Card View -->
        <div class="md:hidden divide-y divide-gray-200">
          {#each filteredLeads as lead, i}
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
              
              <div class="grid grid-cols-1 gap-2 text-sm">
                {#if lead.title}
                  <div class="flex items-center">
                    <span class="w-20 text-gray-500">Title:</span>
                    <span class="text-gray-700">{lead.title}</span>
                  </div>
                {/if}
                
                {#if lead.company}
                  <div class="flex items-center">
                    <span class="w-20 text-gray-500">Company:</span>
                    <span class="text-gray-700">{lead.company}</span>
                  </div>
                {/if}
                
                {#if lead.phone}
                  <div class="flex items-center">
                    <span class="w-20 text-gray-500">Phone:</span>
                    <a href="tel:{lead.phone}" class="text-blue-600 hover:text-blue-800">{lead.phone}</a>
                  </div>
                {/if}
                
                <div class="flex items-center">
                  <span class="w-20 text-gray-500">Created:</span>
                  <span class="text-gray-700">{formatDate(lead.createdAt)}</span>
                </div>
                
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
