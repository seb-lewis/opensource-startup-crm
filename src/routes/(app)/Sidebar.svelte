<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
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
		Target
	} from '@lucide/svelte';

	let { drawerHidden = $bindable(false) } = $props();

	const closeDrawer = () => {
		drawerHidden = true;
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
			key: 'accounts',
			label: 'Accounts',
			icon: Building,
			type: 'dropdown',
			children: [
				{ href: '/app/accounts', label: 'All Accounts', icon: List },
				{ href: '/app/accounts/new', label: 'New Account', icon: Plus },
				{ href: '/app/accounts/opportunities', label: 'Opportunities', icon: Target }
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
	class={`fixed inset-0 z-30 flex-none h-full w-64 lg:h-auto border-e border-gray-200 dark:border-gray-600 lg:overflow-y-visible lg:pt-15 lg:block ${drawerHidden ? 'hidden' : ''}`}
>
	<div class="overflow-y-auto px-4 pt-20 lg:pt-6 h-full bg-white dark:bg-gray-900 lg:h-[calc(100vh-4rem)] lg:sticky top-2">
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
</aside>

<div
	hidden={drawerHidden}
	class="fixed inset-0 z-20 bg-gray-900/50 dark:bg-gray-900/60 lg:hidden"
	onclick={closeDrawer}
	onkeydown={closeDrawer}
	role="presentation"
></div>
