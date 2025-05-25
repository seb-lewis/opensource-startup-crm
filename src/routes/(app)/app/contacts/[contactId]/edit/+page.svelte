<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import { Button } from 'flowbite-svelte';
  export let data;

  let contact = data.contact;
  let account = data.account;
  let isPrimary = data.isPrimary;
  let role = data.role;

  let firstName = contact.firstName;
  let lastName = contact.lastName;
  let email = contact.email || '';
  let phone = contact.phone || '';
  let title = contact.title || '';
  let description = contact.description || '';
  let submitting = false;
  let errorMsg = '';

  async function handleSubmit(e) {
    e.preventDefault();
    submitting = true;
    errorMsg = '';
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isPrimary', isPrimary ? 'true' : '');
    formData.append('role', role || '');
    // Use SvelteKit form actions instead of fetch
    const res = await fetch('', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      await invalidateAll();
      goto(`/app/contacts/${contact.id}`);
    } else {
      const data = await res.json();
      errorMsg = data?.message || 'Failed to update contact.';
    }
    submitting = false;
  }
</script>

<div class="max-w-2xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Edit Contact</h1>
    <form on:submit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium mb-1" for="firstName">
          First Name *
          <input id="firstName" class="w-full border rounded px-3 py-2" bind:value={firstName} required />
        </label>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" for="lastName">
          Last Name *
          <input id="lastName" class="w-full border rounded px-3 py-2" bind:value={lastName} required />
        </label>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" for="email">
          Email
          <input id="email" class="w-full border rounded px-3 py-2" type="email" bind:value={email} />
        </label>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" for="phone">
          Phone
          <input id="phone" class="w-full border rounded px-3 py-2" type="tel" bind:value={phone} />
        </label>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" for="title">
          Title
          <input id="title" class="w-full border rounded px-3 py-2" bind:value={title} />
        </label>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" for="role">
          Role
          <input id="role" class="w-full border rounded px-3 py-2" bind:value={role} />
        </label>
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium mb-1" for="description">
          Description
          <textarea id="description" class="w-full border rounded px-3 py-2" rows="3" bind:value={description}></textarea>
        </label>
      </div>
      <div class="md:col-span-2 flex items-center gap-2">
        <input id="isPrimary" type="checkbox" bind:checked={isPrimary} />
        <label for="isPrimary" class="text-sm">Primary Contact for Account</label>
      </div>
    </div>
    {#if errorMsg}
      <div class="text-red-600">{errorMsg}</div>
    {/if}
    <div class="flex justify-end gap-2">
      <Button type="button" color="alternative" onclick={() => goto(`/app/contacts/${contact.id}`)}>Cancel</Button>
      <Button type="submit" color="blue" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</Button>
    </div>
  </form>
</div>
