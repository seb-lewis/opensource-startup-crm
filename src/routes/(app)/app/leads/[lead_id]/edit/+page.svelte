<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { 
    Alert, 
    Button, 
    Card, 
    Input, 
    Label, 
    Select, 
    Spinner, 
    Textarea,
    Toast 
  } from 'flowbite-svelte';
  import { fly } from 'svelte/transition';

  export let data;
  
  let { lead, users } = data;
  let isSubmitting = false;
  let formSubmitted = false;
  let errorMessage = '';

  // Form validation
  let errors = {};
  
  function validateForm(formData) {
    errors = {};
    
    if (!formData.get('firstName')?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.get('lastName')?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    const email = formData.get('email')?.trim();
    if (email && !isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // Lead status options
  const statusOptions = [
    { value: 'NEW', name: 'New' },
    { value: 'PENDING', name: 'Pending' },
    { value: 'CONTACTED', name: 'Contacted' },
    { value: 'QUALIFIED', name: 'Qualified' },
    { value: 'UNQUALIFIED', name: 'Unqualified' },
    { value: 'CONVERTED', name: 'Converted' }
  ];
  
  // Lead source options
  const sourceOptions = [
    { value: 'WEB', name: 'Website' },
    { value: 'PHONE_INQUIRY', name: 'Phone Inquiry' },
    { value: 'PARTNER_REFERRAL', name: 'Partner Referral' },
    { value: 'COLD_CALL', name: 'Cold Call' },
    { value: 'TRADE_SHOW', name: 'Trade Show' },
    { value: 'EMPLOYEE_REFERRAL', name: 'Employee Referral' },
    { value: 'ADVERTISEMENT', name: 'Advertisement' },
    { value: 'OTHER', name: 'Other' }
  ];
  
  // Rating options
  const ratingOptions = [
    { value: 'Hot', name: 'Hot' },
    { value: 'Warm', name: 'Warm' },
    { value: 'Cold', name: 'Cold' }
  ];
  
  // Common industry options
  const industryOptions = [
    { value: 'Technology', name: 'Technology' },
    { value: 'Finance', name: 'Finance' },
    { value: 'Healthcare', name: 'Healthcare' },
    { value: 'Education', name: 'Education' },
    { value: 'Manufacturing', name: 'Manufacturing' },
    { value: 'Retail', name: 'Retail' },
    { value: 'Real Estate', name: 'Real Estate' },
    { value: 'Consulting', name: 'Consulting' },
    { value: 'Other', name: 'Other' }
  ];

  // Cancel edit and go back to lead view
  function cancelEdit() {
    goto(`/app/leads/${lead.id}`);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
  <!-- Sticky Top Bar -->
  <header class="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-blue-100 shadow-sm">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-2">
        <a href="/app/leads/{lead.id}" aria-label="Back to lead view" class="text-blue-700 hover:text-blue-900 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 class="text-xl md:text-2xl font-bold text-blue-900">Edit Lead</h1>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-6 py-10">
    {#if formSubmitted && !errorMessage}
      <div in:fly={{ y: -20 }} class="mb-8">
        <Toast dismissable color="green" class="mb-5">
          <span class="font-medium">Success!</span> Lead updated successfully.
        </Toast>
      </div>
    {/if}

    {#if errorMessage}
      <div in:fly={{ y: -20 }} class="mb-8">
        <Alert color="red" dismissable>
          <span class="font-medium">Error:</span> {errorMessage}
        </Alert>
      </div>
    {/if}

    <p class="text-sm text-gray-600 mb-6">Editing lead: <span class="font-medium">{lead.firstName} {lead.lastName}</span></p>

    <Card class="px-4 sm:px-6 py-4 pb-8 max-w-5xl shadow-lg border border-gray-200 bg-white rounded-lg mx-auto">
      <form 
        method="POST" 
        use:enhance={({ formData }) => {
          const isValid = validateForm(formData);
          if (!isValid) return;
          
          isSubmitting = true;
          return async ({ result, update }) => {
            isSubmitting = false;
            formSubmitted = true;
            
            if (result.type === 'success') {
              if (result.data?.success) {
                await update();
                setTimeout(() => {
                  goto(`/app/leads/${lead.id}`);
                }, 1500);
              } else if (result.data?.error) {
                errorMessage = result.data.error;
              }
            } else {
              errorMessage = 'An unexpected error occurred';
            }
          };
        }}
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Personal Information -->
          <div class="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">Basic Information</h3>
            
            <div>
              <Label for="firstName" class="mb-1">First Name <span class="text-red-500">*</span></Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={lead.firstName}
                placeholder="First Name"
                color={errors.firstName ? 'red' : ''}
              />
              {#if errors.firstName}
                <p class="text-sm text-red-500 mt-1">{errors.firstName}</p>
              {/if}
            </div>
            
            <div>
              <Label for="lastName" class="mb-1">Last Name <span class="text-red-500">*</span></Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lead.lastName}
                placeholder="Last Name"
                color={errors.lastName ? 'red' : ''}
              />
              {#if errors.lastName}
                <p class="text-sm text-red-500 mt-1">{errors.lastName}</p>
              {/if}
            </div>
            
            <div>
              <Label for="email" class="mb-1">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={lead.email || ''}
                placeholder="Email Address"
                color={errors.email ? 'red' : ''}
              />
              {#if errors.email}
                <p class="text-sm text-red-500 mt-1">{errors.email}</p>
              {/if}
            </div>
            
            <div>
              <Label for="phone" class="mb-1">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={lead.phone || ''}
                placeholder="Phone Number"
              />
            </div>
          </div>
          
          <!-- Company Information -->
          <div class="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">Company Information</h3>
            
            <div>
              <Label for="company" class="mb-1">Company</Label>
              <Input
                id="company"
                name="company"
                type="text"
                value={lead.company || ''}
                placeholder="Company Name"
              />
            </div>
            
            <div>
              <Label for="title" class="mb-1">Job Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={lead.title || ''}
                placeholder="Job Title"
              />
            </div>
            
            <div>
              <Label for="industry" class="mb-1">Industry</Label>
              <Select id="industry" name="industry" value={lead.industry || ''}>
                <option value="">Select Industry</option>
                {#each industryOptions as option}
                  <option value={option.value}>{option.name}</option>
                {/each}
              </Select>
            </div>
          </div>

          <!-- Lead Information -->
          <div class="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200 md:col-span-2">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">Lead Details</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label for="status" class="mb-1">Status</Label>
                <Select id="status" name="status" value={lead.status}>
                  {#each statusOptions as option}
                    <option value={option.value}>{option.name}</option>
                  {/each}
                </Select>
              </div>
              
              <div>
                <Label for="leadSource" class="mb-1">Lead Source</Label>
                <Select id="leadSource" name="leadSource" value={lead.leadSource || ''}>
                  <option value="">Select Source</option>
                  {#each sourceOptions as option}
                    <option value={option.value}>{option.name}</option>
                  {/each}
                </Select>
              </div>
              
              <div>
                <Label for="rating" class="mb-1">Rating</Label>
                <Select id="rating" name="rating" value={lead.rating || ''}>
                  <option value="">Select Rating</option>
                  {#each ratingOptions as option}
                    <option value={option.value}>{option.name}</option>
                  {/each}
                </Select>
              </div>
            </div>
            
            <div>
              <Label for="ownerId" class="mb-1">Lead Owner</Label>
              <Select id="ownerId" name="ownerId" value={lead.ownerId}>
                {#each users as user}
                  <option value={user.id}>{user.name}</option>
                {/each}
              </Select>
            </div>

            <div>
              <Label for="description" class="mb-1">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows="4"
                value={lead.description || ''}
                placeholder="Add additional information about this lead..."
              />
            </div>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="flex justify-end items-center gap-3 mt-8 pt-4 border-t border-gray-100">
          <Button type="button" color="alternative" onclick={cancelEdit}>Cancel</Button>
          <Button type="submit" color="blue" disabled={isSubmitting}>
            {#if isSubmitting}
              <Spinner size="sm" class="mr-2" />
            {/if}
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  </main>
</div>
