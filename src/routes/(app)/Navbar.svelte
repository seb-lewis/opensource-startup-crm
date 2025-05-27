<script>
	import '../../app.css';
	import imgLogo from '$lib/assets/images/logo.png';
	import { Users, Building, LogOut, Menu, Moon, Sun, ChevronDown } from 'lucide-svelte';

	let {
		org_name = 'BottleCRM',
		fluid = true,
		drawerHidden = $bindable(false),
		list = false,
		name = 'Neil Sims',
		email = "",
		userPic = ''
	} = $props();

	let isDark = $state(false);
	let dropdownOpen = $state(false);

	const toggleDarkMode = () => {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark');
	};

	const toggleDropdown = () => {
		dropdownOpen = !dropdownOpen;
	};
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-800 border-b px-4 lg:px-6 py-2.5">
	<div class={`flex flex-wrap justify-between items-center mx-auto ${fluid ? 'max-w-screen-xl' : ''}`}>
		<button
			onclick={() => (drawerHidden = !drawerHidden)}
			class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:block lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
		>
			<Menu class="w-6 h-6" />
		</button>

		<a href="/" class={`flex items-center ${list ? 'w-40' : 'lg:w-60'}`}>
			<img src={imgLogo} class="mr-3 h-6 sm:h-8" alt="BottleCRM" />
			<span class="self-center text-xl font-semibold whitespace-nowrap sm:text-2xl dark:text-white">
				{org_name}
			</span>
		</a>

		<div class="hidden lg:block lg:ps-3">
			{#if list}
				<ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
					<li><a href="/" class="block py-2 pr-4 pl-3 text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white">Home</a></li>
					<li><a href="#top" class="block py-2 pr-4 pl-3 text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white">Messages</a></li>
					<li><a href="#top" class="block py-2 pr-4 pl-3 text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white">Profile</a></li>
					<li><a href="#top" class="block py-2 pr-4 pl-3 text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white">Settings</a></li>
				</ul>
			{/if}
		</div>

		<div class="flex items-center lg:order-2">
			<button
				onclick={toggleDarkMode}
				class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
			>
				{#if isDark}
					<Sun class="w-5 h-5" />
				{:else}
					<Moon class="w-5 h-5" />
				{/if}
			</button>

			<div class="relative">
				<button
					onclick={toggleDropdown}
					class="flex mx-3 text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
				>
					<img class="w-8 h-8 rounded-full" src={userPic} alt="user" />
				</button>

				{#if dropdownOpen}
					<div class="absolute right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 min-w-[220px]">
						<div class="px-4 py-3 border-b border-gray-100 dark:border-gray-600">
							<span class="block text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
							<span class="block text-sm text-gray-500 dark:text-gray-400 truncate">{email}</span>
						</div>
						<ul class="py-1">
							<li>
								<a
									href="/app/users"
									class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
								>
									<Users class="w-4 h-4 text-gray-400" />
									Users
								</a>
							</li>
							<li>
								<a
									href="/org"
									class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
								>
									<Building class="w-4 h-4 text-gray-400" />
									All Organizations
								</a>
							</li>
							<li class="border-t border-gray-100 dark:border-gray-600">
								<a
									href="/logout"
									class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400"
								>
									<LogOut class="w-4 h-4" />
									Sign out
								</a>
							</li>
						</ul>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>
