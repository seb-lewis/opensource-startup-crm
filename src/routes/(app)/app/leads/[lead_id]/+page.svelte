<script>
  import { Badge, Button, Card, Spinner, Tabs, TabItem, Textarea, Toast } from 'flowbite-svelte';
  import { fly, fade, scale } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { goto } from '$app/navigation';

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

  // Function to get the full name of a lead
  function getFullName(lead) {
    return `${lead.firstName} ${lead.lastName}`.trim();
  }

  // Function to format date
  function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Function to map lead status to badge color
  function getStatusColor(status) {
    switch (status) {
      case 'NEW':
        return 'blue';
      case 'PENDING':
        return 'purple';
      case 'CONTACTED':
        return 'green';
      case 'QUALIFIED':
        return 'indigo';
      case 'UNQUALIFIED':
        return 'red';
      case 'CONVERTED':
        return 'dark';
      default:
        return 'blue';
    }
  }

  // Function to get task priority color
  function getPriorityColor(priority) {
    switch (priority) {
      case 'HIGH':
        return 'red';
      case 'MEDIUM':
        return 'yellow';
      case 'LOW':
        return 'green';
      default:
        return 'green';
    }
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
</script>

<!-- Use Toast component properly -->
{#if showToast}
  <Toast dismissable bind:open={showToast} color={toastType === 'success' ? 'green' : toastType === 'error' ? 'red' : 'blue'} position="top-right">
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
            <Button type="submit" color="green" size="sm" disabled={isConverting}>
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

  <main class="px-4 sm:px-6 py-4 pb-8 max-w-7xl mx-auto">
    <!-- Responsive grid: sidebar + main content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Sidebar: Lead Summary -->
      <div class="space-y-6 md:col-span-1">
        <!-- Lead Status Card -->
        <Card class="shadow-lg border-0 bg-white/90">
          <div class="flex flex-col items-center py-6">
            <div class="relative">
              <div class="bg-gradient-to-tr from-blue-200 to-blue-400 text-blue-900 p-5 rounded-full shadow">
                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1">
                <Badge color={getStatusColor(lead.status)} class="px-3 py-1">{lead.status}</Badge>
              </div>
            </div>
            <h2 class="mt-4 text-xl font-bold text-blue-900">{getFullName(lead)}</h2>
            {#if lead.title}
              <div class="text-sm text-blue-700">{lead.title}</div>
            {/if}
            {#if lead.company}
              <div class="text-sm text-gray-500 mt-1">{lead.company}</div>
            {/if}
          </div>
          
          <!-- Quick Actions -->
          <div class="border-t pt-4 px-4">
            <div class="grid grid-cols-2 gap-2">
              <Button color="blue" size="sm" class="w-full">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Email
              </Button>
              <Button color="green" size="sm" class="w-full">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Call
              </Button>
              <Button color="purple" size="sm" class="w-full">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Meeting
              </Button>
              <Button color="yellow" size="sm" class="w-full">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Task
              </Button>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="border-t pt-4 px-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Information</h3>
            {#if lead.email}
              <div class="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <a href="mailto:{lead.email}" class="text-blue-700 hover:underline">{lead.email}</a>
              </div>
            {/if}
            {#if lead.phone}
              <div class="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <a href="tel:{lead.phone}" class="text-green-700 hover:underline">{lead.phone}</a>
              </div>
            {/if}
          </div>

          <!-- Lead Details -->
          <div class="border-t pt-4 px-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lead Details</h3>
            <div class="space-y-2">
              {#if lead.leadSource}
                <div class="flex justify-between">
                  <span class="text-gray-500">Source</span>
                  <span class="font-medium capitalize">{lead.leadSource.replace('_', ' ').toLowerCase()}</span>
                </div>
              {/if}
              {#if lead.industry}
                <div class="flex justify-between">
                  <span class="text-gray-500">Industry</span>
                  <span class="font-medium">{lead.industry}</span>
                </div>
              {/if}
              {#if lead.rating}
                <div class="flex justify-between">
                  <span class="text-gray-500">Rating</span>
                  <span class="font-medium">{lead.rating}</span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Timeline -->
          <div class="border-t pt-4 px-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Timeline</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Created</span>
                <span class="font-medium">{formatDate(lead.createdAt)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Updated</span>
                <span class="font-medium">{formatDate(lead.updatedAt)}</span>
              </div>
              {#if lead.isConverted && lead.convertedAt}
                <div class="flex justify-between text-green-600">
                  <span class="font-medium">Converted</span>
                  <span class="font-medium">{formatDate(lead.convertedAt)}</span>
                </div>
              {/if}
            </div>
          </div>
        </Card>

        <!-- Owner Card -->
        <Card class="shadow border-0 bg-white/90">
          <h3 class="text-base font-semibold mb-3 text-blue-900">Lead Owner</h3>
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
            </div>
          </div>
          <Button size="xs" color="alternative" class="w-full mt-4">Change Owner</Button>
        </Card>

        <!-- Related Contact -->
        {#if lead.convertedContactId && lead.contact}
          <Card class="shadow border-0 bg-white/90">
            <h3 class="text-base font-semibold mb-3 text-blue-900">Related Contact</h3>
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
          </Card>
        {/if}
      </div>

      <!-- Main Content -->
      <div class="space-y-6 md:col-span-2">
        <!-- Description Card -->
        {#if lead.description}
          <Card class="shadow-lg border-0 bg-white/95">
            <h3 class="text-lg font-semibold mb-4 text-blue-900">Description</h3>
            <div class="prose max-w-none text-gray-700">
              {lead.description}
            </div>
          </Card>
        {/if}

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
                    <Textarea name="comment" bind:value={newComment} placeholder="Add a comment..." rows={3} class="focus:border-blue-500" />
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

                <div class="space-y-4">
                  {#each lead.comments as comment, i}
                    <div class="border rounded-lg p-4 hover:shadow-sm transition-shadow" in:fly={{ y: 20, delay: i * 80, duration: 300 }}>
                      <div class="flex items-start gap-3">
                        <div class="bg-blue-100 text-blue-700 p-2 rounded-full">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <div class="font-medium">{comment.author?.name || 'Unknown'}</div>
                            <div class="text-xs text-gray-500">{formatDate(comment.createdAt)}</div>
                          </div>
                          <p class="mt-2 text-gray-700">{comment.text || comment.content || ''}</p>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </TabItem>

            <TabItem title="Tasks">
              <div class="p-4">
                {#if lead.tasks && lead.tasks.length > 0}
                  <div class="space-y-4">
                    {#each lead.tasks as task, i}
                      <div class="border rounded-lg p-4 hover:shadow-sm transition-shadow" in:fly={{ y: 20, delay: i * 80, duration: 300 }}>
                        <div class="flex items-start justify-between">
                          <div class="flex items-center gap-2">
                            <input type="checkbox" class="w-4 h-4 text-blue-600 rounded border-gray-300" checked={task.completed || false} />
                            <div class="font-medium">{task.subject}</div>
                          </div>
                          <Badge color={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        </div>
                        {#if task.description}
                          <p class="mt-2 text-sm text-gray-600">{task.description}</p>
                        {/if}
                        <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          Due: {formatDate(task.dueDate)}
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="text-center py-8 text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p>No tasks found</p>
                  </div>
                {/if}
              </div>
            </TabItem>

            <TabItem title="Events">
              <div class="p-4">
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
                  <div class="text-center py-8 text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p>No events found</p>
                  </div>
                {/if}
              </div>
            </TabItem>
          </Tabs>
        </Card>
      </div>
    </div>
  </main>
</div>
