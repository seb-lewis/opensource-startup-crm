<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Blogs</h1>
  <div class="mb-4 flex justify-end">
    <a href="/admin/blogs/new" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
      + New Blog
    </a>
  </div>
  <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
    <thead>
      <tr class="bg-gray-100">
        <th class="py-2 px-4 border-b text-left">Title</th>
        <th class="py-2 px-4 border-b text-left">Category</th>
        <th class="py-2 px-4 border-b text-left">Draft</th>
        <th class="py-2 px-4 border-b text-left">Created At</th>
        <th class="py-2 px-4 border-b text-left">Updated At</th>
      </tr>
    </thead>
    <tbody>
      {#each data.blogs as blog}
        <tr class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b"><a href="/admin/blogs/{blog.id}/">{blog.title}</a> - <a href="/admin/blogs/{blog.id}/edit/">Edit</a></td>
          <td class="py-2 px-4 border-b">{blog.category}</td>
          <td class="py-2 px-4 border-b">
            {#if blog.draft}
              <span class="inline-block px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded">Draft</span>
            {:else}
              <span class="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">Published</span>
            {/if}
          </td>
          <td class="py-2 px-4 border-b">{new Date(blog.createdAt).toLocaleString()}</td>
          <td class="py-2 px-4 border-b">{new Date(blog.updatedAt).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
