<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import '../../app.css'; // Import the app.css file directly
  
  let isMenuOpen = false;
  let isDarkMode = false;
  
  // Toggle mobile menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // Toggle dark mode
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }
  
  // Close mobile menu when route changes
  $: if ($page.url.pathname) {
    isMenuOpen = false;
  }
  
  onMount(() => {
    // Check for dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
    
    // Tailwind CSS is being imported in app.css, no need to add it here
  });
</script>

<div class="min-h-screen flex flex-col {isDarkMode ? 'dark' : ''}">
  <!-- Navigation -->
  <nav class="bg-gray-900 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold">BottleCRM</span>
          </a>
        </div>
        
        <!-- Desktop menu -->
        <div class="hidden md:flex items-center space-x-4">
          <a href="/features" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Features</a>
          <a href="/pricing" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Pricing</a>
          <a href="/blog" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Blog</a>
          <a href="/contact" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Contact</a>
          <a href="/login" class="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700">Login</a>
          <a href="/signup" class="ml-2 px-4 py-2 rounded-md text-sm font-medium border border-blue-600 hover:bg-blue-700">Sign Up</a>
          <button on:click={toggleDarkMode} class="ml-4 p-2 rounded-full hover:bg-gray-700" aria-label="Toggle dark mode">
            {#if isDarkMode}
              <!-- Sun icon for light mode -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
            {:else}
              <!-- Moon icon for dark mode -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            {/if}
          </button>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button on:click={toggleMenu} class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {#if isMenuOpen}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              {/if}
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    {#if isMenuOpen}
      <div class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="/features" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Features</a>
          <a href="/pricing" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Pricing</a>
          <a href="/blog" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Blog</a>
          <a href="/contact" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Contact</a>
          <a href="/login" class="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 mt-2">Login</a>
          <a href="/signup" class="block px-3 py-2 rounded-md text-base font-medium border border-blue-600 hover:bg-blue-700 mt-2">Sign Up</a>
          <button on:click={toggleDarkMode} class="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 mt-2 flex items-center">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            <span class="ml-2">
              {#if isDarkMode}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              {/if}
            </span>
          </button>
        </div>
      </div>
    {/if}
  </nav>

  <!-- Page content -->
  <main class="flex-grow dark:bg-gray-800 dark:text-white">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">BottleCRM</h3>
          <p class="text-gray-300">Streamline your customer relationships with our powerful CRM solution.</p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Product</h3>
          <ul class="space-y-2">
            <li><a href="/features" class="text-gray-300 hover:text-white">Features</a></li>
            <li><a href="/pricing" class="text-gray-300 hover:text-white">Pricing</a></li>
            <li><a href="/integrations" class="text-gray-300 hover:text-white">Integrations</a></li>
            <li><a href="/updates" class="text-gray-300 hover:text-white">Updates</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Resources</h3>
          <ul class="space-y-2">
            <li><a href="/blog" class="text-gray-300 hover:text-white">Blog</a></li>
            <li><a href="/documentation" class="text-gray-300 hover:text-white">Documentation</a></li>
            <li><a href="/support" class="text-gray-300 hover:text-white">Support</a></li>
            <li><a href="/community" class="text-gray-300 hover:text-white">Community</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Company</h3>
          <ul class="space-y-2">
            <li><a href="/about" class="text-gray-300 hover:text-white">About</a></li>
            <li><a href="/contact" class="text-gray-300 hover:text-white">Contact</a></li>
            <li><a href="/careers" class="text-gray-300 hover:text-white">Careers</a></li>
            <li><a href="/legal" class="text-gray-300 hover:text-white">Legal</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-700">
        <div class="flex justify-between items-center flex-col md:flex-row">
          <p class="text-gray-300">© {new Date().getFullYear()} BottleCRM. All rights reserved.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="." class="text-gray-300 hover:text-white">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="." class="text-gray-300 hover:text-white">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="." class="text-gray-300 hover:text-white">
              <span class="sr-only">LinkedIn</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>
