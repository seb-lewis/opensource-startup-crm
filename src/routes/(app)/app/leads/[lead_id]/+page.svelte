<script>
  import { Badge, Button, Spinner, Tabs, TabItem, Textarea, Toast } from 'flowbite-svelte';
  import { fly } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { UserCircle, Edit3, CheckCircle, Mail, Phone, Info, Star, Clock, MessageSquare, FileText, Users, Link as LinkIcon, ChevronRight } from '@lucide/svelte';

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
    if (!dateString) return 'N/A';
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
        return 'gray'; // Default to gray for unknown statuses
    }
  }
  
  const enhanceConvertForm = () => {
    isConverting = true;
    return async ({ update }) => {
      await update({ reset: false });
    };
  };

  const enhanceCommentForm = () => {
    isSubmittingComment = true;
    return async ({ update }) => {
      await update({ reset: false });
    };
  };


  $: if (form?.status === 'success') {
    toastMessage = form.message || 'Action completed successfully!';
    toastType = 'success';
    showToast = true;
    invalidateAll(); // This reloads all data, including lead and comments
    isConverting = false;
    isSubmittingComment = false;
    if (form.commentAdded) { // Assuming the server action returns { commentAdded: true }
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

{#if showToast}
  <Toast dismissable bind:open={showToast} color={toastType === 'success' ? 'green' : toastType === 'error' ? 'red' : 'blue'} position="top-right" class="mt-4 mr-4 fixed z-50">
    <span class="font-medium">{toastMessage}</span>
  </Toast>
{/if}

<div class="min-h-screen bg-slate-100 dark:bg-gray-950">
  <main class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Main Content Area -->
      <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <!-- Breadcrumbs -->
        <nav aria-label="breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <li><a href="/app/leads" class="hover:text-blue-600 dark:hover:text-blue-400">Leads</a></li>
            <li><ChevronRight class="h-4 w-4 text-slate-400 dark:text-slate-500" /></li>
            <li aria-current="page" class="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs md:max-w-md">{getFullName(lead)}</li>
          </ol>
        </nav>

        <!-- Lead Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
          <div class="flex-shrink-0 bg-blue-600 text-white p-3 rounded-full shadow-md ring-4 ring-white dark:ring-gray-800">
            <UserCircle class="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div class="flex-grow">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{getFullName(lead)}</h1>
            <div class="flex items-center gap-2">
              <p class="text-slate-600 dark:text-slate-400 text-lg">Lead</p>
              <Badge color={getStatusColor(lead.status)} class="text-xs font-medium px-2 py-0.5 rounded-md">{lead.status}</Badge>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2 sm:pt-0">
            {#if lead.status !== 'CONVERTED'}
              <form method="POST" action="?/convert" use:enhance={enhanceConvertForm} class="w-full sm:w-auto">
                <Button type="submit" color="blue" class="w-full shadow-md" disabled={isConverting}>
                  {#if isConverting}
                    <Spinner size="4" class="mr-1.5" /> Converting...
                  {:else}
                    <CheckCircle class="w-5 h-5 mr-1.5" /> Convert Lead
                  {/if}
                </Button>
              </form>
            {/if}
            <Button color="alternative" href="/app/leads/{lead.id}/edit" class="w-full sm:w-auto shadow-md" disabled={isConverting || lead.status === 'CONVERTED'}>
              <Edit3 class="w-5 h-5 mr-1.5" /> Edit
            </Button>
          </div>
        </div>

        <!-- Tabs Section -->
        <div class="border-b border-slate-200 dark:border-gray-700 mb-6">
          
              <div class="space-y-6">
                <section>
                  <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Lead Information</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
                    {#each [
                      { label: 'Full Name', value: getFullName(lead) },
                      { label: 'Company', value: lead.company },
                      { label: 'Email', value: lead.email, href: `mailto:${lead.email}` },
                      { label: 'Phone', value: lead.phone, href: `tel:${lead.phone}` },
                      { label: 'Lead Source', value: lead.leadSource?.replace('_', ' ')?.toLowerCase(), capitalize: true },
                      { label: 'Industry', value: lead.industry }
                    ] as item}
                      {#if item.value}
                        <div class="py-3 border-b border-slate-200 dark:border-gray-700">
                          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-0.5">{item.label}</p>
                          {#if item.href}
                            <a href={item.href} class="text-blue-600 dark:text-blue-400 hover:underline text-sm"><p class="text-slate-800 dark:text-slate-100 text-sm {item.capitalize ? 'capitalize' : ''}">{item.value}</p></a>
                          {:else}
                            <p class="text-slate-800 dark:text-slate-100 text-sm {item.capitalize ? 'capitalize' : ''}">{item.value}</p>
                          {/if}
                        </div>
                      {/if}
                    {/each}
                  </div>
                </section>

                <section>
                  <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Additional Details</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
                    {#if lead.rating}
                    <div class="py-3 border-b border-slate-200 dark:border-gray-700">
                      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-0.5">Rating</p>
                      <span class="flex mt-1">
                        {#each Array(parseInt(lead.rating) || 0) as _, i}
                          <Star class="w-4 h-4 text-yellow-400 fill-current" />
                        {/each}
                        {#each Array(5 - (parseInt(lead.rating) || 0)) as _, i}
                           <Star class="w-4 h-4 text-gray-300 dark:text-gray-600 fill-current" />
                        {/each}
                      </span>
                    </div>
                    {/if}
                    {#if lead.annualRevenue}
                    <div class="py-3 border-b border-slate-200 dark:border-gray-700">
                      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-0.5">Annual Revenue</p>
                      <p class="text-slate-800 dark:text-slate-100 text-sm">${lead.annualRevenue.toLocaleString()}</p>
                    </div>
                    {/if}
                    {#if lead.address}
                    <div class="py-3 border-b border-slate-200 dark:border-gray-700 md:col-span-2">
                      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-0.5">Address</p>
                      <p class="text-slate-800 dark:text-slate-100 text-sm whitespace-pre-line">{lead.address}</p>
                    </div>
                    {/if}
                  </div>
                </section>
                
                <section>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
                    <div class="py-3 border-b border-slate-200 dark:border-gray-700">
                      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-0.5">Status</p>
                      <p class="text-slate-800 dark:text-slate-100 text-sm font-medium">{lead.status}</p>
                    </div>
                     <div class="py-3 border-b border-slate-200 dark:border-gray-700">
                      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-0.5">Lead Owner</p>
                      <p class="text-slate-800 dark:text-slate-100 text-sm">{lead.owner?.name || 'Unassigned'}</p>
                    </div>
                    <div class="py-3 border-b border-slate-200 dark:border-gray-700">
                      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-0.5">Created At</p>
                      <p class="text-slate-800 dark:text-slate-100 text-sm">{formatDate(lead.createdAt)}</p>
                    </div>
                    <div class="py-3 border-b border-slate-200 dark:border-gray-700">
                      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-0.5">Updated At</p>
                      <p class="text-slate-800 dark:text-slate-100 text-sm">{formatDate(lead.updatedAt)}</p>
                    </div>
                    {#if lead.isConverted && lead.convertedAt}
                      <div class="py-3 border-b border-slate-200 dark:border-gray-700">
                        <p class="text-xs text-green-500 dark:text-green-400 uppercase tracking-wider font-medium mb-0.5">Converted At</p>
                        <p class="text-green-700 dark:text-green-300 text-sm font-medium">{formatDate(lead.convertedAt)}</p>
                      </div>
                    {/if}
                  </div>
                </section>
              </div>
              <div class="prose prose-sm max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-gray-700/30 p-4 rounded-md border border-slate-200 dark:border-gray-700">
                {@html lead.description}
              </div>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="w-full lg:w-[32rem] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 self-start">
        <div>
          <h2 class="text-xl font-semibold text-slate-800 dark:text-white mb-6">Notes</h2>
          
          <form method="POST" action="?/addComment" use:enhance={enhanceCommentForm} class="mb-6">
            <Textarea name="comment" bind:value={newComment} placeholder="Add a note or log activity..." rows={3}
                      class="w-full bg-slate-50 dark:bg-gray-700 border-slate-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-gray-400 rounded-lg shadow-sm text-sm" />
            <div class="flex justify-end mt-3">
              <Button type="submit" size="sm" color="blue" disabled={!newComment.trim() || isSubmittingComment}
                      class="rounded-md shadow-sm">
                {#if isSubmittingComment}
                  <Spinner size="4" class="mr-2" /> Adding...
                {:else}
                  <MessageSquare class="w-4 h-4 mr-1.5" /> Add Note
                {/if}
              </Button>
            </div>
          </form>
          
          <div class="space-y-6">
            {#if lead.comments && lead.comments.length > 0}
              {#each lead.comments as comment, i (comment.id || i)}
                <div class="relative flex gap-4 pl-2" in:fly={{ y: 10, delay: i * 60, duration: 200 }}>
                  <div class="absolute left-[calc(1rem-1px)] top-0 h-full w-0.5 bg-slate-200 dark:bg-gray-700 transform -translate-x-1/2"></div>
                  <div class="relative z-10 flex-shrink-0">
                    {#if comment.author?.avatarUrl}
                      <img src={comment.author.avatarUrl} alt={comment.author.name} class="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-gray-800" />
                    {:else}
                      <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-600 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm ring-2 ring-white dark:ring-gray-800">
                        <UserCircle class="w-5 h-5" />
                      </div>
                    {/if}
                  </div>
                  <div class="flex-1 pb-4 border-b border-slate-200 dark:border-gray-700 last:border-b-0">
                    <div class="flex items-center justify-between mb-0.5">
                      <p class="text-slate-800 dark:text-slate-100 text-sm font-medium">{comment.author?.name || 'Unknown User'}</p>
                      <p class="text-slate-500 dark:text-slate-400 text-xs">{formatDate(comment.createdAt)}</p>
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">{comment.body}</p>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="text-center py-8 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg bg-slate-50 dark:bg-gray-700/30">
                <MessageSquare class="w-10 h-10 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
                <p class="text-md font-medium text-slate-700 dark:text-slate-300">No activity yet</p>
                <p class="text-sm mt-1 text-slate-500 dark:text-slate-400">Be the first to add a note or log an interaction.</p>
              </div>
            {/if}
          </div>
        </div>

        {#if lead.convertedContactId && lead.contact}
          <div>
            <h2 class="text-xl font-semibold text-slate-800 dark:text-white mb-4 pt-4 border-t border-slate-200 dark:border-gray-700">Related Contact</h2>
            <div class="border border-slate-200 dark:border-gray-700 rounded-lg p-4 bg-slate-50 dark:bg-gray-700/50">
              <div class="font-medium text-slate-900 dark:text-white text-md">{lead.contact.firstName} {lead.contact.lastName}</div>
              {#if lead.contact.email}
                <div class="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <Mail class="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  {lead.contact.email}
                </div>
              {/if}
              {#if lead.contact.phone}
                <div class="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <Phone class="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  {lead.contact.phone}
                </div>
              {/if}
              <Button size="xs" color="light" href={`/app/contacts/${lead.contact.id}`} class="w-full mt-4 shadow-sm">
                View Contact
              </Button>
            </div>
          </div>
        {/if}
      </aside>
    </div>
  </main>
</div>
