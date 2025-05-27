<script>
  import { fly } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { 
    UserCircle, 
    Edit3, 
    CheckCircle, 
    Mail, 
    Phone, 
    Building, 
    MapPin, 
    Star, 
    MessageSquare, 
    ChevronRight, 
    Calendar, 
    TrendingUp,
    DollarSign,
    Briefcase,
    Globe,
    User,
    Clock,
    Target,
    Users,
    Plus,
    X,
    Loader2,
    ExternalLink,
    MapPin as Location,
    Award,
    Activity,
    Send,
    Copy,
    MoreVertical
  } from '@lucide/svelte';

  export let data;
  export let form;
  const { lead } = data;

  let newComment = '';
  let isSubmittingComment = false;
  let isConverting = false;

  // Toast state variables
  let showToast = false;
  let toastMessage = '';
  let toastType = 'success';

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Function to format date (short)
  function formatDateShort(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Function to map lead status to colors
  function getStatusColor(status) {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20';
      case 'CONTACTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
      case 'QUALIFIED':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20';
      case 'UNQUALIFIED':
        return 'bg-red-50 text-red-700 border-red-200 ring-red-600/20';
      case 'CONVERTED':
        return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-600/20';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-600/20';
    }
  }

  // Function to get lead source display name
  function getLeadSourceDisplay(source) {
    if (!source) return 'Unknown';
    return source.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  // Function to get initials for avatar
  function getInitials(lead) {
    const first = lead.firstName?.[0] || '';
    const last = lead.lastName?.[0] || '';
    return (first + last).toUpperCase();
  }

  // Function to copy email to clipboard
  async function copyEmail() {
    if (lead.email) {
      await navigator.clipboard.writeText(lead.email);
      toastMessage = 'Email copied to clipboard';
      toastType = 'success';
      showToast = true;
    }
  }

  // Function to copy phone to clipboard
  async function copyPhone() {
    if (lead.phone) {
      await navigator.clipboard.writeText(lead.phone);
      toastMessage = 'Phone number copied to clipboard';
      toastType = 'success';
      showToast = true;
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

  function closeToast() {
    showToast = false;
  }

  $: if (form?.status === 'success') {
    toastMessage = form.message || 'Action completed successfully!';
    toastType = 'success';
    showToast = true;
    invalidateAll();
    isConverting = false;
    isSubmittingComment = false;
    if (form.commentAdded) {
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

<!-- Toast -->
{#if showToast}
  <div class="fixed top-4 right-4 z-50 max-w-md" transition:fly={{ y: -20, duration: 300 }}>
    <div class="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-center gap-3">
      <div class="flex-shrink-0">
        {#if toastType === 'success'}
          <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle class="w-4 h-4 text-green-600" />
          </div>
        {:else}
          <div class="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
            <X class="w-4 h-4 text-red-600" />
          </div>
        {/if}
      </div>
      <p class="text-sm text-gray-900 font-medium flex-1">{toastMessage}</p>
      <button 
        onclick={closeToast}
        class="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X class="w-4 h-4 text-gray-400" />
      </button>
    </div>
  </div>
{/if}

<div class="min-h-screen bg-gray-50">
  <main class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb" class="mb-8">
      <ol class="flex items-center gap-2 text-sm text-gray-500">
        <li><a href="/app/leads" class="hover:text-blue-600 transition-colors font-medium">Leads</a></li>
        <li><ChevronRight class="h-4 w-4 text-gray-400" /></li>
        <li class="font-medium text-gray-900 truncate max-w-xs">{getFullName(lead)}</li>
      </ol>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Header Card -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-8">
            <div class="flex flex-col sm:flex-row items-start gap-6">
              <div class="flex-shrink-0">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-xl">{getInitials(lead)}</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h1 class="text-3xl font-bold text-gray-900 mb-3">{getFullName(lead)}</h1>
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {getStatusColor(lead.status)} ring-1 ring-inset">
                    {lead.status}
                  </span>
                  {#if lead.company}
                    <div class="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <Building class="w-4 h-4" />
                      <span class="font-medium">{lead.company}</span>
                    </div>
                  {/if}
                  {#if lead.title}
                    <div class="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <Briefcase class="w-4 h-4" />
                      <span>{lead.title}</span>
                    </div>
                  {/if}
                </div>
                
                <!-- Contact Information Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {#if lead.email}
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Mail class="w-5 h-5 text-blue-600" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                        <a href="mailto:{lead.email}" class="text-sm text-gray-900 hover:text-blue-600 transition-colors font-medium truncate block">
                          {lead.email}
                        </a>
                      </div>
                      <button onclick={copyEmail} class="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded-lg transition-all">
                        <Copy class="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  {/if}
                  
                  {#if lead.phone}
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                      <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Phone class="w-5 h-5 text-green-600" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                        <a href="tel:{lead.phone}" class="text-sm text-gray-900 hover:text-green-600 transition-colors font-medium">
                          {lead.phone}
                        </a>
                      </div>
                      <button onclick={copyPhone} class="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded-lg transition-all">
                        <Copy class="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  {/if}
                </div>

                <!-- Quick Actions -->
                <div class="flex flex-wrap gap-3">
                  {#if lead.email}
                    <a 
                      href="mailto:{lead.email}"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Send class="w-4 h-4" />
                      Send Email
                    </a>
                  {/if}
                  {#if lead.phone}
                    <a 
                      href="tel:{lead.phone}"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <Phone class="w-4 h-4" />
                      Call
                    </a>
                  {/if}
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col gap-3">
                {#if lead.status !== 'CONVERTED'}
                  <form method="POST" action="?/convert" use:enhance={enhanceConvertForm}>
                    <button 
                      type="submit" 
                      disabled={isConverting}
                      class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {#if isConverting}
                        <Loader2 class="w-4 h-4 animate-spin" />
                        Converting...
                      {:else}
                        <CheckCircle class="w-4 h-4" />
                        Convert Lead
                      {/if}
                    </button>
                  </form>
                {/if}
                <a 
                  href="/app/leads/{lead.id}/edit"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                >
                  <Edit3 class="w-4 h-4" />
                  Edit Lead
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Lead Details Card -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-8">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity class="w-5 h-5 text-blue-600" />
              </div>
              Lead Information
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Lead Source -->
              {#if lead.leadSource}
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Target class="w-4 h-4 text-gray-400" />
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lead Source</label>
                  </div>
                  <p class="text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                    {getLeadSourceDisplay(lead.leadSource)}
                  </p>
                </div>
              {/if}

              <!-- Industry -->
              {#if lead.industry}
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Briefcase class="w-4 h-4 text-gray-400" />
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Industry</label>
                  </div>
                  <p class="text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg capitalize">
                    {lead.industry}
                  </p>
                </div>
              {/if}

              <!-- Rating -->
              {#if lead.rating}
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Award class="w-4 h-4 text-gray-400" />
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</label>
                  </div>
                  <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    {#each Array(parseInt(lead.rating) || 0) as _, i}
                      <Star class="w-4 h-4 text-yellow-400 fill-current" />
                    {/each}
                    {#each Array(5 - (parseInt(lead.rating) || 0)) as _, i}
                      <Star class="w-4 h-4 text-gray-300 fill-current" />
                    {/each}
                    <span class="text-sm font-medium text-gray-700 ml-1">{lead.rating}/5</span>
                  </div>
                </div>
              {/if}

              <!-- Annual Revenue -->
              {#if lead.annualRevenue}
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <DollarSign class="w-4 h-4 text-gray-400" />
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Annual Revenue</label>
                  </div>
                  <p class="text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                    ${lead.annualRevenue.toLocaleString()}
                  </p>
                </div>
              {/if}

              <!-- Lead Owner -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <User class="w-4 h-4 text-gray-400" />
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lead Owner</label>
                </div>
                <p class="text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                  {lead.owner?.name || 'Unassigned'}
                </p>
              </div>

              <!-- Created Date -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</label>
                </div>
                <p class="text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                  {formatDateShort(lead.createdAt)}
                </p>
              </div>
            </div>

            <!-- Address -->
            {#if lead.address}
              <div class="mt-8 pt-6 border-t border-gray-200">
                <div class="flex items-center gap-2 mb-3">
                  <Location class="w-5 h-5 text-gray-400" />
                  <label class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                </div>
                <div class="bg-gray-50 p-4 rounded-xl">
                  <p class="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{lead.address}</p>
                </div>
              </div>
            {/if}

            <!-- Description -->
            {#if lead.description}
              <div class="mt-8 pt-6 border-t border-gray-200">
                <div class="flex items-center gap-2 mb-3">
                  <MessageSquare class="w-5 h-5 text-gray-400" />
                  <label class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                </div>
                <div class="bg-gray-50 p-4 rounded-xl">
                  <div class="prose prose-sm max-w-none text-gray-700">
                    {@html lead.description}
                  </div>
                </div>
              </div>
            {/if}

            <!-- Conversion Information -->
            {#if lead.isConverted}
              <div class="mt-8 pt-6 border-t border-gray-200">
                <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle class="w-5 h-5 text-green-600" />
                    </div>
                    <h3 class="text-sm font-semibold text-green-800">Lead Converted</h3>
                  </div>
                  {#if lead.convertedAt}
                    <p class="text-sm text-green-700">
                      Converted on {formatDate(lead.convertedAt)}
                    </p>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Activity Feed -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare class="w-5 h-5 text-blue-600" />
              </div>
              Activity & Notes
            </h2>
          </div>
          
          <div class="p-6">
            <!-- Add Note Form -->
            <form method="POST" action="?/addComment" use:enhance={enhanceCommentForm} class="mb-6">
              <div class="space-y-4">
                <textarea 
                  name="comment" 
                  bind:value={newComment} 
                  placeholder="Add a note or log activity..." 
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                ></textarea>
                <div class="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={!newComment.trim() || isSubmittingComment}
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {#if isSubmittingComment}
                      <Loader2 class="w-4 h-4 animate-spin" />
                      Adding...
                    {:else}
                      <Plus class="w-4 h-4" />
                      Add Note
                    {/if}
                  </button>
                </div>
              </div>
            </form>
            
            <!-- Activity List -->
            <div class="space-y-4">
              {#if lead.comments && lead.comments.length > 0}
                {#each lead.comments as comment, i (comment.id || i)}
                  <div class="flex gap-4 p-4 bg-gray-50 rounded-xl" in:fly={{ y: 10, delay: i * 60, duration: 200 }}>
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <User class="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-3 mb-2">
                        <p class="text-sm font-semibold text-gray-900">{comment.author?.name || 'Unknown User'}</p>
                        <p class="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">{formatDate(comment.createdAt)}</p>
                      </div>
                      <p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{comment.body}</p>
                    </div>
                  </div>
                {/each}
              {:else}
                <div class="text-center py-12">
                  <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <MessageSquare class="w-8 h-8 text-gray-400" />
                  </div>
                  <p class="text-sm font-semibold text-gray-900 mb-1">No activity yet</p>
                  <p class="text-xs text-gray-500">Be the first to add a note or log an interaction.</p>
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Related Contact (if converted) -->
        {#if lead.convertedContactId && lead.contact}
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users class="w-5 h-5 text-green-600" />
                </div>
                Related Contact
              </h2>
            </div>
            
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <User class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{lead.contact.firstName} {lead.contact.lastName}</p>
                    <p class="text-xs text-gray-500">Contact</p>
                  </div>
                </div>
                
                {#if lead.contact.email}
                  <div class="flex items-center gap-3 text-sm text-gray-600">
                    <Mail class="w-4 h-4" />
                    <span>{lead.contact.email}</span>
                  </div>
                {/if}
                
                {#if lead.contact.phone}
                  <div class="flex items-center gap-3 text-sm text-gray-600">
                    <Phone class="w-4 h-4" />
                    <span>{lead.contact.phone}</span>
                  </div>
                {/if}
                
                <a 
                  href="/app/contacts/{lead.contact.id}"
                  class="inline-flex items-center justify-center w-full px-4 py-3 bg-green-50 text-green-700 text-sm font-semibold rounded-xl hover:bg-green-100 transition-colors"
                >
                  <ExternalLink class="w-4 h-4 mr-2" />
                  View Contact
                </a>
              </div>
            </div>
          </div>
        {/if}

        <!-- Quick Stats -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-3">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp class="w-5 h-5 text-purple-600" />
              </div>
              Quick Stats
            </h2>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Comments</span>
              <span class="text-sm font-semibold text-gray-900">{lead.comments?.length || 0}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Days Since Created</span>
              <span class="text-sm font-semibold text-gray-900">
                {Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
            {#if lead.convertedAt}
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Days to Convert</span>
                <span class="text-sm font-semibold text-green-600">
                  {Math.floor((new Date(lead.convertedAt) - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
