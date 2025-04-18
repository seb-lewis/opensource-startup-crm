<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Tabs, TabItem, Button, Badge, Textarea, Card, Modal } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import TaskModal from '$lib/components/TaskModal.svelte';

  export let data;
  export let form;
  let users = Array.isArray(data.users) ? data.users : [];

  const { account, contacts, opportunities, quotes, tasks, cases } = data;
  let comments = data.comments;

  // Form state
  let showCloseModal = false;
  let closureReason = '';
  let closeError = '';
  let isClosing = false;

  // Add Contact Modal state
  let showAddContactModal = false;
  let contactForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    isPrimary: false,
    role: ''
  };
  let addContactError = '';
  let isAddingContact = false;

  function resetContactForm() {
    contactForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      isPrimary: false,
      role: ''
    };
    addContactError = '';
  }

  async function submitAddContact() {
    addContactError = '';
    if (!contactForm.firstName.trim() || !contactForm.lastName.trim()) {
      addContactError = 'First and last name are required.';
      return;
    }
    isAddingContact = true;
    try {
      // Use form-encoded data for SvelteKit form actions
      const formData = new FormData();
      formData.append('firstName', contactForm.firstName);
      formData.append('lastName', contactForm.lastName);
      formData.append('email', contactForm.email);
      formData.append('phone', contactForm.phone);
      formData.append('title', contactForm.title);
      formData.append('isPrimary', contactForm.isPrimary ? 'true' : '');
      formData.append('role', contactForm.role);
      const res = await fetch(`/app/accounts/${account.id}?/addContact`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        showAddContactModal = false;
        resetContactForm();
        await invalidateAll();
      } else {
        const data = await res.json();
        addContactError = data?.message || 'Failed to add contact.';
      }
    } catch (e) {
      addContactError = 'Failed to add contact.';
    } finally {
      isAddingContact = false;
    }
  }

  // Add Opportunity Modal state
  let showAddOpportunityModal = false;
  let opportunityForm = {
    name: '',
    amount: '',
    stage: 'PROSPECTING',
    closeDate: '',
    probability: ''
  };
  let addOpportunityError = '';
  let isAddingOpportunity = false;

  function resetOpportunityForm() {
    opportunityForm = {
      name: '',
      amount: '',
      stage: 'PROSPECTING',
      closeDate: '',
      probability: ''
    };
    addOpportunityError = '';
  }

  async function submitAddOpportunity() {
    addOpportunityError = '';
    if (!opportunityForm.name.trim()) {
      addOpportunityError = 'Opportunity name is required.';
      return;
    }
    isAddingOpportunity = true;
    try {
      const formData = new FormData();
      formData.append('name', opportunityForm.name);
      formData.append('amount', opportunityForm.amount);
      formData.append('stage', opportunityForm.stage);
      formData.append('closeDate', opportunityForm.closeDate);
      formData.append('probability', opportunityForm.probability);
      const res = await fetch(`/app/accounts/${account.id}?/addOpportunity`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        showAddOpportunityModal = false;
        resetOpportunityForm();
        await invalidateAll();
      } else {
        const data = await res.json();
        addOpportunityError = data?.message || 'Failed to add opportunity.';
      }
    } catch (e) {
      addOpportunityError = 'Failed to add opportunity.';
    } finally {
      isAddingOpportunity = false;
    }
  }

  // Task modal state
  let showTaskModal = false;
  let selectedTask = null;

  function openTaskModal(task) {
    selectedTask = task;
    showTaskModal = true;
  }
  function closeTaskModal() {
    showTaskModal = false;
    selectedTask = null;
  }

  // Add Task modal state
  let showAddTaskModal = false;
  let addTaskForm = {
    subject: '',
    description: '',
    dueDate: '',
    priority: 'Normal',
    ownerId: ''
  };
  let addTaskError = '';
  let isAddingTask = false;

  function resetAddTaskForm() {
    addTaskForm = {
      subject: '',
      description: '',
      dueDate: '',
      priority: 'Normal',
      ownerId: ''
    };
    addTaskError = '';
  }

  async function submitAddTask() {
    addTaskError = '';
    if (!addTaskForm.subject.trim()) {
      addTaskError = 'Subject is required.';
      return;
    }
    isAddingTask = true;
    try {
      const formData = new FormData();
      formData.append('subject', addTaskForm.subject);
      formData.append('description', addTaskForm.description);
      formData.append('dueDate', addTaskForm.dueDate);
      formData.append('priority', addTaskForm.priority);
      formData.append('ownerId', addTaskForm.ownerId);
      const res = await fetch(`?/addTask`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        showAddTaskModal = false;
        resetAddTaskForm();
        await invalidateAll();
      } else {
        const data = await res.json().catch(() => ({}));
        addTaskError = data?.error || data?.message || 'Failed to add task.';
      }
    } catch (e) {
      addTaskError = 'Failed to add task.';
    } finally {
      isAddingTask = false;
    }
  }

  // Format date string
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format currency
  function formatCurrency(value) {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  // Determine badge color based on opportunity stage
  function getStageBadgeColor(stage) {
    switch (stage?.toLowerCase()) {
      case 'prospecting': return 'blue';
      case 'qualification': return 'purple';
      case 'proposal': return 'indigo';
      case 'negotiation': return 'yellow';
      case 'closed_won': return 'green';
      case 'closed_lost': return 'red';
      default: return 'gray';
    }
  }

  // Handle comment submission
  let newComment = '';
  let isSubmittingComment = false;
  let commentError = '';

  async function submitComment() {
    commentError = '';
    if (!newComment.trim()) return;
    isSubmittingComment = true;
    try {
      const formData = new FormData();
      formData.append('body', newComment);
      const res = await fetch(`?/comment`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        // Instead of invalidateAll, fetch comments directly for instant update
        const commentsRes = await fetch(window.location.pathname + '?commentsOnly=1');
        if (commentsRes.ok) {
          const data = await commentsRes.json();
          if (Array.isArray(data.comments)) {
            comments = data.comments;
          }
        }
        newComment = '';
      } else {
        const data = await res.json().catch(() => ({}));
        commentError = data?.error || data?.message || 'Failed to add comment.';
      }
    } catch (err) {
      commentError = 'Failed to add comment.';
    } finally {
      isSubmittingComment = false;
    }
  }

  // Determine case status badge color
  function getCaseStatusBadgeColor(status) {
    switch (status?.toLowerCase()) {
      case 'open': return 'yellow';
      case 'in_progress': return 'blue';
      case 'closed': return 'green';
      default: return 'gray';
    }
  }

  // Determine quote status badge color
  function getQuoteStatusBadgeColor(status) {
    switch (status?.toLowerCase()) {
      case 'draft': return 'gray';
      case 'needs_review': return 'yellow';
      case 'in_review': return 'blue';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'presented': return 'purple';
      case 'accepted': return 'indigo';
      default: return 'gray';
    }
  }

  // Handle form submission errors
  $: {
    if (form?.success === false) {
      closeError = form.message;
    }
  }
</script>

<div class="p-4">
  <!-- Back Button and Header -->
  <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
    <div class="flex items-center mb-4 md:mb-0">
      <a 
        class="mr-3 inline-flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
        href="/app/accounts"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back
      </a>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{account.name}</h1>
    </div>
    
    <div class="flex items-center space-x-2">
      {#if account.closedAt}
        <form method="POST" action="?/reopenAccount">
          <Button type="submit" size="sm" color="green" class="ml-2">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            Reopen Account
          </Button>
        </form>
      {:else}
        <Button href="/app/accounts/{account.id}/edit" size="sm" color="light">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          Edit
        </Button>
        <Button on:click={() => showCloseModal = true} size="sm" color="yellow" class="ml-2">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Close Account
        </Button>
      {/if}
      <Button href="/app/accounts/{account.id}/delete" size="sm" color="red" class="ml-2">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        Delete
      </Button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Account Details Card -->
    <div class="md:col-span-2">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div class="mb-4 flex justify-between">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Account Information</h2>
          <Badge color={account.closedAt ? "red" : account.active ? "green" : "gray"}>
            {account.closedAt ? "Closed" : account.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
            <p class="text-base text-gray-900 dark:text-white">{account.name || 'N/A'}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</h3>
            <p class="text-base text-gray-900 dark:text-white">{account.industry || 'N/A'}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h3>
            <p class="text-base text-gray-900 dark:text-white">{account.type || 'N/A'}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Website</h3>
            {#if account.website}
              <a 
                href={account.website.startsWith('http') ? account.website : `https://${account.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-blue-600 dark:text-blue-500 hover:underline flex items-center"
              >
                {account.website}
                <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            {:else}
              <p class="text-base text-gray-900 dark:text-white">N/A</p>
            {/if}
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
            {#if account.phone}
              <a href={`tel:${account.phone}`} class="text-blue-600 dark:text-blue-500 hover:underline">
                {account.phone}
              </a>
            {:else}
              <p class="text-base text-gray-900 dark:text-white">N/A</p>
            {/if}
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
            {#if account.email}
              <a href={`mailto:${account.email}`} class="text-blue-600 dark:text-blue-500 hover:underline">
                {account.email}
              </a>
            {:else}
              <p class="text-base text-gray-900 dark:text-white">N/A</p>
            {/if}
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Annual Revenue</h3>
            <p class="text-base text-gray-900 dark:text-white">
              {account.annualRevenue ? formatCurrency(account.annualRevenue) : 'N/A'}
            </p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Employees</h3>
            <p class="text-base text-gray-900 dark:text-white">
              {account.numberOfEmployees ? account.numberOfEmployees.toLocaleString() : 'N/A'}
            </p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Ownership</h3>
            <p class="text-base text-gray-900 dark:text-white">{account.accountOwnership || 'N/A'}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Ticker Symbol</h3>
            <p class="text-base text-gray-900 dark:text-white">{account.tickerSymbol || 'N/A'}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</h3>
            <p class="text-base text-gray-900 dark:text-white">{account.rating || 'N/A'}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">SIC Code</h3>
            <p class="text-base text-gray-900 dark:text-white">{account.sicCode || 'N/A'}</p>
          </div>
        </div>
        
        <hr class="my-4 border-gray-200 dark:border-gray-700">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div class="md:col-span-2">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</h3>
            <address class="text-base text-gray-900 dark:text-white not-italic">
              {account.street || ''}<br>
              {account.city || ''}{account.city && account.state ? ', ' : ''}{account.state || ''} {account.postalCode || ''}<br>
              {account.country || ''}
            </address>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
            <p class="text-base text-gray-900 dark:text-white">{formatDate(account.createdAt)}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
            <p class="text-base text-gray-900 dark:text-white">{formatDate(account.updatedAt)}</p>
          </div>
          
          {#if account.description}
            <div class="md:col-span-2 mt-2">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
              <p class="text-base text-gray-900 dark:text-white whitespace-pre-line">{account.description}</p>
            </div>
          {/if}
          
          {#if account.closedAt}
            <div class="md:col-span-2 mt-4 bg-red-50 dark:bg-gray-700 border border-red-200 dark:border-red-700 p-4 rounded-lg">
              <div class="flex">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <div>
                  <p class="font-medium text-red-800 dark:text-red-200">This account was closed on {formatDate(account.closedAt)}.</p>
                  <p class="text-red-700 dark:text-red-300">Reason: {account.closureReason || 'No reason provided'}</p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Account Stats Card -->
    <div class="md:col-span-1">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Overview</h2>
        
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contacts</h3>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{contacts.length}</p>
            </div>
            <svg class="w-10 h-10 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Opportunities</h3>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{opportunities.length}</p>
            </div>
            <svg class="w-10 h-10 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Pipeline Value</h3>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0))}
              </p>
            </div>
            <svg class="w-10 h-10 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Open Cases</h3>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {cases.filter(c => c.status !== 'CLOSED').length}
              </p>
            </div>
            <svg class="w-10 h-10 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        
        <div class="mt-6">
          <Button on:click={() => showAddContactModal = true} color="blue" class="w-full justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            Add Contact
          </Button>
          <Button on:click={() => showAddOpportunityModal = true} color="green" class="w-full justify-center mt-3">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Opportunity
          </Button>
          <Button href="/app/cases/new?accountId={account.id}" color="red" class="w-full justify-center mt-3">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Open Case
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs for Related Information -->
  <div class="mt-6">
    <Tabs>
      <TabItem open title="Contacts ({contacts.length})">
        <div class="bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
          {#if contacts.length === 0}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="mt-2 text-gray-500 dark:text-gray-400">No contacts found for this account</p>
              <Button href="/app/contacts/new?accountId={account.id}" color="blue" class="mt-3">Add Contact</Button>
            </div>
          {:else}
            <div class="overflow-x-auto relative">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">Name</th>
                    <th scope="col" class="px-6 py-3">Title</th>
                    <th scope="col" class="px-6 py-3 hidden md:table-cell">Email</th>
                    <th scope="col" class="px-6 py-3 hidden lg:table-cell">Phone</th>
                    <th scope="col" class="px-6 py-3">Role</th>
                    <th scope="col" class="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {#each contacts as contact}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        <a href="/app/contacts/{contact.id}" class="hover:text-blue-600 dark:hover:text-blue-500 hover:underline">
                          {contact.firstName} {contact.lastName}
                        </a>
                        {#if contact.isPrimary}
                          <Badge color="blue" size="xs">Primary</Badge>
                        {/if}
                      </td>
                      <td class="px-6 py-4">{contact.title || 'N/A'}</td>
                      <td class="px-6 py-4 hidden md:table-cell">
                        {#if contact.email}
                          <a href="mailto:{contact.email}" class="text-blue-600 dark:text-blue-500 hover:underline">
                            {contact.email}
                          </a>
                        {:else}
                          N/A
                        {/if}
                      </td>
                      <td class="px-6 py-4 hidden lg:table-cell">
                        {#if contact.phone}
                          <a href="tel:{contact.phone}" class="text-blue-600 dark:text-blue-500 hover:underline">
                            {contact.phone}
                          </a>
                        {:else}
                          N/A
                        {/if}
                      </td>
                      <td class="px-6 py-4">{contact.role || 'N/A'}</td>
                      <td class="px-6 py-4 text-right">
                        <a href="/app/contacts/{contact.id}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </TabItem>
      
      <TabItem title="Opportunities ({opportunities.length})">
        <div class="bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
          {#if opportunities.length === 0}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="mt-2 text-gray-500 dark:text-gray-400">No opportunities found for this account</p>
              <Button href="/app/opportunities/new?accountId={account.id}" color="green" class="mt-3">Add Opportunity</Button>
            </div>
          {:else}
            <div class="overflow-x-auto relative">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">Name</th>
                    <th scope="col" class="px-6 py-3">Value</th>
                    <th scope="col" class="px-6 py-3">Stage</th>
                    <th scope="col" class="px-6 py-3 hidden md:table-cell">Close Date</th>
                    <th scope="col" class="px-6 py-3 hidden lg:table-cell">Probability</th>
                    <th scope="col" class="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {#each opportunities as opportunity}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        <a href="/app/opportunities/{opportunity.id}" class="hover:text-blue-600 dark:hover:text-blue-500 hover:underline">
                          {opportunity.name}
                        </a>
                      </td>
                      <td class="px-6 py-4">{formatCurrency(opportunity.amount)}</td>
                      <td class="px-6 py-4">
                        <Badge color={getStageBadgeColor(opportunity.stage)}>{opportunity.stage || 'Unknown'}</Badge>
                      </td>
                      <td class="px-6 py-4 hidden md:table-cell">{formatDate(opportunity.closeDate)}</td>
                      <td class="px-6 py-4 hidden lg:table-cell">{opportunity.probability ? `${opportunity.probability}%` : 'N/A'}</td>
                      <td class="px-6 py-4 text-right">
                        <a href="/app/opportunities/{opportunity.id}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </TabItem>
      
      <TabItem title="Notes ({comments.length})">
        <div class="bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-6">
          <div class="mb-6">
            <label for="comment" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add a note</label>
            <Textarea id="comment" rows="3" placeholder="Write your note here..." bind:value={newComment} />
            {#if commentError}
              <p class="text-red-600 mt-2">{commentError}</p>
            {/if}
            <div class="mt-2 flex justify-end">
              <Button size="sm" color="blue" on:click={submitComment} disabled={isSubmittingComment}>
                {#if isSubmittingComment}Adding...{:else}Add Note{/if}
              </Button>
            </div>
          </div>
          {#if comments.length === 0}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p class="mt-2 text-gray-500 dark:text-gray-400">No notes found for this account</p>
            </div>
          {:else}
            <div class="space-y-4">
              {#each comments as comment}
                <Card>
                  <div class="flex justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-900 dark:text-white">{comment.author?.name || 'Unknown'}</span>
                      <span class="text-xs text-gray-500">
                        {formatDate(comment.createdAt)} {#if comment.isPrivate}<Badge color="red" size="xs">Private</Badge>{/if}
                      </span>
                    </div>
                  </div>
                  <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{comment.body}</p>
                </Card>
              {/each}
            </div>
          {/if}
        </div>
      </TabItem>
      
      <TabItem title="Tasks ({tasks.length})">
        <div class="bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
          <div class="flex justify-between items-center p-4 pb-0">
            <div></div>
            <Button color="purple" on:click={() => showAddTaskModal = true}>+ Add Task</Button>
          </div>
          {#if tasks.length === 0}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p class="mt-2 text-gray-500 dark:text-gray-400">No tasks found for this account</p>
            </div>
          {:else}
            <div class="overflow-x-auto relative">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">Subject</th>
                    <th scope="col" class="px-6 py-3">Status</th>
                    <th scope="col" class="px-6 py-3">Priority</th>
                    <th scope="col" class="px-6 py-3 hidden md:table-cell">Due Date</th>
                    <th scope="col" class="px-6 py-3 hidden lg:table-cell">Assigned To</th>
                    <th scope="col" class="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {#each tasks as task}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <a href="." class="hover:text-blue-600 dark:hover:text-blue-500 hover:underline" on:click|preventDefault={() => openTaskModal(task)}>
                          {task.subject}
                        </a>
                      </td>
                      <td class="px-6 py-4">
                        <Badge color={task.status === 'Completed' ? 'green' : task.status === 'In Progress' ? 'blue' : 'yellow'}>
                          {task.status}
                        </Badge>
                      </td>
                      <td class="px-6 py-4">
                        <Badge color={task.priority === 'High' ? 'red' : task.priority === 'Normal' ? 'gray' : 'blue'}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td class="px-6 py-4 hidden md:table-cell">{formatDate(task.dueDate)}</td>
                      <td class="px-6 py-4 hidden lg:table-cell">{task.owner?.name || 'Unassigned'}</td>
                      <td class="px-6 py-4 text-right">
                        <Button size="xs" color="blue" on:click={() => openTaskModal(task)}>View</Button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </TabItem>
      
      <TabItem title="Cases ({cases.length})">
        <div class="bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
          {#if cases.length === 0}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <p class="mt-2 text-gray-500 dark:text-gray-400">No cases found for this account</p>
              <Button href="/app/cases/new?accountId={account.id}" color="red" class="mt-3">Open Case</Button>
            </div>
          {:else}
            <div class="overflow-x-auto relative">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">Case Number</th>
                    <th scope="col" class="px-6 py-3">Subject</th>
                    <th scope="col" class="px-6 py-3">Status</th>
                    <th scope="col" class="px-6 py-3">Priority</th>
                    <th scope="col" class="px-6 py-3 hidden md:table-cell">Created Date</th>
                    <th scope="col" class="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {#each cases as caseItem}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <a href="/app/cases/{caseItem.id}" class="hover:text-blue-600 dark:hover:text-blue-500 hover:underline">
                          {caseItem.caseNumber}
                        </a>
                      </td>
                      <td class="px-6 py-4">{caseItem.subject}</td>
                      <td class="px-6 py-4">
                        <Badge color={getCaseStatusBadgeColor(caseItem.status)}>
                          {caseItem.status}
                        </Badge>
                      </td>
                      <td class="px-6 py-4">
                        <Badge color={caseItem.priority === 'High' ? 'red' : caseItem.priority === 'Medium' ? 'yellow' : 'blue'}>
                          {caseItem.priority}
                        </Badge>
                      </td>
                      <td class="px-6 py-4 hidden md:table-cell">{formatDate(caseItem.createdAt)}</td>
                      <td class="px-6 py-4 text-right">
                        <a href="/app/cases/{caseItem.id}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </TabItem>
      
      <!-- <TabItem title="Quotes ({quotes.length})">
        <div class="bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
          {#if quotes.length === 0}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="mt-2 text-gray-500 dark:text-gray-400">No quotes found for this account</p>
              <Button href="/app/quotes/new?accountId={account.id}" color="purple" class="mt-3">Create Quote</Button>
            </div>
          {:else}
            <div class="overflow-x-auto relative">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">Quote Number</th>
                    <th scope="col" class="px-6 py-3">Name</th>
                    <th scope="col" class="px-6 py-3">Status</th>
                    <th scope="col" class="px-6 py-3">Grand Total</th>
                    <th scope="col" class="px-6 py-3 hidden md:table-cell">Expiration Date</th>
                    <th scope="col" class="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {#each quotes as quote}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <a href="/app/quotes/{quote.id}" class="hover:text-blue-600 dark:hover:text-blue-500 hover:underline">
                          {quote.quoteNumber}
                        </a>
                      </td>
                      <td class="px-6 py-4">{quote.name}</td>
                      <td class="px-6 py-4">
                        <Badge color={getQuoteStatusBadgeColor(quote.status)}>
                          {quote.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td class="px-6 py-4">{formatCurrency(quote.grandTotal)}</td>
                      <td class="px-6 py-4 hidden md:table-cell">{formatDate(quote.expirationDate)}</td>
                      <td class="px-6 py-4 text-right">
                        <a href="/app/quotes/{quote.id}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </TabItem> -->
    </Tabs>
  </div>

  <!-- Close Account Modal -->
  <Modal bind:open={showCloseModal} size="md" autoclose={false} title="Close Account">
    <form method="POST" action="?/closeAccount">
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        You are about to close the account "{account.name}". This action will mark the account as closed but will retain all account data for historical purposes. Closed accounts cannot be modified without reopening them first.
      </p>
      
      <div class="mb-4">
        <label for="closureReason" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Reason for Closing <span class="text-red-600">*</span>
        </label>
        <Textarea id="closureReason" name="closureReason" rows="3" placeholder="Please provide a reason for closing this account..." bind:value={closureReason} />
        {#if closeError}
          <p class="mt-1 text-sm text-red-600 dark:text-red-500">{closeError}</p>
        {/if}
      </div>
      
      <div class="flex justify-end gap-2">
        <Button type="button" color="alternative" on:click={() => showCloseModal = false}>Cancel</Button>
        <Button type="submit" color="red">Close Account</Button>
      </div>
    </form>
  </Modal>

  <!-- Add Contact Modal -->
  <Modal bind:open={showAddContactModal} size="md" autoclose={false} title="Add Contact to Account">
    <form on:submit|preventDefault={submitAddContact}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium mb-1">First Name <span class="text-red-500">*</span></label>
          <input id="firstName" class="w-full border rounded px-3 py-2" bind:value={contactForm.firstName} required />
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium mb-1">Last Name <span class="text-red-500">*</span></label>
          <input id="lastName" class="w-full border rounded px-3 py-2" bind:value={contactForm.lastName} required />
        </div>
        <div class="md:col-span-2">
          <label for="email" class="block text-sm font-medium mb-1">Email</label>
          <input id="email" class="w-full border rounded px-3 py-2" type="email" bind:value={contactForm.email} />
        </div>
        <div class="md:col-span-2">
          <label for="phone" class="block text-sm font-medium mb-1">Phone</label>
          <input id="phone" class="w-full border rounded px-3 py-2" type="tel" bind:value={contactForm.phone} />
        </div>
        <div class="md:col-span-2">
          <label for="title" class="block text-sm font-medium mb-1">Title</label>
          <input id="title" class="w-full border rounded px-3 py-2" bind:value={contactForm.title} />
        </div>
        <div class="md:col-span-2 flex items-center gap-3">
          <input id="isPrimary" type="checkbox" bind:checked={contactForm.isPrimary} />
          <label for="isPrimary" class="text-sm">Primary Contact</label>
        </div>
        <div class="md:col-span-2">
          <label for="role" class="block text-sm font-medium mb-1">Role</label>
          <input id="role" class="w-full border rounded px-3 py-2" bind:value={contactForm.role} />
        </div>
      </div>
      {#if addContactError}
        <p class="text-red-600 mt-2">{addContactError}</p>
      {/if}
      <div class="flex justify-end gap-2 mt-6">
        <Button type="button" color="alternative" on:click={() => { showAddContactModal = false; resetContactForm(); }}>Cancel</Button>
        <Button type="submit" color="blue" disabled={isAddingContact}>
          {#if isAddingContact}
            Adding...
          {:else}
            Add Contact
          {/if}
        </Button>
      </div>
    </form>
  </Modal>

  <!-- Add Opportunity Modal -->
  <Modal bind:open={showAddOpportunityModal} size="md" autoclose={false} title="Add Opportunity to Account">
    <form on:submit|preventDefault={submitAddOpportunity}>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label for="oppName" class="block text-sm font-medium mb-1">Name <span class="text-red-500">*</span></label>
          <input id="oppName" class="w-full border rounded px-3 py-2" bind:value={opportunityForm.name} required />
        </div>
        <div>
          <label for="oppAmount" class="block text-sm font-medium mb-1">Amount</label>
          <input id="oppAmount" class="w-full border rounded px-3 py-2" type="number" bind:value={opportunityForm.amount} min="0" />
        </div>
        <div>
          <label for="oppStage" class="block text-sm font-medium mb-1">Stage</label>
          <select id="oppStage" class="w-full border rounded px-3 py-2" bind:value={opportunityForm.stage}>
            <option value="PROSPECTING">Prospecting</option>
            <option value="QUALIFICATION">Qualification</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="CLOSED_WON">Closed Won</option>
            <option value="CLOSED_LOST">Closed Lost</option>
          </select>
        </div>
        <div>
          <label for="oppCloseDate" class="block text-sm font-medium mb-1">Close Date</label>
          <input id="oppCloseDate" class="w-full border rounded px-3 py-2" type="date" bind:value={opportunityForm.closeDate} />
        </div>
        <div>
          <label for="oppProbability" class="block text-sm font-medium mb-1">Probability (%)</label>
          <input id="oppProbability" class="w-full border rounded px-3 py-2" type="number" min="0" max="100" bind:value={opportunityForm.probability} />
        </div>
      </div>
      {#if addOpportunityError}
        <p class="text-red-600 mt-2">{addOpportunityError}</p>
      {/if}
      <div class="flex justify-end gap-2 mt-6">
        <Button type="button" color="alternative" on:click={() => { showAddOpportunityModal = false; resetOpportunityForm(); }}>Cancel</Button>
        <Button type="submit" color="green" disabled={isAddingOpportunity}>
          {#if isAddingOpportunity}
            Adding...
          {:else}
            Add Opportunity
          {/if}
        </Button>
      </div>
    </form>
  </Modal>

  <!-- Add Task Modal -->
  <Modal bind:open={showAddTaskModal} size="md" autoclose={false} title="Add Task to Account">
    <form on:submit|preventDefault={submitAddTask}>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label for="taskSubject" class="block text-sm font-medium mb-1">Subject <span class="text-red-500">*</span></label>
          <input id="taskSubject" class="w-full border rounded px-3 py-2" bind:value={addTaskForm.subject} required />
        </div>
        <div>
          <label for="taskDescription" class="block text-sm font-medium mb-1">Description</label>
          <Textarea id="taskDescription" rows="2" bind:value={addTaskForm.description} />
        </div>
        <div>
          <label for="taskDueDate" class="block text-sm font-medium mb-1">Due Date</label>
          <input id="taskDueDate" class="w-full border rounded px-3 py-2" type="date" bind:value={addTaskForm.dueDate} />
        </div>
        <div>
          <label for="taskPriority" class="block text-sm font-medium mb-1">Priority</label>
          <select id="taskPriority" class="w-full border rounded px-3 py-2" bind:value={addTaskForm.priority}>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label for="taskOwner" class="block text-sm font-medium mb-1">Assigned To</label>
          {#if users.length > 0}
            <select id="taskOwner" class="w-full border rounded px-3 py-2" bind:value={addTaskForm.ownerId}>
              <option value="">-- Select User --</option>
              {#each users as u}
                <option value={u.id}>{u.name} ({u.email})</option>
              {/each}
            </select>
          {:else}
            <div class="text-sm text-gray-500">No users available for assignment.</div>
          {/if}
        </div>
      </div>
      {#if addTaskError}
        <p class="text-red-600 mt-2">{addTaskError}</p>
      {/if}
      <div class="flex justify-end gap-2 mt-6">
        <Button type="button" color="alternative" on:click={() => { showAddTaskModal = false; resetAddTaskForm(); }}>Cancel</Button>
        <Button type="submit" color="purple" disabled={isAddingTask}>
          {#if isAddingTask}
            Adding...
          {:else}
            Add Task
          {/if}
        </Button>
      </div>
    </form>
  </Modal>

  <!-- Task Modal for view/edit/close -->
  {#if showTaskModal && selectedTask}
    <TaskModal task={selectedTask} boardId={null} on:close={closeTaskModal} />
  {/if}
</div>
