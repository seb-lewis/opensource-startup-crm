<script>
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';

    /** @type {{ data: import('./$types').PageData, form?: import('./$types').ActionData }} */
    let { data, form } = $props();

    // Initialize form fields. If 'form' (from a failed action) exists, use its values.
    // Otherwise, use defaults. These are bound to the inputs.
    let subject = $state(form?.subject ?? '');
    let status = $state(form?.status ?? 'Not Started');
    let priority = $state(form?.priority ?? 'Normal');
    let dueDate = $state(form?.dueDate ?? '');
    let ownerId = $state(form?.ownerId ?? '');
    let accountId = $state(form?.accountId ?? '');
    let description = $state(form?.description ?? '');

    // Update local state if 'form' prop changes (e.g., after a failed form submission)
    $effect(() => {
        if (form) {
            subject = form.subject ?? '';
            status = form.status ?? 'Not Started';
            priority = form.priority ?? 'Normal';
            dueDate = form.dueDate ?? '';
            ownerId = form.ownerId ?? '';
            accountId = form.accountId ?? '';
            description = form.description ?? '';
        } else {
            // Reset to defaults if form becomes undefined (e.g. navigating away and back)
            // or handle as per desired UX for fresh form load.
            // For this case, we assume initial empty/default values are set by $state initializers.
        }
    });

    function handleCancel() {
        goto('/app/tasks/list');
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6 md:p-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Create New Task</h1>
            <button
                type="button"
                class="text-gray-400 hover:text-gray-600"
                onclick={handleCancel}
                aria-label="Close"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {#if form?.error}
            <div class="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                <p>{form.error}</p>
            </div>
        {/if}

        <form method="POST" use:enhance class="space-y-4 md:space-y-6">
            <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" id="subject" name="subject" bind:value={subject} class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Task subject" required />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="status" name="status" bind:value={status} class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Not Started</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Waiting on someone else</option>
                        <option>Deferred</option>
                    </select>
                </div>
                <div>
                    <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select id="priority" name="priority" bind:value={priority} class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>High</option>
                        <option>Normal</option>
                        <option>Low</option>
                    </select>
                </div>
            </div>

            <div>
                <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" id="dueDate" name="dueDate" bind:value={dueDate} class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="ownerId" class="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                    <select id="ownerId" name="ownerId" bind:value={ownerId} class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value="" disabled>Select owner</option>
                        {#each data.users as user (user.id)}
                            <option value={user.id}>{user.name || user.email}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label for="accountId" class="block text-sm font-medium text-gray-700 mb-1">Related Account</label>
                    <select id="accountId" name="accountId" bind:value={accountId} class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select account</option>
                        {#each data.accounts as account (account.id)}
                            <option value={account.id}>{account.name}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="description" name="description" bind:value={description} class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4" placeholder="Task details"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
                <button type="button" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium" onclick={handleCancel}>Cancel</button>
                <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">Save Task</button>
            </div>
        </form>
    </div>
</div>

<style>
    /* Add any page-specific styles if needed */
</style>