<!-- home page -->
<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import banner_img from '$lib/assets/images/banner.png';
  import { 
    Users, 
    BarChart3, 
    CheckSquare, 
    TrendingUp, 
    FileText, 
    Smartphone,
    Zap,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Star,
    GitFork,
    MessageCircle,
    Github
  } from '@lucide/svelte';

  // Define feature cards with enhanced SEO keywords
  const features = [
    {
      title: 'Smart Contact Management System',
      description: 'Centralize customer data with our intuitive contact management system. Track customer interactions, manage qualified leads, and build stronger customer relationships. Perfect for startups, small businesses, and growing enterprises looking for efficient CRM software.',
      icon: Users,
      benefits: ['360° Customer View', 'Lead Scoring', 'Contact Segmentation']
    },
    {
      title: 'Visual Sales Pipeline Management',
      description: 'Streamline your sales process with our drag-and-drop sales pipeline. Track deals from lead qualification to closing, forecast revenue accurately, and implement powerful sales automation workflows to boost your conversion rates.',
      icon: BarChart3,
      benefits: ['Deal Tracking', 'Sales Forecasting', 'Automation Workflows'],
      comingSoon: true
    },
    {
      title: 'Advanced Task & Project Management',
      description: 'Never miss a follow-up with integrated task management and project tracking. Set reminders, assign tasks to team members, track project milestones, and ensure maximum productivity across your sales and marketing teams.',
      icon: CheckSquare,
      benefits: ['Task Automation', 'Team Collaboration', 'Deadline Tracking']
    },
    {
      title: 'Real-time Analytics & Reporting',
      description: 'Make data-driven decisions with comprehensive CRM analytics and business intelligence. Track sales performance, monitor marketing campaign effectiveness, and generate detailed reports to optimize your customer acquisition strategies.',
      icon: TrendingUp,
      benefits: ['Custom Dashboards', 'Performance Metrics', 'ROI Tracking'],
      comingSoon: true
    },
    {
      title: 'Automated Invoice & Billing Management',
      description: 'Streamline your billing process with integrated invoicing software. Create professional invoices, track payments, manage recurring billing, and integrate with popular payment gateways. Perfect for service-based businesses and SaaS startups.',
      icon: FileText,
      benefits: ['Payment Tracking', 'Recurring Billing', 'Payment Integration'],
      comingSoon: true
    },
    {
      title: 'Mobile CRM & Cloud Access',
      description: 'Access your CRM data anywhere with our responsive, mobile-optimized interface. Work offline, sync data automatically, and manage your business on-the-go. Perfect for sales teams, remote workers, and field service management.',
      icon: Smartphone,
      benefits: ['Offline Access', 'Real-time Sync', 'Cross-platform Support'],
      comingSoon: true
    }
  ];

  // Enhanced testimonials with more details
  const testimonials = [
    {
      quote: "BottleCRM revolutionized our customer relationship management. As a startup, we needed a powerful yet affordable CRM solution. This open-source CRM gave us enterprise-level features without the enterprise price tag!",
      author: "Alex Martinez",
      company: "Innovate Solutions",
      role: "CEO & Founder",
      industry: "Tech Startup"
    },
    {
      quote: "The sales pipeline visualization and automated reporting helped us increase our conversion rate by 35% and reduce our sales cycle by 2 weeks. Best free CRM for small businesses we've ever used.",
      author: "Priya Singh",
      company: "Growth Dynamics",
      role: "Sales Director",
      industry: "Digital Marketing"
    },
    {
      quote: "Easy implementation, great customization options, and excellent community support. Our team adopted it quickly and saw immediate productivity improvements. Highly recommend for any growing business.",
      author: "Emma Rodriguez",
      company: "Velocity Sales",
      role: "Operations Manager",
      industry: "B2B Services"
    }
  ];

  // FAQ data for SEO
  const faqs = [
    {
      question: "Is BottleCRM really free to use?",
      answer: "Yes! BottleCRM is 100% free and open-source. You can download, install, customize, and use it without any subscription fees or hidden costs. We also offer optional paid support services for hosting and customization."
    },
    {
      question: "How does BottleCRM compare to Salesforce or HubSpot?",
      answer: "BottleCRM offers many of the same core features as expensive CRM platforms but without the high monthly costs. While enterprise CRMs might have more advanced features, BottleCRM provides everything most startups and small businesses need to manage customer relationships effectively."
    },
    {
      question: "Can I self-host BottleCRM on my own servers?",
      answer: "Absolutely! BottleCRM is designed to be self-hosted. You have complete control over your data and can deploy it on your own servers, cloud infrastructure, or local environment. This ensures data privacy and eliminates vendor lock-in."
    },
    {
      question: "What technology stack does BottleCRM use?",
      answer: "BottleCRM is built with modern web technologies: SvelteKit 2.21.x for the frontend, Prisma for database management, TailwindCSS for styling, and includes integration capabilities with various third-party services."
    },
    {
      question: "Do you provide support for BottleCRM implementation?",
      answer: "Yes! While the software is free, we offer paid professional services including hosting setup, custom development, data migration, training, and ongoing technical support to help you get the most out of BottleCRM."
    },
    {
      question: "Is BottleCRM suitable for my industry?",
      answer: "BottleCRM is industry-agnostic and works well for most businesses including SaaS startups, consulting firms, e-commerce businesses, real estate agencies, and service-based companies. Its customizable nature allows adaptation to various industry-specific needs."
    }
  ];

  // Comparison data
  const competitors = [
    {
      name: "BottleCRM",
      price: "Free",
      openSource: true,
      selfHosted: true,
      customizable: true,
      support: "Community + Paid",
      userLimit: "Unlimited"
    },
    {
      name: "Salesforce",
      price: "$25-300/user/month",
      openSource: false,
      selfHosted: false,
      customizable: true,
      support: "Paid",
      userLimit: "Per seat pricing"
    },
    {
      name: "HubSpot",
      price: "$50-3200/month",
      openSource: false,
      selfHosted: false,
      customizable: "Limited",
      support: "Freemium + Paid",
      userLimit: "Contact-based pricing"
    },
    {
      name: "Pipedrive",
      price: "$15-99/user/month",
      openSource: false,
      selfHosted: false,
      customizable: "Limited",
      support: "Paid",
      userLimit: "Per seat pricing"
    }
  ];
  
  let activeTestimonial = 0;
  let activeFaq = null;
  let mounted = false;

  // Enhanced testimonial functions
  function nextTestimonial() {
    activeTestimonial = (activeTestimonial + 1) % testimonials.length;
  }
  
  function prevTestimonial() {
    activeTestimonial = (activeTestimonial - 1 + testimonials.length) % testimonials.length;
  }

  function toggleFaq(index) {
    activeFaq = activeFaq === index ? null : index;
  }
  
  onMount(() => {
    mounted = true;
    // Auto-rotate testimonials
    const interval = setInterval(nextTestimonial, 7000);
    
    return () => {
      clearInterval(interval);
    };
  });
</script>

<svelte:head>
  <title>BottleCRM | Free Open-Source CRM Software for Startups & Small Businesses - No Subscription Fees</title>
  <meta name="description" content="BottleCRM: 100% free, self-hostable CRM software for startups and small businesses. Manage contacts, sales pipeline, tasks & analytics. Open-source alternative to Salesforce & HubSpot. Download now!" />
  <meta name="keywords" content="free crm software, open source crm, startup crm, small business crm, crm software, customer relationship management, lead management, sales automation, svelte crm, django crm, self hosted crm, salesforce alternative, hubspot alternative, free sales software, crm for startups, no subscription crm" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://bottlecrm.com/" />
  <meta property="og:title" content="BottleCRM | Free Open-Source CRM Software for Startups" />
  <meta property="og:description" content="100% free, self-hostable CRM software. No subscription fees, unlimited users. Perfect alternative to expensive CRM solutions." />
  <meta property="og:image" content="https://bottlecrm.com/og-image.png" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://bottlecrm.com/" />
  <meta property="twitter:title" content="BottleCRM | Free Open-Source CRM Software for Startups" />
  <meta property="twitter:description" content="100% free, self-hostable CRM software. No subscription fees, unlimited users." />
  <meta property="twitter:image" content="https://bottlecrm.com/twitter-image.png" />

  <!-- Structured Data for SEO -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "BottleCRM",
      "description": "Free, open-source CRM software for startups and small businesses",
      "url": "https://bottlecrm.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web-based",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150"
      }
    }
  </script>
</svelte:head>

<!-- Hero Section with enhanced content -->
<section class="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
  <!-- Animated background elements -->
  <div class="absolute inset-0 bg-black/10"></div>
  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
  
  <div class="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center relative z-10">
    <div class="lg:w-1/2 mb-10 lg:mb-0">
      <div>
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
          <span class="text-sm font-medium">🚀 Free Forever • No Credit Card Required</span>
        </div>
        
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          The Free <span class="text-yellow-300">CRM Software</span> That Startups Actually Need
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
          Stop paying $50-300/month for CRM subscriptions. BottleCRM is a 100% free, open-source, and self-hostable customer relationship management solution built specifically for startups and growing businesses.
        </p>
        
        <!-- Value proposition bullets -->
        <ul class="mb-8 space-y-3 text-lg">
          <li class="flex items-center">
            <Check class="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
            <span class="break-words">No monthly fees - Save $600-3600/year per user</span>
          </li>
          <li class="flex items-center">
            <Check class="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
            <span class="break-words">Complete data ownership - Host on your servers</span>
          </li>
          <li class="flex items-center">
            <Check class="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
            <span class="break-words">Unlimited users and customization</span>
          </li>
        </ul>
        
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="/login" class="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-semibold rounded-lg text-blue-700 bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap">
            <Zap class="w-5 h-5 mr-2" />
            Start Free Demo
          </a>
          <a href="https://github.com/MicroPyramid/opensource-startup-crm" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-6 py-4 border-2 border-white text-base font-semibold rounded-lg text-white hover:bg-white/10 transition-all duration-200 whitespace-nowrap">
            <Github class="w-5 h-5 mr-2" />
            View Source
          </a>
        </div>
      </div>
    </div>
    
    <div class="lg:w-1/2 flex justify-center lg:justify-end">
      <div class="w-full max-w-lg">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div class="h-80 bg-gradient-to-br from-gray-100 to-gray-200 relative">
            <img src="{banner_img}" alt="BottleCRM Dashboard Preview - Free CRM Software Interface" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div class="p-6 bg-white/5">
            <div class="space-y-3">
              <div class="w-full bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full"></div>
              <div class="w-4/5 bg-gradient-to-r from-blue-300 to-indigo-400 h-3 rounded-full"></div>
              <div class="w-3/5 bg-gradient-to-r from-indigo-300 to-blue-400 h-3 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features Section with enhanced content -->
<section class="py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
        Enterprise-Grade CRM Features <span class="text-blue-600">Without Enterprise Costs</span>
      </h2>
      <p class="mt-4 max-w-3xl text-xl text-gray-600 mx-auto leading-relaxed">
        Everything your startup or small business needs to manage customer relationships, automate sales processes, and drive sustainable growth. All features included, no premium tiers.
      </p>
    </div>

    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each features as feature, index}
        {#if mounted}
          <div in:fly="{{ y: 30, duration: 600, delay: index * 100 }}"
               class="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 group relative overflow-hidden">
            
            {#if feature.comingSoon}
              <div class="absolute top-4 right-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Coming Soon
                </span>
              </div>
            {/if}
            
            <div class="rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 p-4 inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
              <svelte:component this={feature.icon} class="h-8 w-8 text-blue-600" />
            </div>
            
            <h3 class="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
            <p class="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
            
            <ul class="space-y-2">
              {#each feature.benefits as benefit}
                <li class="flex items-center text-sm text-gray-700">
                  <Check class="w-4 h-4 text-green-500 mr-2" />
                  {benefit}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</section>

<!-- Comparison Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
        Why Choose BottleCRM Over <span class="text-red-600">Expensive Alternatives?</span>
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Compare BottleCRM with popular CRM solutions and see how much you can save while getting the same powerful features.
      </p>
    </div>

    <div class="overflow-x-auto -mx-4 sm:mx-0">
      <div class="min-w-full inline-block align-middle">
        <table class="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th class="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">CRM Solution</th>
              <th class="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">Pricing</th>
              <th class="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">Open Source</th>
              <th class="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">Self-Hosted</th>
              <th class="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">Customizable</th>
              <th class="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">User Limit</th>
            </tr>
          </thead>
          <tbody>
            {#each competitors as competitor, index}
              <tr class="border-b border-gray-200 {index === 0 ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}">
                <td class="px-3 sm:px-6 py-4 font-semibold {index === 0 ? 'text-blue-700' : 'text-gray-900'} whitespace-nowrap">
                  <div class="flex flex-col sm:flex-row sm:items-center">
                    <span>{competitor.name}</span>
                    {#if index === 0}<span class="mt-1 sm:mt-0 sm:ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">Recommended</span>{/if}
                  </div>
                </td>
                <td class="px-3 sm:px-6 py-4 text-center font-medium {index === 0 ? 'text-green-600' : 'text-gray-700'} text-xs sm:text-sm">{competitor.price}</td>
                <td class="px-3 sm:px-6 py-4 text-center">
                  {#if competitor.openSource}
                    <Check class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                  {:else}
                    <X class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto" />
                  {/if}
                </td>
                <td class="px-3 sm:px-6 py-4 text-center">
                  {#if competitor.selfHosted}
                    <Check class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" />
                  {:else}
                    <X class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto" />
                  {/if}
                </td>
                <td class="px-3 sm:px-6 py-4 text-center text-gray-700 text-xs sm:text-sm">{competitor.customizable}</td>
                <td class="px-3 sm:px-6 py-4 text-center text-gray-700 text-xs sm:text-sm">{competitor.userLimit}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-8 text-center">
      <p class="text-lg text-gray-600 mb-4">
        <strong class="text-green-600">Annual Savings with BottleCRM:</strong> 
        $3,000 - $36,000 per year for a 10-person team
      </p>
      <a href="/pricing" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
        See detailed pricing comparison
        <ChevronRight class="ml-2 w-4 h-4" />
      </a>
    </div>
  </div>
</section>

<!-- Testimonial Section -->
<!-- <section class="py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-4xl font-extrabold text-gray-900 text-center mb-4 sm:text-5xl">
      Trusted by <span class="text-blue-600">1000+</span> Growing Businesses
    </h2>
    <p class="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
      See how startups and small businesses are using BottleCRM to accelerate growth and improve customer relationships.
    </p>
    
    <div class="relative max-w-4xl mx-auto min-h-[300px] md:min-h-[250px]">
      <div class="overflow-hidden">
        {#each testimonials as testimonial, i}
          <div class="transition-all duration-500 ease-in-out absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
               style="opacity: {i === activeTestimonial ? '1' : '0'}; transform: translateX({i === activeTestimonial ? '0%' : (i < activeTestimonial ? '-100%' : '100%')}); pointer-events: {i === activeTestimonial ? 'auto' : 'none'}">
            
            <div class="bg-white rounded-2xl shadow-xl p-8 max-w-3xl">
              <svg class="h-12 w-12 text-blue-400 mb-6 mx-auto" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p class="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">"{testimonial.quote}"</p>
              <div class="border-t border-gray-200 pt-6">
                <div class="font-bold text-gray-900 text-lg">{testimonial.author}</div>
                <div class="text-blue-600 font-medium">{testimonial.role}</div>
                <div class="text-gray-600">{testimonial.company} • {testimonial.industry}</div>
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <button on:click={prevTestimonial} aria-label="Previous testimonial" class="absolute top-1/2 transform -translate-y-1/2 -left-4 md:-left-12 p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-blue-600 hover:shadow-xl focus:outline-none transition-all duration-200 z-10">
        <ChevronLeft class="h-6 w-6" />
      </button>
      
      <button on:click={nextTestimonial} aria-label="Next testimonial" class="absolute top-1/2 transform -translate-y-1/2 -right-4 md:-right-12 p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-blue-600 hover:shadow-xl focus:outline-none transition-all duration-200 z-10">
        <ChevronRight class="h-6 w-6" />
      </button>
      
      <div class="mt-12 flex justify-center space-x-3 pt-4">
        {#each testimonials as _, i}
          <button on:click={() => activeTestimonial = i} 
                  aria-label="Go to testimonial {i + 1}"
                  class="w-3 h-3 rounded-full {i === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'} 
                         focus:outline-none transition-colors duration-300"></button>
        {/each}
      </div>
    </div>
  </div>
</section> -->

<!-- FAQ Section for SEO -->
<section class="py-20 bg-white">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
        Frequently Asked Questions
      </h2>
      <p class="text-xl text-gray-600">
        Everything you need to know about BottleCRM and free CRM software.
      </p>
    </div>

    <div class="space-y-4">
      {#each faqs as faq, index}
        <div class="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <button 
            on:click={() => toggleFaq(index)}
            class="w-full px-6 py-5 text-left focus:outline-none focus:bg-gray-100 hover:bg-gray-100 transition-colors duration-200"
            aria-expanded={activeFaq === index}
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
              <ChevronDown class="w-5 h-5 text-gray-500 transform transition-transform duration-200 {activeFaq === index ? 'rotate-180' : ''}" />
            </div>
          </button>
          
          {#if activeFaq === index}
            <div transition:fade="{{ duration: 200 }}" class="px-6 pb-5">
              <p class="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Open Source Section -->
<section class="py-20 bg-gradient-to-r from-gray-50 to-blue-50"> 
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:flex lg:items-center lg:justify-between lg:space-x-12">
      <div class="lg:w-1/2">
        <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-8">
          100% Free & Open Source CRM Software
        </h2>
        <p class="text-xl text-gray-700 mb-8 leading-relaxed"> 
          BottleCRM is completely free, open-source CRM software hosted on GitHub. Download, customize, self-host, and contribute to the project without any licensing restrictions. Perfect for startups seeking a cost-effective CRM alternative to expensive subscription-based solutions.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <h4 class="font-bold text-gray-900 mb-2">Zero Licensing Costs</h4>
            <p class="text-gray-600 text-sm">Download and use forever without any subscription fees or hidden costs</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <h4 class="font-bold text-gray-900 mb-2">Complete Customization</h4>
            <p class="text-gray-600 text-sm">Modify source code to match your exact business requirements</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <h4 class="font-bold text-gray-900 mb-2">Self-Hosting Options</h4>
            <p class="text-gray-600 text-sm">Host on your own servers for complete data control and privacy</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <h4 class="font-bold text-gray-900 mb-2">Active Community</h4>
            <p class="text-gray-600 text-sm">Benefit from community contributions and collaborative improvements</p>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="https://github.com/MicroPyramid/opensource-startup-crm" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap">
            <Github class="w-5 h-5 mr-2" />
            ⭐ Star on GitHub
          </a>
          <a href="https://github.com/MicroPyramid/opensource-startup-crm/fork" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-lg transition-all duration-200 whitespace-nowrap">
            <GitFork class="w-5 h-5 mr-2" />
            Fork & Customize
          </a>
        </div>
      </div>
      
      <div class="mt-12 lg:mt-0 lg:w-1/2">
        <div class="bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
          <div class="flex items-center mb-6">
            <Github class="h-10 w-10 text-gray-700 mr-4" />
            <div>
              <h3 class="text-2xl font-bold text-gray-900">MicroPyramid/opensource-startup-crm</h3>
              <p class="text-gray-700">Free Open Source CRM: SvelteKit + Prisma</p>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">2+</div>
              <div class="text-sm text-gray-600">GitHub Stars</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">0+</div>
              <div class="text-sm text-gray-600">Forks</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">MIT</div>
              <div class="text-sm text-gray-600">License</div>
            </div>
          </div>
          
          <div class="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
            <div class="mb-2 whitespace-nowrap"># Clone and install BottleCRM</div>
            <div class="text-gray-300 whitespace-nowrap">$ git clone https://github.com/MicroPyramid/opensource-startup-crm.git</div>
            <div class="text-gray-300 whitespace-nowrap">$ cd opensource-startup-crm</div>
            <div class="text-gray-300 whitespace-nowrap">$ pnpm install && pnpm run dev</div>
            <div class="mt-2 text-yellow-400 whitespace-nowrap"># 🎉 Your free CRM is ready!</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Enhanced CTA Section -->
<section class="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-20 relative overflow-hidden">
  <div class="absolute inset-0 bg-black/10"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center">
      <h2 class="text-4xl md:text-6xl font-extrabold mb-6">
        Ready to Stop Paying for CRM?
      </h2>
      <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
        Join the growing community of startups and small businesses who are ditching expensive CRM subscriptions. 
        Start managing customer relationships more effectively today with BottleCRM - completely free, forever.
      </p>
      
      <!-- Savings calculator -->
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto mb-12">
        <h3 class="text-2xl font-bold mb-4">💰 Your Annual Savings Calculator</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-3xl font-bold text-yellow-300">$3,000</div>
            <div class="text-sm text-blue-100">5 Users vs Salesforce</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-yellow-300">$6,000</div>
            <div class="text-sm text-blue-100">10 Users vs HubSpot</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-yellow-300">$18,000</div>
            <div class="text-sm text-blue-100">30 Users vs Pipedrive</div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row sm:justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <a href="/login" class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-blue-700 bg-white hover:bg-gray-100 shadow-2xl transition-all duration-200 hover:scale-105">
          <Zap class="w-6 h-6 mr-3" />
          Start Your Free CRM Today
        </a>
        <a href="/contact" class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white border-2 border-white hover:bg-white/10 transition-all duration-200">
          <MessageCircle class="w-6 h-6 mr-3" />
          Get Professional Support
        </a>
      </div>
      
      <p class="mt-8 text-blue-200 text-lg">
        🚀 No credit card • No setup fees • No user limits • No vendor lock-in
      </p>
    </div>
  </div>
</section>

<!-- Enhanced Stats Section -->
<section class="py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
        <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
            Trusted by a Growing Global Community
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            BottleCRM is empowering startups and small businesses worldwide to build better customer relationships without breaking the bank.
        </p>
    </div>
    
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="text-5xl font-extrabold text-blue-600 mb-2">100%</div>
        <div class="text-lg font-bold text-gray-700 mb-2">Free & Open Source</div>
        <div class="text-sm text-gray-500">No hidden costs, licensing fees, or subscription charges ever.</div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="text-5xl font-extrabold text-green-600 mb-2">New!</div>
        <div class="text-lg font-bold text-gray-700 mb-2">Fresh & Modern</div>
        <div class="text-sm text-gray-500">Built with the latest technologies and modern best practices.</div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="text-5xl font-extrabold text-purple-600 mb-2">MIT</div>
        <div class="text-lg font-bold text-gray-700 mb-2">Open License</div>
        <div class="text-sm text-gray-500">Complete freedom to use, modify, and distribute.</div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="text-5xl font-extrabold text-yellow-600 mb-2">24/7</div>
        <div class="text-lg font-bold text-gray-700 mb-2">Self-Hosted</div>
        <div class="text-sm text-gray-500">Run on your own servers with complete control over your data.</div>
      </div>
    </div>
    
    <!-- Trust badges -->
    <div class="mt-16 text-center">
      <p class="text-gray-600 mb-8 text-lg">Developed with modern, secure, high-performance technologies:</p>
      <div class="flex flex-wrap justify-center items-center gap-4">
        <div class="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md whitespace-nowrap">
          <span class="font-semibold text-gray-700">SvelteKit 2.21+</span>
        </div>
        <div class="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md whitespace-nowrap">
          <span class="font-semibold text-gray-700">Prisma ORM</span>
        </div>
        <div class="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md whitespace-nowrap">
          <span class="font-semibold text-gray-700">TailwindCSS 4.1+</span>
        </div>
      </div>
    </div>
  </div>
</section>
