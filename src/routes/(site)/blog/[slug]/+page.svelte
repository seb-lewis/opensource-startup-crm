<script>
  import { marked } from 'marked';
  import { onMount } from 'svelte';
  
  export let data;
  
  const { post, relatedPosts } = data;
  
  let renderedContent = '';
  
  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Format date for datetime attribute
  function formatISODate(dateString) {
    return new Date(dateString).toISOString();
  }
  
  // Initialize marked with safe defaults
  onMount(() => {
    // Set up marked options for security
    marked.setOptions({
      headerIds: false,
      mangle: false,
      smartLists: true,
      smartypants: true
    });
    
    // Render content
    renderedContent = marked.parse(post.content || '');
  });
</script>

<svelte:head>
  <title>{post.title} | BottleCRM Blog</title>
  <meta name="description" content={post.excerpt || `Read ${post.title} on the BottleCRM blog`} />
</svelte:head>

<article class="bg-white">
  <!-- Hero section -->
  <div class="py-16 bg-gradient-to-b from-blue-50 to-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb navigation -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <a href="/blog" class="hover:text-blue-600">Blog</a>
          </li>
          <li>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </li>
          <li>
            <span class="text-gray-900 font-medium truncate" aria-current="page">{post.title}</span>
          </li>
        </ol>
      </nav>
      
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        
        {#if post.excerpt}
          <p class="mt-4 text-xl text-gray-500">
            {post.excerpt}
          </p>
        {/if}
        
        <div class="mt-6 flex items-center justify-center">
          <div class="flex-shrink-0">
            {#if post.author?.profilePhoto}
              <img class="h-12 w-12 rounded-full object-cover" src={post.author.profilePhoto} alt={post.author?.name || 'Author'} />
            {:else}
              <div class="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {post.author?.name?.[0] || 'A'}
              </div>
            {/if}
          </div>
          <div class="ml-3 text-center sm:text-left">
            <p class="text-base font-medium text-gray-900">
              {post.author?.name || 'BottleCRM Team'}
            </p>
            <div class="flex space-x-1 text-sm text-gray-500">
              <time datetime={formatISODate(post.createdAt)}>
                {formatDate(post.createdAt)}
              </time>
              {#if post.updatedAt && post.updatedAt !== post.createdAt}
                <span>&middot;</span>
                <span>Updated {formatDate(post.updatedAt)}</span>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Blog content -->
  <div class="py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="prose prose-blue prose-lg mx-auto">
        {@html renderedContent}
      </div>
    </div>
  </div>
</article>

<!-- Related posts section -->
{#if relatedPosts && relatedPosts.length > 0}
  <section class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">More from this author</h2>
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {#each relatedPosts as relatedPost}
          <a 
            href="/blog/{relatedPost.slug}"
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {relatedPost.title}
            </h3>
            <time datetime={formatISODate(relatedPost.createdAt)} class="text-sm text-gray-500">
              {formatDate(relatedPost.createdAt)}
            </time>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}

<div class="bg-white py-8">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <a href="/blog" class="inline-flex items-center text-blue-600 hover:underline">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to all blog posts
      </a>
    </div>
  </div>
</div>

<style>
  /* Add additional styling for the prose content if needed */
  :global(.prose img) {
    border-radius: 0.375rem;
    margin: 2rem auto;
  }
  
  :global(.prose a) {
    color: #2563eb;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  
  :global(.prose a:hover) {
    color: #1e40af;
  }
  
  :global(.prose blockquote) {
    border-left-color: #93c5fd;
    background-color: #f0f9ff;
    padding: 1rem;
    border-radius: 0.25rem;
  }
</style>
