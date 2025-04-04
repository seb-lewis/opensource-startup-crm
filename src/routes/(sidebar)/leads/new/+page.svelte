<script>
    import { onMount } from 'svelte';
    // Flowbite-Svelte components
    import { Accordion, AccordionItem, Button, Input, Select, Label } from 'flowbite-svelte';
    // Import FontAwesome icons via svelte-fa
    import Fa from 'svelte-fa';
    import {
      faChevronDown,
      faChevronUp,
      faTimes,
      faPlus,
      faUpload,
      faPercent,
      faTimesCircle,
      faCheckCircle
    } from '@fortawesome/free-solid-svg-icons';
  
    /**
     * Object holding the form fields.
     * @type {Object}
     */
    let formData = {
      account_name: '',
      opportunity_amount: '',
      website: '',
      industry: '',
      status: '',
      skype_ID: '',
      source: '',
      lead_attachment: '',
      probability: '',
      first_name: '',
      last_name: '',
      title: '',
      phone: '',
      email: '',
      address_line: '',
      city: '',
      street: '',
      state: '',
      postcode: '',
      country: '',
      description: ''
    };
  
    /**
     * Object to store field errors.
     * @type {Object}
     */
    let errors = {};
  
    /**
     * Example options for dropdowns.
     * In a real app these would come from your backend.
     */
    let state = {
      industries: [['1', 'IT'], ['2', 'Finance']],
      status: [['1', 'New'], ['2', 'Contacted']],
      source: [['1', 'Website'], ['2', 'Referral']],
      countries: [['IN', 'India'], ['US', 'United States']]
    };
  
    /**
     * Reference for the rich text editor container.
     * You may integrate a Svelte editor (e.g. svelte-quill) here.
     * @type {HTMLElement}
     */
    let quillRef;
  
    /**
     * Handles form submission.
     * @param {Event} event - The form submit event.
     */
    function handleSubmit(event) {
      event.preventDefault();
      // Validate and submit the formData here
      console.log('Submitting form:', formData);
    }
  
  </script>
  
  <!-- Main container -->
    
    <!-- Form content -->
      <form on:submit={handleSubmit}>
          <!-- Lead Information Section -->
          <Accordion>
            <AccordionItem open>
                <span slot="header">Lead Information</span>
              <div class="grid gap-4">
                <!-- Lead Name -->
                <div>
                  <Label for="account_name">Lead Name</Label>
                  <Input
                    id="account_name"
                    name="account_name"
                    placeholder="Lead Name" />
                </div>
                <!-- Amount -->
                <div>
                  <Label for="opportunity_amount">Amount</Label>
                  <Input
                    type="number"
                    id="opportunity_amount"
                    name="opportunity_amount"
                    placeholder="Amount" />
                </div>
                <!-- Website -->
                <div>
                  <Label for="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="Website" />
                </div>
                <!-- Industry -->
                <div>
                  <Label for="industry">Industry</Label>
                  <Select id="industry" name="industry" bind:value={formData.industry} on:change={handleChange}>
                    {#each state.industries as option}
                      <option value={option[1]}>{option[1]}</option>
                    {/each}
                  </Select>
                </div>
                <!-- Status -->
                <div>
                  <Label for="status">Status</Label>
                  <Select id="status" name="status" bind:value={formData.status} on:change={handleChange}>
                    {#each state.status as option}
                      <option value={option[1]}>{option[1]}</option>
                    {/each}
                  </Select>
                </div>
                <!-- Skype ID -->
                <div>
                  <Label for="skype_ID">Skype ID</Label>
                  <Input
                    id="skype_ID"
                    name="skype_ID"
                    placeholder="Skype ID" />
                </div>
                <!-- Lead Source -->
                <div>
                  <Label for="source">Lead Source</Label>
                  <Select id="source" name="source" bind:value={formData.source} on:change={handleChange}>
                    {#each state.source as option}
                      <option value={option[0]}>{option[1]}</option>
                    {/each}
                  </Select>
                </div>
                <!-- Lead Attachment -->
                <div>
                  <Label for="lead_attachment">Lead Attachment</Label>
                  <input
                    type="file"
                    id="lead_attachment"
                    name="lead_attachment"
                    on:change={handleFileChange}
                    class="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100" />
                </div>
                <!-- Probability with Icon -->
                <div>
                  <Label for="probability">Probability</Label>
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
                <!-- (Note: For autocomplete fields like Contacts, Assigned To, or Tags, you might need to integrate a Svelte autocomplete library or build a custom solution.) -->
              </div>
            </AccordionItem>
         
            <AccordionItem >
                <span slot="header">Contact</span>

              <div class="grid gap-4">
                <!-- First Name -->
                <div>
                  <Label for="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="First Name"
                    required />
                </div>
                <!-- Last Name -->
                <div>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Last Name"
                    required />
                </div>
                <!-- Job Title -->
                <div>
                  <Label for="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Job Title" />
                </div>
                <!-- Phone Number -->
                <div>
                  <Label for="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+91..." />
                </div>
                <!-- Email Address -->
                <div>
                  <Label for="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email Address" />
                </div>
              </div>
            </AccordionItem>
        
            <AccordionItem>
                <span slot="header">Address</span>

              <div class="grid gap-4">
                <!-- Address Lane -->
                <div>
                  <Label for="address_line">Address Lane</Label>
                  <Input
                    id="address_line"
                    name="address_line"
                    placeholder="Address Lane" />
                </div>
                <!-- City -->
                <div>
                  <Label for="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="City" />
                </div>
                <!-- Street -->
                <div>
                  <Label for="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    placeholder="Street" />
                </div>
                <!-- State -->
                <div>
                  <Label for="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="State" />
                </div>
                <!-- Pincode -->
                <div>
                  <Label for="postcode">Pincode</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    placeholder="Pincode" />
                </div>
                <!-- Country -->
                <div>
                  <Label for="country">Country</Label>
                  <Select id="country" name="country" bind:value={formData.country} on:change={handleChange}>
                    {#each state.countries as option}
                      <option value={option[0]}>{option[1]}</option>
                    {/each}
                  </Select>
                </div>
              </div>
            </AccordionItem>
          
            <AccordionItem>
                <span slot="header">Description</span>
                
              <div class="space-y-4">
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  rows="4"
                  class="w-full border rounded p-2"></textarea>
              </div>
            </AccordionItem>
          </Accordion>
  
          <!-- Submit Button -->
          <div class="flex justify-center mt-6">
            <Button type="submit">Create</Button>
          </div>
      </form>
  