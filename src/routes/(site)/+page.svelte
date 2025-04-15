<script>
  import { onMount } from 'svelte';
  
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
      title: 'Email Integration',
      description: 'Connect your email and automate communication with clients.',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
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
        <a href="/signup" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 shadow-lg">
          Get Started Free
        </a>
        <a href="/demo" class="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-700">
          Request Demo
        </a>
      </div>
    </div>
    <div class="md:w-1/2 flex justify-center md:justify-end">
      <div class="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        <div class="h-60 bg-gray-200 relative">
          <!-- Dashboard preview image would go here -->
          <div class="absolute inset-0 flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
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
<section class="py-16 bg-white">
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
          Try our CRM free for 14 days, no credit card required.
        </p>
      </div>
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
        <a href="/signup" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100">
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
<section class="py-16 bg-gray-50">
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
</section>
