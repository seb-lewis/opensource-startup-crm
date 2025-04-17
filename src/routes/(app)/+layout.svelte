<script>
	import '../../app.css'
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
	let { data, children } = $props();

	let drawerHidden = $state(false);
	// export let data;
</script>

<header
	class="fixed top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
>
	<Navbar bind:drawerHidden name={data.user.name} email={data.user.email} userPic={data.user.profilePhoto} />
</header>
<div class="overflow-hidden lg:flex">
	<Sidebar bind:drawerHidden />
	<div class="relative h-full w-full overflow-y-auto lg:ml-64 pt-[70px]">
		<div class="w-full">
			{@render children()}
		</div>
	</div>
</div>
