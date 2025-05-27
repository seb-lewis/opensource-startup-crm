<script>
	import '../../app.css'
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
	let { data, children } = $props();

	let drawerHidden = $state(true);
</script>

<header class="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
    <Navbar
        bind:drawerHidden
        name={data.user.name}
        email={data.user.email}
        userPic={data.user.profilePhoto}
        org_name={data.org_name}
    />
</header>

<div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
	<Sidebar bind:drawerHidden />
	<main class="flex-1 lg:ml-64" style="padding-top: 73px;">
		<div class="p-6">
			{@render children()}
		</div>
	</main>
</div>
