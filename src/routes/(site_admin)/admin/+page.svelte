<script>
  // You can add any necessary imports here
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
    <p class="mt-1 text-sm text-gray-500">
      Welcome to the BottleCRM admin dashboard. From here you can manage your site content.
    </p>
  </div>

  <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
    <div class="px-4 py-5 sm:px-6">
      <h2 class="text-lg font-medium text-gray-900">Admin Tools</h2>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Blog Management Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-lg font-medium text-gray-900">Blog Posts</dt>
                <dd class="flex items-baseline">
                  <div class="text-sm text-gray-500">
                    Manage your blog content
                  </div>
                </dd>
              </div>
            </div>
            <div class="mt-5">
              <a href="/admin/blog" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Go to Blog Management
              </a>
            </div>
          </div>
        </div>

        <!-- Additional admin modules can be added here as cards -->
      </div>
    </div>
  </div>
</div>
