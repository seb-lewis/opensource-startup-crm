<script>
    import { enhance } from '$app/forms';
    // Flowbite-Svelte components
    import { Button, Input, Select, Label, Card, Alert, Toast } from 'flowbite-svelte';
    import { CheckCircleSolid } from 'flowbite-svelte-icons';
    // Import FontAwesome icons via svelte-fa
    import Fa from 'svelte-fa';
    import {
      faPercent,
    } from '@fortawesome/free-solid-svg-icons';
    import { goto } from '$app/navigation'; // Import goto for navigation

    /** @type {import('./$types').ActionData} */
    export let form;
    export let data;
    
    // Toast state
    let showToast = false;
    let toastMessage = '';
    
    /**
     * Object holding the form fields.
     * @type {Object}
     */
    let formData = {
      lead_title: '',
      opportunity_amount: 0,
      website: '',
      industry: '',
      status: 'NEW',
      skype_ID: '',
      source: '',
      lead_attachment: '',
      probability: 0,
      first_name: '',
      last_name: '',
      company: '', 
      title: '',
      phone: '',
      email: '',
      address_line: '',
      city: '',
      street: '',
      state: '',
      postcode: '',
      country: '',
      description: '',
      rating: ''
    };
  
    /**
     * Object to store field errors.
     * @type {Object}
     */
    let errors = {};
  
    /**
     * Reference for the rich text editor container.
     * You may integrate a Svelte editor (e.g. svelte-quill) here.
     * @type {HTMLElement}
     */
    let quillRef;
    
    /**
     * Handles changes to form inputs
     * @param {Event} event - The input change event
     */
    function handleChange(event) {
      const target = event.target;
      formData[target.name] = target.value;
    }
    
    /**
     * Validates the form before submission.
     * @returns {boolean} - Whether the form is valid.
     */
    function validateForm() {
      errors = {}; // Reset errors
  
      // Validate required fields based on the Lead model
      if (!formData.first_name.trim()) {
        errors.first_name = 'First name is required.';
      }
      
      if (!formData.last_name.trim()) {
        errors.last_name = 'Last name is required.';
      }

      if (!formData.lead_title.trim()) {
        errors.lead_title = 'Lead title is required.';
      }

      return Object.keys(errors).length === 0;
    }
  
    /**
     * Handles form submission.
     * @param {Event} event - The form submission event.
     */
    function handleSubmit(event) {
      if (!validateForm()) {
        event.preventDefault(); // Prevent form submission
      }
    }
      // Submitting indicator
    let isSubmitting = false;
    
    /**
     * Resets the form to its initial state
     */
    function resetForm() {
      formData = {
        lead_title: '',
        opportunity_amount: 0,
        website: '',
        industry: '',
        status: 'NEW',
        skype_ID: '',
        source: '',
        lead_attachment: '',
        probability: 0,
        first_name: '',
        last_name: '',
        company: '', 
        title: '',
        phone: '',
        email: '',
        address_line: '',
        city: '',
        street: '',
        state: '',
        postcode: '',
        country: '',
        description: '',
        rating: ''
      };
    }
</script>

<!-- Main container -->
<div class="container mx-auto px-4 py-6">
  <!-- Toast notification for success -->
  {#if showToast}
    <div class="fixed top-4 right-4 z-50">
      <Toast color="green" dismissable={true} on:dismiss={() => showToast = false}>
        <svelte:fragment slot="icon">
          <CheckCircleSolid class="w-5 h-5" />
        </svelte:fragment>
        {toastMessage}
      </Toast>
    </div>
  {/if}

  <Card class="px-4 sm:px-6 py-4 pb-8 max-w-5xl mx-auto">
    <!-- Show error if returned from server -->
    {#if form?.error}
      <Alert color="red" class="mb-4">
        <span class="font-medium">Error:</span> {form.error}
      </Alert>
    {/if}

    <!-- Form content -->
    <form method="POST" use:enhance={() => {
      if (!validateForm()) return;
      
      isSubmitting = true;
      
      // Return a callback to run when the form action completes
      return async ({ result }) => {
        isSubmitting = false;
        
        if (result.type === 'success') {
          // Handle successful form submission
          toastMessage = form?.message || 'Lead created successfully!';
          showToast = true;
          
          // Reset form after successful submission
          resetForm();
          
          // Optional: Navigate to the leads page after a short delay
          setTimeout(() => goto('/app/leads/'), 1500);
        }
      };
    }} class="pb-4">
        <!-- Lead Information Section -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Lead Information</h2>
          <div class="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <!-- Lead Title -->
            <div class="md:col-span-2">
              <Label for="lead_title" class="font-medium">Lead Title *</Label>
              <Input
                id="lead_title"
                name="lead_title"
                bind:value={formData.lead_title}
                on:input={handleChange}
                placeholder="Lead Title"
                required />
              {#if errors.lead_title}
                <span class="text-red-500 text-sm">{errors.lead_title}</span>
              {/if}
            </div>
            
            <!-- Company -->
            <div>
              <Label for="company" class="font-medium">Company</Label>
              <Input
                id="company"
                name="company"
                bind:value={formData.company}
                on:input={handleChange}
                placeholder="Company Name" />
            </div>
            
            <!-- Lead Source -->
            <div>
              <Label for="source" class="font-medium">Lead Source</Label>
              <Select id="source" name="source" bind:value={formData.source} on:change={handleChange}>
                {#each data.data.source as [value, label]}
                  <option value={value}>{label}</option>
                {/each}
              </Select>
            </div>

            <!-- Industry -->
            <div>
              <Label for="industry" class="font-medium">Industry</Label>
              <Select id="industry" name="industry" bind:value={formData.industry} on:change={handleChange}>
                {#each data.data.industries as [value, label]}
                  <option value={value}>{label}</option>
                {/each}
              </Select>
            </div>

            <!-- Status -->
            <div>
              <Label for="status" class="font-medium">Status</Label>
              <Select id="status" name="status" bind:value={formData.status} on:change={handleChange}>
                {#each data.data.status as [value, label]}
                  <option value={value}>{label}</option>
                {/each}
              </Select>
            </div>
            
            <!-- Rating -->
            <div>
              <Label for="rating" class="font-medium">Rating</Label>
              <Select id="rating" name="rating" bind:value={formData.rating} on:change={handleChange}>
                <option value="">Select Rating</option>
                <option value="HOT">Hot</option>
                <option value="WARM">Warm</option>
                <option value="COLD">Cold</option>
              </Select>
            </div>
            
            <!-- Website -->
            <div>
              <Label for="website" class="font-medium">Website</Label>
              <Input
                id="website"
                name="website"
                bind:value={formData.website}
                on:input={handleChange}
                placeholder="Website" />
            </div>
            
            <!-- Opportunity Amount (stored in description) -->
            <div>
              <Label for="opportunity_amount" class="font-medium">Opportunity Amount</Label>
              <Input
                type="number"
                id="opportunity_amount"
                name="opportunity_amount"
                bind:value={formData.opportunity_amount}
                on:input={handleChange}
                placeholder="Amount" />
            </div>
            
            <!-- Probability with Icon (stored in description) -->
            <div>
              <Label for="probability" class="font-medium">Probability</Label>
              <div class="relative">
                <Input
                  id="probability"
                  name="probability"
                  bind:value={formData.probability}
                  on:input={handleChange}
                  placeholder="Probability" />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Fa icon={faPercent} />
                </div>
              </div>
            </div>
            
            <!-- Skype ID (stored in description) -->
            <div>
              <Label for="skype_ID" class="font-medium">Skype ID</Label>
              <Input
                id="skype_ID"
                name="skype_ID"
                bind:value={formData.skype_ID}
                on:input={handleChange}
                placeholder="Skype ID" />
            </div>
          </div>
        </div>
       
        <!-- Contact Section -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Contact Information</h2>
          <div class="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <!-- First Name -->
            <div>
              <Label for="first_name" class="font-medium">First Name *</Label>
              <Input
                id="first_name"
                name="first_name"
                bind:value={formData.first_name}
                on:input={handleChange}
                placeholder="First Name"
                required />
              {#if errors.first_name}
                <span class="text-red-500 text-sm">{errors.first_name}</span>
              {/if}
            </div>
            <!-- Last Name -->
            <div>
              <Label for="last_name" class="font-medium">Last Name *</Label>
              <Input
                id="last_name"
                name="last_name"
                bind:value={formData.last_name}
                on:input={handleChange}
                placeholder="Last Name"
                required />
              {#if errors.last_name}
                <span class="text-red-500 text-sm">{errors.last_name}</span>
              {/if}
            </div>
            <!-- Job Title -->
            <div>
              <Label for="title" class="font-medium">Job Title</Label>
              <Input
                id="title"
                name="title"
                bind:value={formData.title}
                on:input={handleChange}
                placeholder="Job Title" />
            </div>
            <!-- Phone Number -->
            <div>
              <Label for="phone" class="font-medium">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                bind:value={formData.phone}
                on:input={handleChange}
                placeholder="+91..." />
            </div>
            <!-- Email Address -->
            <div class="md:col-span-2">
              <Label for="email" class="font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                bind:value={formData.email}
                on:input={handleChange}
                placeholder="Email Address" />
              {#if errors.email}
                <span class="text-red-500 text-sm">{errors.email}</span>
              {/if}
            </div>
          </div>
        </div>
      
        <!-- Address Section -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Address</h2>
          <div class="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <!-- Address Lane -->
            <div class="md:col-span-2">
              <Label for="address_line" class="font-medium">Address Lane</Label>
              <Input
                id="address_line"
                name="address_line"
                bind:value={formData.address_line}
                on:input={handleChange}
                placeholder="Address Lane" />
            </div>
            <!-- City -->
            <div>
              <Label for="city" class="font-medium">City</Label>
              <Input
                id="city"
                name="city"
                bind:value={formData.city}
                on:input={handleChange}
                placeholder="City" />
            </div>
            <!-- Street -->
            <div>
              <Label for="street" class="font-medium">Street</Label>
              <Input
                id="street"
                name="street"
                bind:value={formData.street}
                on:input={handleChange}
                placeholder="Street" />
            </div>
            <!-- State -->
            <div>
              <Label for="state" class="font-medium">State</Label>
              <Input
                id="state"
                name="state"
                bind:value={formData.state}
                on:input={handleChange}
                placeholder="State" />
            </div>
            <!-- Pincode -->
            <div>
              <Label for="postcode" class="font-medium">Pincode</Label>
              <Input
                id="postcode"
                name="postcode"
                bind:value={formData.postcode}
                on:input={handleChange}
                placeholder="Pincode" />
            </div>
            <!-- Country -->
            <div>
              <Label for="country" class="font-medium">Country</Label>
              <Select id="country" name="country" bind:value={formData.country} on:change={handleChange}>
                {#each data.data.countries as [value, label]}
                  <option value={value}>{label}</option>
                {/each}
              </Select>
            </div>
          </div>
        </div>
        
        <!-- Description Section -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Description</h2>
          <div>
            <textarea
              id="description"
              name="description"
              bind:value={formData.description}
              on:input={handleChange}
              placeholder="Description"
              rows="4"
              class="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>

        <!-- Submit Button - Improved visibility -->
        <div class="sticky bottom-4 py-4">
          <div class="flex justify-center">
            <Button type="submit" color="blue" size="lg" class="px-12 py-3 font-medium">Create Lead</Button>
          </div>
        </div>
    </form>
  </Card>
</div>
