<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    // Example static data for design
    const users = [
        { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Admin" },
        { id: 2, name: "Bob Jones", email: "bob@example.com", role: "User" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Manager" }
    ];
    import { Fa } from 'svelte-fa';
    import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Users</h1>
    <div class="flex justify-end mb-4">
        <a href="/app/users/new"
           class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded shadow hover:bg-blue-700 transition">
            Add User
        </a>
    </div>
    <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each users as user}
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <button class="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-800 transition" title="Edit">
                                <Fa icon={faEdit} class="w-4 h-4" />
                            </button>
                            <button class="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-800 transition" title="Delete">
                                <Fa icon={faTrash} class="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>