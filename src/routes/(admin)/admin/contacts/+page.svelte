<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    
    /** @param {string | Date} dateString */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
</script>

<div class="p-6">
    <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Contact Submissions</h1>
    </div>

    {#if data.contacts && data.contacts.length > 0}
        <div class="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact Info
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reason
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Message
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tracking
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each data.contacts as contact}
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex flex-col">
                                    <div class="text-sm font-medium text-gray-900">{contact.name}</div>
                                    <div class="text-sm text-gray-500">{contact.email}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {contact.reason}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900 max-w-xs truncate" title={contact.message}>
                                    {contact.message}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(contact.createdAt)}
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-xs text-gray-500 space-y-1">
                                    {#if contact.ipAddress}
                                        <div>IP: {contact.ipAddress}</div>
                                    {/if}
                                    {#if contact.referrer}
                                        <div class="truncate max-w-32" title={contact.referrer}>
                                            Ref: {contact.referrer}
                                        </div>
                                    {/if}
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        
        <div class="mt-4 text-sm text-gray-600">
            Total submissions: {data.contacts.length}
        </div>
    {:else}
        <div class="text-center py-12">
            <div class="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-5m-7 0h5"/>
                </svg>
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No contact submissions</h3>
            <p class="mt-1 text-sm text-gray-500">No contact form requests have been submitted yet.</p>
        </div>
    {/if}
</div>