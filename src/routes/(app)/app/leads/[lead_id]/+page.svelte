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

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 pb-12">
  <!-- Sticky Top Bar -->
  <header class="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <a href="/app/leads/open" aria-label="Back to leads list" class="text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-full p-2 transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 class="text-xl md:text-2xl font-bold text-blue-900 tracking-tight truncate">{getFullName(lead)}</h1>
        <Badge color={getStatusColor(lead.status)} class="ml-2 text-xs font-medium px-3 py-1">{lead.status}</Badge>
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
            <Button type="submit" color="green" size="sm" disabled={isConverting} class="shadow-sm hover:shadow transition-all duration-200">
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
        <Button color="light" size="sm" href="/app/leads/{lead.id}/edit" disabled={isConverting || lead.status === 'CONVERTED'} class="shadow-sm hover:shadow transition-all duration-200">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          Edit
        </Button>
      </div>
    </div>
  </header>

  <main class="px-4 sm:px-6 py-6 pb-8 max-w-7xl mx-auto">
    <!-- Responsive grid: sidebar + main content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Sidebar: Lead Summary -->
      <div class="space-y-6 md:col-span-1">
        <!-- Lead Status Card -->
        <Card class="shadow-lg border-0 bg-white/95 overflow-visible">
          <div class="flex flex-col items-center py-8 relative">
            <div class="absolute -top-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="mt-10">
              <h2 class="mt-2 text-2xl font-bold text-blue-900 tracking-tight">{getFullName(lead)}</h2>
              <div class="flex justify-center mt-2">
                <Badge color={getStatusColor(lead.status)} class="px-3 py-1 text-sm">{lead.status}</Badge>
              </div>
              {#if lead.title}
                <div class="text-sm text-blue-700 mt-1">{lead.title}</div>
              {/if}
              {#if lead.company}
                <div class="text-sm text-gray-500 mt-1">{lead.company}</div>
              {/if}
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="border-t border-blue-100 pt-5 px-4 bg-gradient-to-b from-white to-blue-50">
            <div class="text-sm font-semibold text-blue-800 mb-3">Quick Actions</div>
            <div class="grid grid-cols-2 gap-2">
              <Button color="blue" size="sm" class="w-full shadow-sm hover:shadow transition-all duration-200">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Email
              </Button>
              <Button color="green" size="sm" class="w-full shadow-sm hover:shadow transition-all duration-200">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Call
              </Button>
              <Button color="purple" size="sm" class="w-full shadow-sm hover:shadow transition-all duration-200">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Meeting
              </Button>
              <Button color="yellow" size="sm" class="w-full shadow-sm hover:shadow transition-all duration-200">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Task
              </Button>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="border-t border-blue-100 pt-5 px-5 space-y-4 mt-3">
            <h3 class="text-sm font-semibold text-blue-800 uppercase tracking-wider">Contact Information</h3>
            {#if lead.email}
              <div class="flex items-center gap-3 p-3 bg-blue-50/80 rounded-lg hover:bg-blue-100/80 transition-colors duration-200">
                <div class="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <a href="mailto:{lead.email}" class="text-blue-700 hover:text-blue-900 hover:underline font-medium">{lead.email}</a>
              </div>
            {/if}
            {#if lead.phone}
              <div class="flex items-center gap-3 p-3 bg-green-50/80 rounded-lg hover:bg-green-100/80 transition-colors duration-200">
                <div class="bg-green-100 p-2 rounded-lg text-green-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <a href="tel:{lead.phone}" class="text-green-700 hover:text-green-900 hover:underline font-medium">{lead.phone}</a>
              </div>
            {/if}
          </div>

          <!-- Lead Details -->
          <div class="border-t border-blue-100 pt-5 px-5 space-y-4 mt-3">
            <h3 class="text-sm font-semibold text-blue-800 uppercase tracking-wider">Lead Details</h3>
            <div class="space-y-3 bg-gray-50/80 rounded-lg p-4">
              {#if lead.leadSource}
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Source</span>
                  <span class="font-medium capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">{lead.leadSource.replace('_', ' ').toLowerCase()}</span>
                </div>
              {/if}
              {#if lead.industry}
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Industry</span>
                  <span class="font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-md text-sm">{lead.industry}</span>
                </div>
              {/if}
              {#if lead.rating}
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Rating</span>
                  <div class="flex gap-1">
                    {#each Array(parseInt(lead.rating) || 0) as _, i}
                      <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <!-- Timeline -->
          <div class="border-t border-blue-100 pt-5 px-5 space-y-4 mt-3">
            <h3 class="text-sm font-semibold text-blue-800 uppercase tracking-wider">Timeline</h3>
            <div class="space-y-4 relative before:absolute before:left-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-100">
              <div class="flex gap-4 items-center">
                <div class="h-5 w-5 rounded-full bg-blue-200 border-2 border-blue-500 z-10"></div>
                <div class="flex justify-between w-full items-center">
                  <span class="text-gray-600 font-medium">Created</span>
                  <span class="font-medium text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-md">{formatDate(lead.createdAt)}</span>
                </div>
              </div>
              <div class="flex gap-4 items-center">
                <div class="h-5 w-5 rounded-full bg-blue-200 border-2 border-blue-500 z-10"></div>
                <div class="flex justify-between w-full items-center">
                  <span class="text-gray-600 font-medium">Updated</span>
                  <span class="font-medium text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-md">{formatDate(lead.updatedAt)}</span>
                </div>
              </div>
              {#if lead.isConverted && lead.convertedAt}
                <div class="flex gap-4 items-center">
                  <div class="h-5 w-5 rounded-full bg-green-200 border-2 border-green-500 z-10"></div>
                  <div class="flex justify-between w-full items-center">
                    <span class="text-green-700 font-medium">Converted</span>
                    <span class="font-medium text-sm bg-green-50 text-green-800 px-3 py-1 rounded-md">{formatDate(lead.convertedAt)}</span>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </Card>

        <!-- Owner Card -->
        <Card class="shadow-lg border-0 bg-white/95 hover:shadow-xl transition-shadow duration-300">
          <h3 class="text-base font-semibold mb-4 text-blue-900 border-b pb-3">Lead Owner</h3>
          <div class="flex items-center gap-4 p-2">
            <div class="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-3 rounded-lg shadow-md">
              <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <div class="font-medium text-lg">{lead.owner?.name || 'Unassigned'}</div>
              {#if lead.owner?.email}
                <div class="text-sm text-gray-500">{lead.owner.email}</div>
              {/if}
            </div>
          </div>
          <Button size="xs" color="alternative" class="w-full mt-4 shadow-sm hover:shadow transition-all duration-200">Change Owner</Button>
        </Card>

        <!-- Related Contact -->
        {#if lead.convertedContactId && lead.contact}
          <Card class="shadow-lg border-0 bg-white/95 hover:shadow-xl transition-shadow duration-300">
            <h3 class="text-base font-semibold mb-4 text-blue-900 border-b pb-3">Related Contact</h3>
            <div class="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200" in:scale={{ duration: 200 }}>
              <div class="font-medium text-gray-900 text-lg">{lead.contact.firstName} {lead.contact.lastName}</div>
              {#if lead.contact.email}
                <div class="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {lead.contact.email}
                </div>
              {/if}
              {#if lead.contact.phone}
                <div class="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {lead.contact.phone}
                </div>
              {/if}
              <Button size="xs" href={`/app/contacts/${lead.contact.id}`} class="w-full mt-3 shadow-sm hover:shadow transition-all duration-200">
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
          <Card class="shadow-lg border-0 bg-white/95 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center gap-3 border-b pb-3 mb-4">
              <div class="bg-blue-100 p-2 rounded-lg text-blue-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-blue-900">Description</h3>
            </div>
            <div class="prose max-w-none text-gray-700 bg-gray-50/80 p-5 rounded-lg border border-gray-100">
              {lead.description}
            </div>
          </Card>
        {/if}

        <!-- Tabs Section -->
        <Card class="shadow-lg border-0 bg-white/95 hover:shadow-xl transition-shadow duration-300">
          <Tabs style="pills" contentClass="p-0 mt-4">
            <TabItem open title="Comments">
              <div class="p-4">
                <div class="mb-6">
                  <form method="POST" action="?/addComment" use:enhance={() => {
                    isSubmittingComment = true;
                    return async ({ update }) => {
                      await update({ reset: false });
                    };
                  }}>
                    <Textarea name="comment" bind:value={newComment} placeholder="Add a comment..." rows={3} 
                              class="focus:border-blue-500 focus:ring-blue-500 bg-blue-50/50" />
                    <div class="flex justify-end mt-3">
                      <Button type="submit" size="sm" color="blue" disabled={!newComment || isSubmittingComment}
                              class="px-4 py-2 transition-all duration-200 hover:shadow shadow-sm">
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
                    <div class="border rounded-lg p-5 hover:shadow-md transition-shadow bg-white" in:fly={{ y: 20, delay: i * 80, duration: 300 }}>
                      <div class="flex items-start gap-4">
                        <div class="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-3 rounded-lg shadow-sm">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between pb-2 border-b">
                            <div class="font-medium text-lg">{comment.author?.name || 'Unknown'}</div>
                            <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{formatDate(comment.createdAt)}</div>
                          </div>
                          <p class="mt-3 text-gray-700 whitespace-pre-line">{comment.text || comment.content || ''}</p>
                        </div>
                      </div>
                    </div>
                  {/each}
                  
                  {#if !lead.comments || lead.comments.length === 0}
                    <div class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <div class="text-gray-400 flex flex-col items-center">
                        <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                        </svg>
                        <p class="text-lg font-medium">No comments yet</p>
                        <p class="text-sm mt-1">Be the first to add a comment to this lead</p>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </TabItem>

            <TabItem title="Tasks">
              <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold text-blue-900">Tasks</h3>
                  <Button size="xs" color="blue" class="px-3 py-1 shadow-sm">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    New Task
                  </Button>
                </div>
                
                {#if lead.tasks && lead.tasks.length > 0}
                  <div class="space-y-4">
                    {#each lead.tasks as task, i}
                      <div class="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white" in:fly={{ y: 20, delay: i * 80, duration: 300 }}>
                        <div class="flex items-start justify-between">
                          <div class="flex items-center gap-3">
                            <div class="relative">
                              <input type="checkbox" class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" checked={task.completed || false} />
                              {#if task.completed}
                                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </div>
                              {/if}
                            </div>
                            <div class="font-medium text-lg">{task.subject}</div>
                          </div>
                          <Badge color={getPriorityColor(task.priority)} class="text-xs px-2.5 py-1">{task.priority}</Badge>
                        </div>
                        {#if task.description}
                          <p class="mt-3 text-sm text-gray-600 pl-8">{task.description}</p>
                        {/if}
                        <div class="mt-3 flex items-center gap-3 text-xs text-gray-500 pl-8">
                          <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span class="font-medium">Due: {formatDate(task.dueDate)}</span>
                          </div>
                          <Button size="xs" color="light" class="text-xs px-2 py-0.5 ml-auto">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Edit
                          </Button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div class="text-gray-400 flex flex-col items-center">
                      <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <p class="text-lg font-medium">No tasks found</p>
                      <p class="text-sm mt-1">Create a new task for this lead</p>
                    </div>
                  </div>
                {/if}
              </div>
            </TabItem>

            <TabItem title="Events">
              <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold text-blue-900">Events</h3>
                  <Button size="xs" color="blue" class="px-3 py-1 shadow-sm">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    New Event
                  </Button>
                </div>
                
                {#if lead.events && lead.events.length > 0}
                  <div class="space-y-4">
                    {#each lead.events as event, i}
                      <div class="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white" in:fly={{ y: 20, delay: i * 80, duration: 300 }}>
                        <div class="flex items-start gap-4">
                          <div class="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center min-w-[3rem]">
                            <div class="text-xs font-bold">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</div>
                            <div class="text-xl font-bold">{new Date(event.startDate).getDate()}</div>
                          </div>
                          <div class="flex-1">
                            <div class="font-medium text-lg text-indigo-900">{event.subject}</div>
                            <div class="text-sm text-gray-600 mt-2 flex items-center">
                              <svg class="w-4 h-4 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {formatDate(event.startDate)} - {formatDate(event.endDate)}
                            </div>
                            {#if event.location}
                              <div class="text-sm mt-2 flex items-center text-gray-600">
                                <svg class="w-4 h-4 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                {event.location}
                              </div>
                            {/if}
                            {#if event.description}
                              <p class="mt-3 text-sm text-gray-600 bg-indigo-50/60 p-3 rounded border border-indigo-100">{event.description}</p>
                            {/if}
                          </div>
                          <Button size="xs" color="light" class="self-start p-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div class="text-gray-400 flex flex-col items-center">
                      <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p class="text-lg font-medium">No events found</p>
                      <p class="text-sm mt-1">Schedule a new event for this lead</p>
                    </div>
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
