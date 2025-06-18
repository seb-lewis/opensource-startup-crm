<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import imgLogo from '$lib/assets/images/logo.png';
	import { 
		LayoutDashboard, 
		Users, 
		Building, 
		Briefcase, 
		CheckSquare, 
		HelpCircle, 
		ChevronDown,
		UserPlus,
		Plus,
		Calendar,
		List,
		Target,
		LogOut,
		Menu,
		Moon,
		Sun,
		Settings,
		User,
		X
	} from '@lucide/svelte';

	let { 
		drawerHidden = $bindable(false),
		user = {},
		org_name = 'BottleCRM'
	} = $props();

	let isDark = $state(false);
	let userDropdownOpen = $state(false);

	const closeDrawer = () => {
		drawerHidden = true;
	};

	const toggleDarkMode = () => {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark');
	};

	const toggleUserDropdown = () => {
		userDropdownOpen = !userDropdownOpen;
	};

	let mainSidebarUrl = $derived($page.url.pathname);
	let openDropdowns = $state({});

	const toggleDropdown = (key) => {
		openDropdowns[key] = !openDropdowns[key];
	};

	afterNavigate((navigation) => {
		document.getElementById('svelte')?.scrollTo({ top: 0 });
		closeDrawer();
	});

	const navigationItems = [
		{
			href: '/app',
			label: 'Dashboard',
			icon: LayoutDashboard,
			type: 'link'
		},
		{
			key: 'leads',
			label: 'Leads',
			icon: Target,
			type: 'dropdown',
			children: [
				{ href: '/app/leads/open', label: 'Open Leads', icon: List },
				{ href: '/app/leads/new', label: 'Create Lead', icon: Plus }
			]
		},
		{
			key: 'contacts',
			label: 'Contacts',
			icon: Users,
			type: 'dropdown',
			children: [
				{ href: '/app/contacts', label: 'All Contacts', icon: List },
				{ href: '/app/contacts/new', label: 'New Contact', icon: UserPlus }
			]
		},
		{
			key: 'accounts',
			label: 'Accounts',
			icon: Building,
			type: 'dropdown',
			children: [
				{ href: '/app/accounts', label: 'All Accounts', icon: List },
				{ href: '/app/accounts/new', label: 'New Account', icon: Plus }
			]
		},
		{
			key: 'opportunities',
			label: 'Opportunities',
			icon: Target,
			type: 'dropdown',
			children: [
				{ href: '/app/opportunities', label: 'All Opportunities', icon: List },
				{ href: '/app/opportunities/new', label: 'New Opportunity', icon: Plus }
			]
		},
		{
			key: 'cases',
			label: 'Cases',
			icon: Briefcase,
			type: 'dropdown',
			children: [
				{ href: '/app/cases', label: 'All Cases', icon: List },
				{ href: '/app/cases/new', label: 'New Case', icon: Plus }
			]
		},
		{
			key: 'tasks',
			label: 'Tasks',
			icon: CheckSquare,
			type: 'dropdown',
			children: [
				{ href: '/app/tasks/list', label: 'Task List', icon: List },
				{ href: '/app/tasks/calendar', label: 'Calendar', icon: Calendar }
			]
		},
		{
			href: '/app/support',
			label: 'Support',
			icon: HelpCircle,
			type: 'link'
		}
	];
</script>

<aside
	class={`fixed inset-0 z-30 flex-none h-full w-64 lg:h-auto border-e border-gray-200 dark:border-gray-600 lg:overflow-y-visible lg:block ${drawerHidden ? 'hidden' : ''}`}
>
	<div class="flex flex-col h-full bg-white dark:bg-gray-900">
		<!-- Header section with logo and mobile close button -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<a href="/app" class="flex items-center gap-3">
				<img src={imgLogo} class="h-8 w-auto" alt="BottleCRM Logo" />
				<span class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
					{org_name}
				</span>
			</a>
			
			<!-- Mobile close button -->
			<button
				onclick={closeDrawer}
				class="p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600 transition-colors"
			>
				<X class="w-5 h-5" />
			</button>
		</div>

		<!-- Navigation section -->
		<div class="flex-1 overflow-y-auto px-4 py-4">
			<nav class="space-y-2">
				{#each navigationItems as item}
					{#if item.type === 'link'}
						<a
							href={item.href}
							class={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
								mainSidebarUrl === item.href 
									? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400' 
									: 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
							}`}
						>
							{@render item.icon({ class: 'w-5 h-5' })}
							<span>{item.label}</span>
						</a>
					{:else if item.type === 'dropdown'}
						<div class="space-y-1">
							<button
								type="button"
								class="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
								onclick={() => toggleDropdown(item.key)}
							>
								<div class="flex items-center gap-3">
									{@render item.icon({ class: 'w-5 h-5' })}
									<span>{item.label}</span>
								</div>
								<ChevronDown class={`w-4 h-4 transition-transform duration-200 ${openDropdowns[item.key] ? 'rotate-180' : ''}`} />
							</button>
							
							{#if openDropdowns[item.key]}
								<div class="ml-8 space-y-1 border-l-2 border-gray-100 dark:border-gray-700 pl-4">
									{#each item.children as child}
										<a
											href={child.href}
											class={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
												mainSidebarUrl === child.href 
													? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/20 dark:text-blue-400' 
													: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
											}`}
										>
											{@render child.icon({ class: 'w-4 h-4' })}
											<span>{child.label}</span>
										</a>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			</nav>
		</div>

		<!-- User profile section - moved to bottom -->
		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-3 mb-3">
				<img class="w-10 h-10 rounded-lg object-cover" src={user.profilePhoto} alt="User avatar" />
				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</div>
					<div class="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
				</div>
			</div>
			
			<!-- Quick actions -->
			<div class="flex items-center justify-between">
				<button
					onclick={toggleDarkMode}
					class="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					title="Toggle dark mode"
				>
					{#if isDark}
						<Sun class="w-4 h-4" />
					{:else}
						<Moon class="w-4 h-4" />
					{/if}
				</button>
				
				<button
					onclick={toggleUserDropdown}
					class="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					title="User menu"
				>
					<Settings class="w-4 h-4" />
				</button>
			</div>

			<!-- User dropdown menu -->
			{#if userDropdownOpen}
				<div class="mt-3 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
					<a
						href="/app/profile"
						class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700 rounded transition-colors"
					>
						<User class="w-4 h-4" />
						Profile
					</a>
					<a
						href="/app/users"
						class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700 rounded transition-colors"
					>
						<Users class="w-4 h-4" />
						Users
					</a>
					<a
						href="/org"
						class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700 rounded transition-colors"
					>
						<Building class="w-4 h-4" />
						Organizations
					</a>
					<hr class="my-1 border-gray-200 dark:border-gray-600" />
					<a
						href="/logout"
						class="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
					>
						<LogOut class="w-4 h-4" />
						Sign out
					</a>
				</div>
			{/if}
		</div>
	</div>
</aside>

<div
	hidden={drawerHidden}
	class="fixed inset-0 z-20 bg-gray-900/50 dark:bg-gray-900/60 lg:hidden"
	onclick={closeDrawer}
	onkeydown={closeDrawer}
	role="presentation"
></div>
