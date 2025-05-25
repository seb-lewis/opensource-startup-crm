<script>
  import { enhance } from "$app/forms";

  /** @type {import('./$types').PageProps} */
  let { form } = $props();

  let title = $state(form?.data?.title ?? '');
  let excerpt = $state(form?.data?.excerpt ?? '');
  
  function make_slug(title) {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }

  let slug = $derived(make_slug(title));
</script>

<div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-6">Create New Blog</h1>

  {#if form?.error}
    <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {form.error}
    </div>
  {/if}

  {#if form?.success}
    <div class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
      Blog post created successfully!
    </div>
  {/if}

  <form method="POST" class="space-y-4" use:enhance>
    <div>
      <label for="title" class="block mb-1 font-medium">Title</label>
      <input class="w-full border rounded px-3 py-2" id="title" name="title" bind:value={title} required />
    </div>
    <div>
      <label for="excerpt" class="block mb-1 font-medium">Excerpt</label>
      <textarea
        class="w-full border rounded px-3 py-2"
        id="excerpt"
        name="excerpt"
        bind:value={excerpt}
        required
        rows="2"
      ></textarea>
    </div>
    <div>
      <label for="slug" class="block mb-1 font-medium">Slug</label>
      <input class="w-full border rounded px-3 py-2" id="slug" name="slug" bind:value={slug} required />
    </div>
    
    <button
      type="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >Create Blog</button>
  </form>
</div>
