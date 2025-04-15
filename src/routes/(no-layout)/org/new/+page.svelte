<script>
    import '../../../app.css';
    import { enhance } from '$app/forms';
    import { Input, Label, Button } from 'flowbite-svelte';
    import { Card } from 'flowbite-svelte';
    import { goto } from '$app/navigation';
  
    export let data;
    export let form; // This contains the result of your form action
    
    console.log('Data:', data);
    console.log('Form result:', form);
    
    // Handle form submission success
    $: if (form?.data) {
        // Redirect after a short delay to show success message
        setTimeout(() => {
            goto('/org');
        }, 1500);
    }
</script>

<Card>
    <form action="/org/new" method="POST" use:enhance>
        <div class="mb-6 grid gap-6 md:grid-cols-2">
            <div>
                <Label for="org_name" class="mb-2">Org Name</Label>
                <Input type="text" id="org_name" name="org_name" required />
            </div>
        </div>
        
        {#if form?.error}
            <div class="text-red-500 mb-4">{form.error.name}</div>
        {/if}
        
        {#if form?.data}
            <div class="text-green-500 mb-4">Organization "{form.data.name}" created successfully!</div>
        {/if}
        
        <Button type="submit">Create</Button>
        <a href="/org" class="text-blue-500 hover:underline ml-4">Back to Organizations</a>
        
    </form>
</Card>
