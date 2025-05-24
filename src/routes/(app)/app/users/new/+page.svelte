<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-xl w-full space-y-8">
    <div class="bg-white p-8 rounded-2xl shadow-xl">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Create New User</h2>
      <form class="space-y-6">
        <!-- Profile Photo Upload -->
        

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Full Name" />
          </div>
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="user@email.com" />
          </div>
          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="+1 234 567 8901" />
          </div>
          <!-- Department -->
          
          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>


        <!-- Actions -->
        <div class="flex items-center justify-between mt-6">
          <button type="submit" class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition">Create User</button>
          <a href="/app/users" class="w-full md:w-auto mt-2 md:mt-0 md:ml-4 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition text-center">Cancel</a>
        </div>
      </form>
    </div>
  </div>
</div>