<script>
	import { marked } from 'marked';
    
    import { MetaTags } from "svelte-meta-tags";
    import Highlight from "svelte-highlight";
    import python from "svelte-highlight/languages/python";
    import "svelte-highlight/styles/github-dark.css"
    import Fa from "svelte-fa";
    import {
        faTwitter,
        faFacebook,
        faLinkedin,
    } from "@fortawesome/free-brands-svg-icons";
    
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
  // console.log(data.category)

</script>

<!-- Add Edit link at the top -->
<div class="max-w-6xl mx-auto px-4 pt-8 flex justify-end">
  <a
    href={`/admin/blogs/${data.blog.id}/edit`}
    class="inline-block px-4 py-2 rounded bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
  >
    Edit
  </a>
</div>

  <section class="blog_det_banner mb-4">
    <div class="px-4 max-w-6xl mx-auto">
      <div class="flex flex-col items-center justify-center mt-12">
        <div class="w-full text-center">
          <a href="/blog/category/{data.blog.categorySlug}" class="inline-block px-3 py-1 rounded bg-yellow-400 text-gray-900 font-semibold text-sm mb-2">{data.blog.category}</a>
          <p class="text-3xl md:text-4xl font-bold mt-3 mb-4">{data.blog.title}</p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row mt-12 gap-8">
        <div class="w-full md:w-9/12">
          <div class="max-w-none">
            {#each data.blog.contentBlocks as block}
              <div class="mb-6">
                {#if block.type == "MARKDOWN"}

                  <div class=" text-black" >{@html marked(block.content)}</div>
                {/if}

                {#if block.type == "CODE"}
                  <div class="my-4"><Highlight language={python} code={block.content} /></div>
                {/if}
              </div>
            {/each}

            <div class="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center gap-4">
              <span class="font-medium">Share this Blog post</span>
              <div class="flex gap-4 mt-2 md:mt-0">
                <a href="https://www.facebook.com/MicroPyramid" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"><Fa icon={faFacebook} /> Facebook</a>
                <a href="https://x.com/micropyramid" class="flex items-center gap-2 text-blue-400 hover:text-blue-600 transition"><Fa icon={faTwitter} /> X</a>
                <a href="https://www.linkedin.com/company/micropyramid" class="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"><Fa icon={faLinkedin} /> Linkedin</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <MetaTags
    title={data.blog.seoTitle}
    titleTemplate="%s | MicroPyramid"
    description={data.blog.seoDescription}
    canonical={"https://micropyramid.com/blog/" + data.blog.slug + "/"}
    openGraph={{
      url: data.blog.slug,
      title: data.blog.seoTitle,
      description: data.blog.seoDescription,
      images: [
        {
          url: "https://d28k6hocvoxiuc.cloudfront.net/site/images/mplogo.png",
          width: 800,
          height: 600,
          alt: "MicroPyramid - Software development Services",
        },
      ],
      site_name: "MicroPyramid",
    }}
    twitter={{
      handle: "@micropyramid",
      site: "@micropyramid",
      cardType: "summary_large_image",
      title: data.blog.seoTitle,
      description: data.blog.seoDescription,
      image: "https://d28k6hocvoxiuc.cloudfront.net/site/images/mplogo.png",
      imageAlt: "MicroPyramid - Software development Services",
    }}
  />
