<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Support Information</h1>

    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
        <p class="text-gray-700 mb-4">
            This is an open-source CRM developed for startups and medium-sized companies. We are committed to
            improving and evolving this platform.
        </p>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-3 text-gray-700">Feature Requests & Bug Reports</h2>
        <p class="text-gray-700">
            If you want new features or wish to report bugs, please create an issue in our
            <a href="https://github.com/MicroPyramid/opensource-startup-crm" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">GitHub repository</a>.
            Your feedback is valuable to us!
        </p>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-3 text-gray-700">Security Issues</h2>
        <p class="text-gray-700">
            If you find any security issues, please do not report them in the public GitHub repository.
            Instead, send an email directly to
            <a href="mailto:ashwin@micropyramid.com" class="text-blue-600 hover:text-blue-800 underline">ashwin@micropyramid.com</a>.
            We take security very seriously and will address your concerns promptly.
        </p>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-3 text-gray-700">Custom CRM Development</h2>
        <p class="text-gray-700">
            We also offer custom CRM development services based on this project. If you have specific
            requirements or need a tailored solution for your business, feel free to reach out to us.
        </p>
    </div>
</div>