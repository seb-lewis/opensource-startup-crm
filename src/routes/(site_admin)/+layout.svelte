<script>
  import '../../app.css';
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Admin Navigation -->
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <a href="/admin" class="text-xl font-bold text-blue-600">BottleCRM Admin</a>
          </div>
          <div class="ml-6 flex space-x-8">
            <a 
              href="/admin/blog"
              class="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Blog Posts
            </a>
          </div>
        </div>
        <div class="flex items-center">
          <a href="/" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Back to Site
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Page Content -->
  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <slot />
    </div>
  </main>
</div>
