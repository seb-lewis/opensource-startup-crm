<script>
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    import { X, Calendar, User, Building, FileText, Flag, Clock } from '@lucide/svelte';

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

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
                    <p class="text-gray-600 dark:text-gray-300 text-sm">Add a new task to keep track of your work</p>
                </div>
                <button
                    type="button"
                    class="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onclick={handleCancel}
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {#if form?.error}
                <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-3">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-4 w-4 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-2">
                            <p class="text-sm text-red-700 dark:text-red-300 font-medium">{form.error}</p>
                        </div>
                    </div>
                </div>
            {/if}

            <form method="POST" use:enhance class="p-6">
                <div class="space-y-5">
                    <!-- Task Details Section -->
                    <div>
                        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FileText size={18} class="mr-2 text-blue-600 dark:text-blue-400" />
                            Task Details
                        </h2>
                        
                        <div class="space-y-4">
                            <!-- Subject -->
                            <div>
                                <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject <span class="text-red-500 dark:text-red-400">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    name="subject" 
                                    bind:value={subject} 
                                    class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                    placeholder="Enter task subject" 
                                    required 
                                />
                            </div>

                            <!-- Status, Priority, and Due Date in a grid -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                        <Clock size={14} class="mr-1 text-gray-500 dark:text-gray-400" />
                                        Status
                                    </label>
                                    <select 
                                        id="status" 
                                        name="status" 
                                        bind:value={status} 
                                        class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Waiting on someone else">Waiting on someone else</option>
                                        <option value="Deferred">Deferred</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                        <Flag size={14} class="mr-1 text-gray-500 dark:text-gray-400" />
                                        Priority
                                    </label>
                                    <select 
                                        id="priority" 
                                        name="priority" 
                                        bind:value={priority} 
                                        class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                                    >
                                        <option value="High">High</option>
                                        <option value="Normal">Normal</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div>
                                    <label for="dueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                        <Calendar size={14} class="mr-1 text-gray-500 dark:text-gray-400" />
                                        Due Date
                                    </label>
                                    <input 
                                        type="date" 
                                        id="dueDate" 
                                        name="dueDate" 
                                        bind:value={dueDate} 
                                        class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Assignment Section -->
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-5">
                        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <User size={18} class="mr-2 text-blue-600 dark:text-blue-400" />
                            Assignment
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Owner -->
                            <div>
                                <label for="ownerId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Owner <span class="text-red-500 dark:text-red-400">*</span>
                                </label>
                                <select 
                                    id="ownerId" 
                                    name="ownerId" 
                                    bind:value={ownerId} 
                                    class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white" 
                                    required
                                >
                                    <option value="" disabled>Select owner</option>
                                    {#each data.users as user (user.id)}
                                        <option value={user.id}>{user.name || user.email}</option>
                                    {/each}
                                </select>
                            </div>

                            <!-- Related Account -->
                            <div>
                                <label for="accountId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    <Building size={14} class="mr-1 text-gray-500 dark:text-gray-400" />
                                    Related Account
                                </label>
                                <select 
                                    id="accountId" 
                                    name="accountId" 
                                    bind:value={accountId} 
                                    class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Select account (optional)</option>
                                    {#each data.accounts as account (account.id)}
                                        <option value={account.id}>{account.name}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Description Section -->
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-5">
                        <div>
                            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea 
                                id="description" 
                                name="description" 
                                bind:value={description} 
                                class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500 resize-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                rows="3" 
                                placeholder="Enter task details and notes..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row justify-end gap-3 pt-5 mt-5 border-t border-gray-200 dark:border-gray-700">
                    <button 
                        type="button" 
                        class="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-colors text-sm" 
                        onclick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        class="px-5 py-2.5 rounded-lg bg-blue-600 dark:bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow-sm transition-colors text-sm"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    /* Add any page-specific styles if needed */
</style>