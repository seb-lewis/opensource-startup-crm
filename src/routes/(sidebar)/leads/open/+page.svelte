<script>
  import { Button, Badge } from 'flowbite-svelte';

  // Sample data for leads
  let leads = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', company: 'Acme Inc.', status: 'Open' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', company: 'Globex Corp.', status: 'Won' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-9012', company: 'Soylent Corp.', status: 'Lost' },
  ];
</script>

<div class="min-h-screen bg-white">
  <!-- Header -->
  <header class="bg-blue-500 p-4 flex items-center justify-between">
    <h1 class="text-white text-2xl font-bold">Open Leads</h1>
    <Button href="/leads/new" size="sm" color="light">
      + New Lead
    </Button>
  </header>

  <!-- Main Content -->
  <main class="p-4">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each leads as lead}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">{lead.name}</td>
              <td class="px-6 py-4 whitespace-nowrap">{lead.email}</td>
              <td class="px-6 py-4 whitespace-nowrap">{lead.phone}</td>
              <td class="px-6 py-4 whitespace-nowrap">{lead.company}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if lead.status === 'Open'}
                  <Badge color="info">Open</Badge>
                {:else if lead.status === 'Won'}
                  <Badge color="success">Won</Badge>
                {:else if lead.status === 'Lost'}
                  <Badge color="failure">Lost</Badge>
                {:else}
                  <Badge>{lead.status}</Badge>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </main>
</div>
