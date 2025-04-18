<script>
  import { onMount } from 'svelte';
  import banner_img from '$lib/assets/images/banner.png';  
  // Define feature cards
  const features = [
    {
      title: 'Contact Management',
      description: 'Organize and track all your customer information in one centralized database.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      title: 'Sales Pipeline',
      description: 'Track deals through every stage of your sales process.',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
      title: 'Task Management',
      description: 'Never miss a follow-up with integrated task management.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
    },
    {
      title: 'Reporting & Analytics',
      description: 'Make data-driven decisions with powerful analytics and reporting tools.',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
      title: 'Invoice (Coming Soon)',
      description: 'Create and send professional invoices directly from the CRM.',
      icon: 'M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z'
    },
    {
      title: 'Mobile Access',
      description: 'Manage your business on the go with our mobile-friendly platform.',
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
    }
  ];
  
  // Define testimonials
  const testimonials = [
    {
      quote: "This CRM system has transformed how we manage our client relationships. It's intuitive and powerful.",
      author: "Sarah Johnson",
      company: "TechStart Inc."
    },
    {
      quote: "The reporting features helped us identify key opportunities that boosted our revenue by 35%.",
      author: "Michael Chen",
      company: "Growth Partners"
    },
    {
      quote: "Easy to use and highly customizable. Perfect for our sales team's workflow.",
      author: "Emma Rodriguez",
      company: "Velocity Sales"
    }
  ];
  
  let activeTestimonial = 0;
  
  // Rotate testimonials
  function nextTestimonial() {
    activeTestimonial = (activeTestimonial + 1) % testimonials.length;
  }
  
  function prevTestimonial() {
    activeTestimonial = (activeTestimonial - 1 + testimonials.length) % testimonials.length;
  }
  
  onMount(() => {
    // Auto-rotate testimonials
    const interval = setInterval(nextTestimonial, 5000);
    
    return () => {
      clearInterval(interval);
    };
  });
</script>

<!-- Hero Section -->
<section class="bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
  <div class="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
    <div class="md:w-1/2 mb-10 md:mb-0">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
        Streamline Your Customer Relationships
      </h1>
      <p class="text-xl md:text-2xl mb-8">
        The all-in-one CRM solution for managing leads, customers, and sales with ease.
      </p>
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <a href="/login" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 shadow-lg">
          Get Started Free
        </a>
        <a href="https://github.com/MicroPyramid/svelte-crm" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-700 transition-colors">
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
    <div class="md:w-1/2 flex justify-center md:justify-end">
      <div class="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        <div class="h-60 bg-gray-200 relative">
          <!-- Dashboard preview image would go here -->
          <div class="absolute inset-0 flex items-center justify-center text-gray-500">
            <img src="{banner_img}" alt="Dashboard Preview" class="w-full h-full object-cover" />
          </div>
        </div>
        <div class="p-4 bg-gray-50 border-t border-gray-200">
          <div class="w-full bg-blue-600 h-2 rounded-full mb-2"></div>
          <div class="w-3/4 bg-blue-400 h-2 rounded-full mb-2"></div>
          <div class="w-1/2 bg-blue-300 h-2 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="py-16 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Powerful Features for Growing Businesses
      </h2>
      <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
        Everything you need to manage customer relationships effectively.
      </p>
    </div>

    <div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each features as feature}
        <div class="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div class="rounded-md bg-blue-100 p-3 inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={feature.icon} />
            </svg>
          </div>
          <h3 class="mt-4 text-xl font-medium text-gray-900">{feature.title}</h3>
          <p class="mt-2 text-gray-600">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Testimonial Section -->
<!-- <section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-12 sm:text-4xl">
      Trusted by Businesses Worldwide
    </h2>
    
    <div class="relative max-w-3xl mx-auto">
      <div class="overflow-hidden">
        {#each testimonials as testimonial, i}
          <div class="transition-opacity duration-300 absolute inset-0 flex flex-col items-center justify-center p-6"
               style="opacity: {i === activeTestimonial ? '1' : '0'}; pointer-events: {i === activeTestimonial ? 'auto' : 'none'}">
            <svg class="h-12 w-12 text-blue-400 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p class="text-xl md:text-2xl text-center text-gray-600 mb-6">"{testimonial.quote}"</p>
            <div class="font-medium text-gray-900">{testimonial.author}</div>
            <div class="text-blue-600">{testimonial.company}</div>
          </div>
        {/each}
      </div>
      
      <div class="absolute top-1/2 transform -translate-y-1/2 left-0">
        <button on:click={prevTestimonial} aria-label="Previous testimonial" class="p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-blue-600 focus:outline-none">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div class="absolute top-1/2 transform -translate-y-1/2 right-0">
        <button on:click={nextTestimonial} aria-label="Next testimonial" class="p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-blue-600 focus:outline-none">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div class="mt-12 flex justify-center space-x-2">
        {#each testimonials as _, i}
          <button on:click={() => activeTestimonial = i} 
                  aria-label="Go to testimonial {i + 1}"
                  class="w-3 h-3 rounded-full {i === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'} 
                         focus:outline-none transition-colors duration-300"></button>
        {/each}
      </div>
    </div>
  </div>
</section> -->

<!-- Open Source Section -->
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="lg:w-1/2">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
          100% Open Source
        </h2>
        <p class="text-lg text-gray-600 mb-6">
          This CRM is completely open-source and hosted on GitHub. You can freely use, modify, and contribute to the project.
        </p>
        <ul class="space-y-4">
          <li class="flex items-start">
            <svg class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-gray-600">Freedom to customize and extend functionality</span>
          </li>
          <li class="flex items-start">
            <svg class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-gray-600">No vendor lock-in or hidden charges</span>
          </li>
          <li class="flex items-start">
            <svg class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-gray-600">Community-driven development and support</span>
          </li>
        </ul>
        <div class="mt-8">
          <a href="https://github.com/MicroPyramid/svelte-crm" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            Star on GitHub
          </a>
          <a href="https://github.com/MicroPyramid/svelte-crm/fork" target="_blank" rel="noopener noreferrer" class="ml-4 inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100">
            Fork Project
          </a>
        </div>
      </div>
      <div class="mt-10 lg:mt-0 lg:w-1/2 lg:pl-10">
        <div class="bg-gray-100 rounded-lg p-6 border border-gray-200 shadow-md">
          <div class="flex items-center mb-4">
            <svg class="h-8 w-8 text-gray-700 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <div>
              <h3 class="text-lg font-bold text-gray-900">MicroPyramid/svelte-crm</h3>
              <p class="text-gray-600">Open Source CRM built with Svelte and Django</p>
            </div>
          </div>
          <div class="flex space-x-4 mb-4">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path>
              </svg>
              <span class="text-gray-700 text-sm">Star</span>
            </div>
            <div class="flex items-center">
              <svg class="h-5 w-5 text-gray-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.559 8.855c.166 1.183.789 3.207 3.087 4.079-2.381.512-4.056 2.776-4.643 3.583 3.747-1.8 6.379-1.297 7.373-1.004-2.636-2.313-1.819-6.689-1.819-6.689 1.21.671 1.931 1.753 2.188 2.63.252-.83.55-1.848.566-2.486-4.71-1.639-6.749-5.483-6.749-5.483-2.13 6.223-3.057 9.916-3.677 11.064-.316-2.006-.717-4.406-.717-4.406s-1.436-3.533-6.17-2.149c2.042 6.606 7.642 8.725 9.639 9.292-1.792-2.341-2.419-4.335-2.694-5.85 1.333-.555 3.939-3.017 4.077-7.345-.174 2.611-.48 4.919-2.462 5.766-.505-1.766-2.309-3.422-3.995-3.778 1.023-.683 1.974-1.356 2.974-2.918-.833 0-1.6.108-2.311.255-1.95.588-2.287 1.625-2.347 1.679-.137.097-.336.243-.53.363l-.323.241c-2.154 1.574-1.893 5.588-.467 9.104"></path>
              </svg>
              <span class="text-gray-700 text-sm">Fork</span>
            </div>
            <div class="flex items-center">
              <svg class="h-5 w-5 text-gray-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-gray-700 text-sm">Active Development</span>
            </div>
          </div>
          <div class="bg-gray-200 p-3 rounded-md text-sm font-mono text-gray-700 overflow-x-auto">
            $ git clone https://github.com/MicroPyramid/svelte-crm.git<br>
            $ cd svelte-crm<br>
            $ npm install
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="bg-blue-700 text-white py-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:flex lg:items-center lg:justify-between">
      <div>
        <h2 class="text-3xl font-extrabold sm:text-4xl">
          Ready to transform your business?
        </h2>
        <p class="mt-3 max-w-3xl text-lg">
          Start managing your customer relationships more effectively today.
          Try our CRM for free, no credit card required.
        </p>
      </div>
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
        <a href="/login" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100">
          Get Started
        </a>
        <a href="/contact" class="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800">
          Contact Sales
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Stats Section -->
<!-- <section class="py-16 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <p class="text-4xl font-extrabold text-blue-600">98%</p>
        <p class="mt-2 text-lg text-gray-600">Customer Satisfaction</p>
      </div>
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <p class="text-4xl font-extrabold text-blue-600">35%</p>
        <p class="mt-2 text-lg text-gray-600">Average Sales Increase</p>
      </div>
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <p class="text-4xl font-extrabold text-blue-600">10,000+</p>
        <p class="mt-2 text-lg text-gray-600">Business Users</p>
      </div>
    </div>
  </div>
</section> -->
