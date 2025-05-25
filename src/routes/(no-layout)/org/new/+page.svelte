<script>
    import '../../../../app.css'
    import { enhance } from '$app/forms';
    import { Input, Label } from 'flowbite-svelte';
    import { Card } from 'flowbite-svelte';
    import { goto } from '$app/navigation';
  
    export let form; // This contains the result of your form action
    
    
    // Handle form submission success
    $: if (form?.data) {
        // Redirect after a short delay to show success message
        setTimeout(() => {
            goto('/org');
        }, 1500);
    }
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Create New Organization</h1>
    <Card class="w-full max-w-md shadow-lg p-6 bg-white border border-gray-200">
        <form action="/org/new" method="POST" use:enhance class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <Label for="org_name">Org Name</Label>
                <Input type="text" id="org_name" name="org_name" required class="w-full" />
            </div>
            {#if form?.error}
                <div class="text-red-500 text-center">{form.error.name}</div>
            {/if}
            {#if form?.data}
                <div class="text-green-500 text-center">Organization "{form.data.name}" created successfully!</div>
            {/if}
            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Create</button>
            <a href="/org" class="text-blue-500 hover:underline text-sm text-center">Back to Organizations</a>
        </form>
    </Card>
</div>
