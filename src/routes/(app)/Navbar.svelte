<script>
	import '../../app.css';
	import imgLogo from '$lib/assets/images/logo.png';
	import { Users, Building, LogOut, Menu, Moon, Sun, Settings, User } from '@lucide/svelte';

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

	// Close dropdown when clicking outside
	const handleClickOutside = (event) => {
		if (dropdownOpen && !event.target.closest('.user-dropdown')) {
			dropdownOpen = false;
		}
	};
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 px-4 lg:px-6 py-3 shadow-sm">
	<div class="flex items-center justify-between w-full">
		<!-- Left side: Mobile menu + Logo -->
		<div class="flex items-center gap-3">
			<!-- Mobile menu button -->
			<button
				onclick={() => (drawerHidden = !drawerHidden)}
				class="inline-flex items-center p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600 transition-colors"
			>
				<Menu class="w-6 h-6" />
			</button>

			<!-- Logo and brand -->
			<a href="/app" class="flex items-center gap-3">
				<img src={imgLogo} class="h-8 w-auto" alt="BottleCRM Logo" />
				<span class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
					{org_name}
				</span>
			</a>
		</div>

		<!-- Center: Navigation items for larger screens -->
		<div class="hidden lg:block">
			{#if list}
				<ul class="flex items-center gap-8">
					<li><a href="/" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">Home</a></li>
					<li><a href="#messages" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">Messages</a></li>
					<li><a href="#profile" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">Profile</a></li>
					<li><a href="#settings" class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">Settings</a></li>
				</ul>
			{/if}
		</div>

		<!-- Right side: Controls -->
		<div class="flex items-center gap-3">
			<!-- Dark mode toggle -->
			<button
				onclick={toggleDarkMode}
				class="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
				title="Toggle dark mode"
			>
				{#if isDark}
					<Sun class="w-5 h-5" />
				{:else}
					<Moon class="w-5 h-5" />
				{/if}
			</button>

			<!-- User dropdown -->
			<div class="relative user-dropdown">
				<button
					onclick={toggleDropdown}
					class="flex items-center gap-3 p-1.5 text-sm bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
				>
					<img class="w-8 h-8 rounded-md object-cover" src={userPic} alt="User avatar" />
					<div class="hidden md:block text-left">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
						<div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">{email}</div>
					</div>
				</button>

				{#if dropdownOpen}
					<div class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
						<!-- User info -->
						<div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 md:hidden">
							<div class="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
							<div class="text-sm text-gray-500 dark:text-gray-400">{email}</div>
						</div>
						
						<!-- Menu items -->
						<div class="py-1">
							<a
								href="/app/profile"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
							>
								<User class="w-4 h-4" />
								Profile
							</a>
							<a
								href="/app/users"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
							>
								<Users class="w-4 h-4" />
								Users
							</a>
							<a
								href="/org"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
							>
								<Building class="w-4 h-4" />
								Organizations
							</a>
							<a
								href="/app/settings"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
							>
								<Settings class="w-4 h-4" />
								Settings
							</a>
						</div>
						
						<!-- Logout -->
						<div class="border-t border-gray-100 dark:border-gray-700 py-1">
							<a
								href="/logout"
								class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
							>
								<LogOut class="w-4 h-4" />
								Sign out
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>
