<script>
  import { Badge, Button, Card, Spinner, Tabs, TabItem, Textarea, Toast } from 'flowbite-svelte';
  import { fly, fade, scale } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';

  export let data;
  export let form;
  const { lead } = data;

  let newComment = '';
  let isSubmittingComment = false;
  let isConverting = false;
  
  // Toast state variables
  let showToast = false;
  let toastMessage = '';
  let toastType = 'default';

  // Reactive statement to show toast messages based on form action result
  $: if (form?.status === 'success') {
    toastMessage = form.message || 'Action completed successfully!';
    toastType = 'success';
    showToast = true;
    invalidateAll();
    isConverting = false;
    isSubmittingComment = false;
    
    // Reset comment field if the comment was successfully added
    if (form.comment) {
      newComment = '';
    }
  } else if (form?.status === 'error') {
    toastMessage = form.message || 'An error occurred.';
    toastType = 'error';
    showToast = true;
    isConverting = false;
    isSubmittingComment = false;
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

  function getStatusColor(status) {
    switch (status) {
      case 'NEW':
        return 'blue';
      case 'PENDING':
        return 'purple';
      case 'CONTACTED':
        return 'green';
      case 'QUALIFIED':
        return 'success';
      case 'UNQUALIFIED':
        return 'warning';
      case 'CONVERTED':
        return 'indigo';
      default:
        return 'info';
    }
  }

  function getFullName(lead) {
    return `${lead.firstName} ${lead.lastName}`.trim();
  }

  async function addComment() {
    if (!newComment.trim()) return;
    isSubmittingComment = true;
    setTimeout(() => {
      alert(`Comment added: ${newComment}`);
      newComment = '';
      isSubmittingComment = false;
    }, 1000);
  }
</script>

<!-- Use Toast component properly -->
{#if showToast}
  <Toast dismissable bind:open={showToast} color={toastType} position="top-right">
    <span class="font-medium">{toastMessage}</span>
  </Toast>
{/if}

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
  <!-- Sticky Top Bar -->
  <header class="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-blue-100 shadow-sm">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
      <div class="flex items-center gap-2">
        <a href="/app/leads/open" aria-label="Back to leads list" class="text-blue-700 hover:text-blue-900 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 class="text-xl md:text-2xl font-bold text-blue-900 truncate">{getFullName(lead)}</h1>
        <Badge color={getStatusColor(lead.status)} class="ml-2">{lead.status}</Badge>
      </div>
      <div class="flex gap-2">
        {#if lead.status !== 'CONVERTED'}
          <!-- Use a form for the convert action -->
          <form method="POST" action="?/convert" use:enhance={() => {
            isConverting = true; // Set loading state on submit
            return async ({ update }) => {
              // This runs after the action completes
              await update({ reset: false }); // Update form prop without resetting the page
              // isConverting will be reset by the reactive statement above
            };
          }}>
            <Button type="submit" color="success" size="sm" disabled={isConverting}>
              {#if isConverting}
                <Spinner size="sm" class="mr-1.5" /> Converting...
              {:else}
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Convert
              {/if}
            </Button>
          </form>
        {/if}
        <Button color="light" size="sm" href="/app/leads/{lead.id}/edit" disabled={isConverting || lead.status === 'CONVERTED'}>
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          Edit
        </Button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-2 md:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Sidebar: Lead Summary -->
    <aside class="md:col-span-1">
      <Card class="mb-6 shadow-lg border-0 bg-white/90">
        <div class="flex flex-col items-center py-6">
          <div class="bg-gradient-to-tr from-blue-200 to-blue-400 text-blue-900 p-5 rounded-full shadow">
            <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h2 class="mt-4 text-lg font-semibold text-blue-900">{getFullName(lead)}</h2>
          {#if lead.title}
            <div class="text-sm text-blue-700">{lead.title}</div>
          {/if}
          {#if lead.company}
            <div class="text-sm text-gray-500 mt-1">{lead.company}</div>
          {/if}
        </div>
        <div class="border-t pt-4 px-4 space-y-2">
          {#if lead.email}
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <a href="mailto:{lead.email}" class="text-blue-700 hover:underline">{lead.email}</a>
            </div>
          {/if}
          {#if lead.phone}
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <a href="tel:{lead.phone}" class="text-green-700 hover:underline">{lead.phone}</a>
            </div>
          {/if}
          <div class="flex items-center gap-2">
            <Badge color={getStatusColor(lead.status)}>{lead.status}</Badge>
            {#if lead.leadSource}
              <span class="text-xs text-gray-500 capitalize">{lead.leadSource.replace('_', ' ').toLowerCase()}</span>
            {/if}
          </div>
        </div>
        <div class="border-t pt-4 px-4 space-y-1 text-xs text-gray-500 mt-2">
          <div>Created: <span class="font-medium text-gray-700">{formatDate(lead.createdAt)}</span></div>
          <div>Updated: <span class="font-medium text-gray-700">{formatDate(lead.updatedAt)}</span></div>
          {#if lead.isConverted && lead.convertedAt}
            <div class="text-green-600 font-semibold">Converted: <span class="font-medium">{formatDate(lead.convertedAt)}</span></div>
            {#if lead.convertedContactId}
              <div class="text-xs"><a href="/app/contacts/{lead.convertedContactId}" class="text-blue-600 hover:underline">View Contact</a></div>
            {/if}
            {#if lead.convertedAccountId}
              <div class="text-xs"><a href="/app/accounts/{lead.convertedAccountId}" class="text-blue-600 hover:underline">View Account</a></div>
            {/if}
             {#if lead.convertedOpportunityId}
              <div class="text-xs"><a href="/app/opportunities/{lead.convertedOpportunityId}" class="text-blue-600 hover:underline">View Opportunity</a></div>
            {/if}
          {/if}
        </div>
      </Card>

      <!-- Owner Card -->
      <Card class="mb-6 shadow border-0 bg-white/90">
        <h3 class="text-base font-semibold mb-2 text-blue-900">Lead Owner</h3>
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 text-blue-700 p-2 rounded-full">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div>
            <div class="font-medium">{lead.owner?.name || 'Unassigned'}</div>
            {#if lead.owner?.email}
              <div class="text-xs text-gray-500">{lead.owner.email}</div>
            {/if}
            {#if lead.owner?.title}
              <div class="text-xs text-gray-400">{lead.owner.title}</div>
            {/if}
          </div>
        </div>
        <Button size="xs" color="alternative" class="w-full mt-4">Change Owner</Button>
      </Card>

      <!-- Related Contact -->
      <!-- Show converted contact info if available -->
      <Card class="shadow border-0 bg-white/90">
        <h3 class="text-base font-semibold mb-2 text-blue-900">Related Contact</h3>
        {#if lead.convertedContactId && lead.contact}
          <div class="border rounded-lg p-3 bg-green-50 border-green-200" in:scale={{ duration: 200 }}>
             <div class="font-medium text-gray-900">{lead.contact.firstName} {lead.contact.lastName}</div>
             {#if lead.contact.email}
               <div class="text-xs text-gray-500">{lead.contact.email}</div>
             {/if}
             {#if lead.contact.phone}
               <div class="text-xs text-gray-500">{lead.contact.phone}</div>
             {/if}
             <Button size="xs" href={`/app/contacts/${lead.contact.id}`} class="w-full mt-2">
               <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
               </svg>
               View Contact
             </Button>
           </div>
        {:else if lead.status === 'CONVERTED'}
           <div class="text-center py-4 text-gray-400 border border-dashed rounded-lg" in:fade={{ delay: 300 }}>
             <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto text-green-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             Lead Converted
           </div>
        {:else}
          <div class="text-center py-4 text-gray-400 border border-dashed rounded-lg" in:fade={{ delay: 300 }}>
            <svg class="w-8 h-8 mx-auto text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            No related contacts
            <div class="mt-2">
              <Button size="xs" color="alternative">Create Contact</Button>
            </div>
          </div>
        {/if}
      </Card>
    </aside>

    <!-- Main Content -->
    <section class="md:col-span-2 flex flex-col gap-8">
      <!-- Lead Details Card -->
      <Card class="shadow-lg border-0 bg-white/95">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Full Name</h4>
            <div class="text-base font-medium text-gray-900">{getFullName(lead)}</div>
          </div>
          {#if lead.company}
            <div>
              <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Company</h4>
              <div class="text-base text-gray-900">{lead.company}</div>
            </div>
          {/if}
          {#if lead.email}
            <div>
              <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Email</h4>
              <a href="mailto:{lead.email}" class="text-blue-700 hover:underline">{lead.email}</a>
            </div>
          {/if}
          {#if lead.phone}
            <div>
              <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Phone</h4>
              <a href="tel:{lead.phone}" class="text-green-700 hover:underline">{lead.phone}</a>
            </div>
          {/if}
          {#if lead.title}
            <div>
              <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Title</h4>
              <div class="text-base text-gray-900">{lead.title}</div>
            </div>
          {/if}
          {#if lead.leadSource}
            <div>
              <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Lead Source</h4>
              <div class="capitalize">{lead.leadSource.replace('_', ' ').toLowerCase()}</div>
            </div>
          {/if}
          {#if lead.industry}
            <div>
              <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Industry</h4>
              <div>{lead.industry}</div>
            </div>
          {/if}
          {#if lead.rating}
            <div>
              <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Rating</h4>
              <div>{lead.rating}</div>
            </div>
          {/if}
        </div>
        {#if lead.description}
          <div class="border-t pt-4 mt-4">
            <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Description</h4>
            <div class="text-gray-800 whitespace-pre-line">{lead.description}</div>
          </div>
        {/if}
      </Card>

      <!-- Tabs Section -->
      <Card class="shadow-lg border-0 bg-white/95">
        <Tabs style="underline" contentClass="p-0">
          <TabItem open title="Comments">
            <div class="p-4">
              <div class="mb-4">
                <form method="POST" action="?/addComment" use:enhance={() => {
                  isSubmittingComment = true;
                  return async ({ update }) => {
                    await update({ reset: false });
                  };
                }}>
                  <Textarea name="comment" bind:value={newComment} placeholder="Add a comment..." rows="3" class="focus:border-blue-500" />
                  <div class="flex justify-end mt-3">
                    <Button type="submit" size="sm" color="blue" disabled={!newComment || isSubmittingComment}
                            class="px-4 py-2 transition-all duration-200 hover:shadow">
                      {#if isSubmittingComment}
                        <Spinner size="sm" class="mr-2" />
                      {:else}
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                      {/if}
                      Add Comment
                    </Button>
                  </div>
                </form>
              </div>
              {#if lead.comments && lead.comments.length > 0}
                <div class="space-y-4">
                  {#each lead.comments as comment, i}
                    <div class="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
                         in:fly={{ y: 20, delay: i * 80, duration: 300 }}>
                      <div class="flex flex-wrap justify-between items-start gap-2">
                        <div class="font-medium">{comment.author?.name || 'Unknown User'}</div>
                        <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{formatDate(comment.createdAt)}</div>
                      </div>
                      <p class="mt-2 text-gray-800 whitespace-pre-line">{comment.body}</p>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-10 text-gray-400" in:fade={{ delay: 300 }}>
                  <svg class="w-10 h-10 mx-auto text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                  No comments yet
                </div>
              {/if}
            </div>
          </TabItem>
          <TabItem title="Tasks">
            <div class="p-4">
              <div class="flex justify-end mb-4">
                <Button size="xs" class="px-3 py-1.5">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Task
                </Button>
              </div>
              {#if lead.tasks && lead.tasks.length > 0}
                <div class="space-y-4">
                  {#each lead.tasks as task, i}
                    <div class="border rounded-lg p-4 hover:shadow-sm transition-shadow" in:fly={{ y: 20, delay: i * 80, duration: 300 }}>
                      <div class="flex flex-wrap justify-between items-start gap-2">
                        <div class="font-medium">{task.subject}</div>
                        <Badge color={task.status === 'Completed' ? 'green' : task.priority === 'High' ? 'red' : 'blue'}>
                          {task.status}
                        </Badge>
                      </div>
                      <div class="text-sm text-gray-500 mt-2 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Due: {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                      </div>
                      {#if task.description}
                        <p class="mt-2 text-sm text-gray-600 border-t pt-2">{task.description}</p>
                      {/if}
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-10 text-gray-400" in:fade={{ delay: 300 }}>
                  <svg class="w-10 h-10 mx-auto text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  No tasks yet
                </div>
              {/if}
            </div>
          </TabItem>
          <TabItem title="Events">
            <div class="p-4">
              <div class="flex justify-end mb-4">
                <Button size="xs" class="px-3 py-1.5">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Event
                </Button>
              </div>
              {#if lead.events && lead.events.length > 0}
                <div class="space-y-4">
                  {#each lead.events as event, i}
                    <div class="border rounded-lg p-4 hover:shadow-sm transition-shadow" in:fly={{ y: 20, delay: i * 80, duration: 300 }}>
                      <div class="font-medium">{event.subject}</div>
                      <div class="text-sm text-gray-500 mt-2 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </div>
                      {#if event.location}
                        <div class="text-sm mt-2 flex items-center">
                          <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {event.location}
                        </div>
                      {/if}
                      {#if event.description}
                        <p class="mt-2 text-sm text-gray-600 border-t pt-2">{event.description}</p>
                      {/if}
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-10 text-gray-400" in:fade={{ delay: 300 }}>
                  <svg class="w-10 h-10 mx-auto text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  No events scheduled
                </div>
              {/if}
            </div>
          </TabItem>
        </Tabs>
      </Card>
    </section>
  </main>
</div>
