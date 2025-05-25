<script>
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    /** @type {import('./$types').PageData} */
    export let data;
    
    /** @type {import('./$types').ActionData} */
    export let form;

    // Reactive task data for the form
    let task = { ...data.task }; // Create a copy to avoid mutating prop directly initially
    
    // Ensure dueDate is in YYYY-MM-DD for the input, or empty string if null
    task.dueDate = task.dueDate ? task.dueDate.split('T')[0] : '';

    const users = data.users;
    const accounts = data.accounts;

    function handleCancel() {
        goto(`/app/tasks/${data.task.id}`);
    }
</script>

<div class="max-w-2xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Edit Task</h1>
        <button type="button" onclick={handleCancel} class="text-gray-600 hover:text-gray-800">
            Cancel
        </button>
    </div>

    <form method="POST" action="?/update" use:enhance class="bg-white rounded-lg shadow p-6 space-y-6">
        {#if form?.message}
            <div class="p-3 my-2 rounded-md bg-red-100 text-red-700">
                <p>{form.message}</p>
            </div>
        {/if}
        {#if form?.fieldError}
             <div class="p-3 my-2 rounded-md bg-red-100 text-red-700">
                <p>Error with field '{form.fieldError[0]}': {form.fieldError[1]}</p>
            </div>
        {/if}

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="task-subject">Subject</label>
            <input type="text" id="task-subject" name="subject" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={task.subject} required />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="task-description">Description</label>
            <textarea id="task-description" name="description" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" bind:value={task.description}></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="task-status">Status</label>
                <select id="task-status" name="status" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={task.status}>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Waiting on someone else</option>
                    <option>Deferred</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="task-priority">Priority</label>
                <select id="task-priority" name="priority" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={task.priority}>
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="task-duedate">Due Date</label>
                <input type="date" id="task-duedate" name="dueDate" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={task.dueDate} />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="task-owner">Owner</label>
                <select id="task-owner" name="ownerId" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={task.ownerId} required>
                    {#each users as user}
                        <option value={user.id}>{user.name}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="task-account">Account (Optional)</label>
            <select id="task-account" name="accountId" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={task.accountId}>
                <option value={null}>None</option> <!-- Or value="" depending on how you handle null on backend -->
                {#each accounts as acc}
                    <option value={acc.id}>{acc.name}</option>
                {/each}
            </select>
        </div>

        <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700" onclick={handleCancel}>
                Cancel
            </button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
                Save Changes
            </button>
        </div>
    </form>
</div>