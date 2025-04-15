<script>
  import { enhance } from '$app/forms';
  import { Alert, Button, Card } from 'flowbite-svelte';
  
  export let data;
  export let form;
  
  const { account, relatedRecords } = data;
  let isSubmitting = false;
  
  function handleEnhance() {
    return ({ formElement, formData, action, cancel, result }) => {
      isSubmitting = true;
      
      return async ({ result, update }) => {
        isSubmitting = false;
        await update();
      };
    };
  }

  // Check if account has related records that would prevent deletion
  const hasBlockingRelatedRecords = account._count.opportunities > 0 || 
                                   account._count.cases > 0;
</script>

<div class="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
  <div class="mb-6 flex items-center">
    <button 
      class="mr-3 inline-flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
      on:click={() => history.back()}
    >
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Back
    </button>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Delete Account</h1>
  </div>

  {#if form?.message}
    <Alert color="red" class="mb-4">
      <span class="font-medium">Error!</span> {form.message}
    </Alert>
  {/if}

  <Card class="mb-6">
    <div class="text-center sm:text-left">
      <svg class="w-12 h-12 text-red-500 mx-auto sm:mx-0 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Are you sure you want to delete this account?
      </h2>
      
      <p class="text-gray-700 dark:text-gray-300 mb-6">
        This action cannot be undone. This will permanently delete the account 
        <span class="font-semibold">"{account.name}"</span> and all related data.
      </p>
      
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Name</p>
            <p class="text-base text-gray-900 dark:text-white font-semibold">{account.name}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</p>
            <p class="text-base text-gray-900 dark:text-white">{account.industry || 'N/A'}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Information</p>
            <p class="text-base text-gray-900 dark:text-white">
              {account.website ? account.website : 'No website'}<br>
              {account.phone ? account.phone : 'No phone'}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
            <p class="text-base text-gray-900 dark:text-white">
              {new Date(account.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
      
      {#if hasBlockingRelatedRecords}
        <Alert color="red" class="mb-4">
          <span class="font-medium">Cannot delete!</span> This account has related records that prevent deletion. 
          Please remove or reassign the following relationships first:
          <ul class="list-disc list-inside mt-2 pl-2">
            {#if account._count.opportunities > 0}
              <li>{account._count.opportunities} opportunities</li>
            {/if}
            {#if account._count.cases > 0}
              <li>{account._count.cases} cases</li>
            {/if}
          </ul>
        </Alert>
      {/if}

      <form method="POST" use:enhance={handleEnhance}>
        <div class="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
          <Button 
            type="submit" 
            color="red" 
            disabled={isSubmitting || hasBlockingRelatedRecords}
            class="px-6"
          >
            {#if isSubmitting}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            {:else}
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Account
            {/if}
          </Button>
          
          <Button 
            type="button"
            color="alternative" 
            on:click={() => history.back()}
            disabled={isSubmitting}
            class="px-6"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </Card>

  <!-- Related Records Section -->
  {#if account._count.opportunities > 0 || account._count.relatedContacts > 0 || account._count.tasks > 0 || account._count.cases > 0}
    <Card class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Related Records</h3>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span class="text-gray-700 dark:text-gray-300">Opportunities</span>
          <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium px-2.5 py-0.5 rounded">
            {account._count.opportunities}
          </span>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span class="text-gray-700 dark:text-gray-300">Contacts</span>
          <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium px-2.5 py-0.5 rounded">
            {account._count.relatedContacts}
          </span>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span class="text-gray-700 dark:text-gray-300">Tasks</span>
          <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium px-2.5 py-0.5 rounded">
            {account._count.tasks}
          </span>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span class="text-gray-700 dark:text-gray-300">Cases</span>
          <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium px-2.5 py-0.5 rounded">
            {account._count.cases}
          </span>
        </div>
      </div>
      
      {#if account._count.opportunities > 0}
        <div class="mb-4">
          <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Opportunities</h4>
          <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg max-h-40 overflow-y-auto">
            <ul class="space-y-2">
              {#each relatedRecords.opportunities as opportunity}
                <li class="flex justify-between">
                  <span>{opportunity.name}</span>
                  <span class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-600">{opportunity.stage}</span>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      {/if}
      
      {#if relatedRecords.contacts.length > 0}
        <div>
          <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Contacts</h4>
          <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg max-h-40 overflow-y-auto">
            <ul class="space-y-1">
              {#each relatedRecords.contacts as contact}
                <li>{contact.contact.firstName} {contact.contact.lastName}</li>
              {/each}
            </ul>
          </div>
        </div>
      {/if}
    </Card>
  {/if}

  <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
    <h3 class="font-semibold text-amber-800 dark:text-amber-300 mb-2">Warning about related records</h3>
    <p class="text-amber-700 dark:text-amber-400 text-sm">
      Deleting this account will also remove access to all related information, including:
    </p>
    <ul class="list-disc list-inside mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-1">
      <li>Contacts associated with this account</li>
      <li>Tasks and events related to this account</li>
      <li>Notes and attachments</li>
      <li>Comments</li>
    </ul>
    <p class="mt-2 text-sm text-amber-700 dark:text-amber-400 font-semibold">
      Note: Opportunities and Cases must be deleted separately before you can delete this account.
    </p>
  </div>
</div>
