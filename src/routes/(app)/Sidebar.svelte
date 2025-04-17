<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Fa from 'svelte-fa';
	import { faPieChart } from '@fortawesome/free-solid-svg-icons';
	import {
		Sidebar,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import { LifeSaverSolid } from 'flowbite-svelte-icons';

	export let drawerHidden = false;

	const closeDrawer = () => {
		drawerHidden = true;
	};

	let iconClass =
		'flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white';
	let itemClass =
		'flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700';
	let groupClass = 'pt-2 space-y-2';

	$: mainSidebarUrl = $page.url.pathname;
	let activeMainSidebar;

	afterNavigate((navigation) => {
		// this fixes https://github.com/themesberg/flowbite-svelte/issues/364
		document.getElementById('svelte')?.scrollTo({ top: 0 });
		closeDrawer();

		activeMainSidebar = navigation.to?.url.pathname ?? '';
	});

	let menu = [
		{ name: 'Dashboard', icon: 'ChartPieOutline', href: '/app/dashboard' },
		{ name: 'Leads', icon: 'FunnelOutline', href: '/app/leads' },
		{ name: 'Contacts', icon: 'UserOutline', href: '/app/contacts' },
		{
			name: 'Accounts',
			icon: 'BuildingOfficeOutline',
			children: {
				'All Accounts': '/app/accounts',
				'New Account': '/app/accounts/new',
				'Account Opportunities': '/app/accounts/opportunities',
				'Deleted/Archived Accounts': '/app/accounts/deleted'
			}
		},
		{
			name: 'Opportunities',
			icon: 'CurrencyDollarOutline',
			children: {
				'All Opportunities': '/app/opportunities',
				'New Opportunity': '/app/opportunities/new'
			}
		},
		{
			name: 'Cases',
			icon: 'LifebuoyOutline',
			children: {
				'All Cases': '/app/cases',
				'New Case': '/app/cases/new'
			}
		},
		{
			name: 'Tasks',
			icon: 'ClipboardOutline',
			children: {
				'All Tasks': '/app/tasks',
				'New Task': '/app/tasks/new',
				Calendar: '/app/tasks/calendar'
			}
		},
		{
			name: 'Invoices',
			icon: 'ReceiptOutline',
			children: {
				'All Invoices': '/app/invoices',
				'Create Invoice': '/app/invoices/new'
			}
		},
		{
			name: 'Reports',
			icon: 'ChartBarOutline',
			children: {
				'Sales Reports': '/app/reports/sales',
				'Case Stats': '/app/reports/cases',
				'Invoice Trends': '/app/reports/invoices'
			}
		},
		{
			name: 'Settings',
			icon: 'CogOutline',
			children: {
				'User Management': '/app/settings/users',
				'Custom Fields': '/app/settings/fields',
				Integrations: '/app/settings/integrations'
			}
		}
	];
	let links = [
		{
			label: 'Support',
			href: 'https://discord.gg/',
			icon: LifeSaverSolid
		}
	];
	let dropdowns = Object.fromEntries(Object.keys(menu).map((x) => [x, false]));
</script>

<Sidebar
	class={drawerHidden ? 'hidden' : ''}
	activeUrl={mainSidebarUrl}
	activeClass="bg-gray-100 dark:bg-gray-700"
	asideClass="fixed inset-0 z-30 flex-none h-full w-64 lg:h-auto border-e border-gray-200 dark:border-gray-600 lg:overflow-y-visible lg:pt-16 lg:block"
>
	<h4 class="sr-only">Main menu</h4>
	<SidebarWrapper
		divClass="overflow-y-auto px-3 pt-20 lg:pt-5 h-full bg-white scrolling-touch max-w-2xs lg:h-[calc(100vh-4rem)] lg:block dark:bg-gray-800 lg:me-0 lg:sticky top-2"
	>
		<nav class="divide-y divide-gray-200 dark:divide-gray-700">
			<SidebarGroup ulClass={groupClass} class="mb-3">
				<SidebarItem
					label="Dashboard"
					href="/app"
					class={`${itemClass} ${mainSidebarUrl === '/app' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					spanClass="ml-3"
				>
					<svelte:fragment slot="icon">
						<Fa
							icon={faPieChart}
							class={`${iconClass} ${mainSidebarUrl === '/app' ? 'text-gray-900 dark:text-white' : ''}`}
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarDropdownWrapper label="Leads">
					<SidebarDropdownItem
						label="Open Leads"
						href="/app/leads/open"
						class={`${itemClass} ${mainSidebarUrl === '/app/leads/open' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="Create Lead"
						href="/app/leads/new"
						class={`${itemClass} ${mainSidebarUrl === '/app/leads/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
				</SidebarDropdownWrapper>

				<SidebarDropdownWrapper label="Accounts">
					<SidebarDropdownItem
						label="All Accounts"
						href="/app/accounts"
						class={`${itemClass} ${mainSidebarUrl === '/app/accounts' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="New Account"
						href="/app/accounts/new"
						class={`${itemClass} ${mainSidebarUrl === '/app/accounts/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="Account Opportunities"
						href="/app/accounts/opportunities"
						class={`${itemClass} ${mainSidebarUrl === '/app/accounts/opportunities' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
				</SidebarDropdownWrapper>
				<SidebarDropdownWrapper label="Cases">
					<SidebarDropdownItem
						label="All Cases"
						href="/app/cases"
						class={`${itemClass} ${mainSidebarUrl === '/app/cases' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="New Case"
						href="/app/cases/new"
						class={`${itemClass} ${mainSidebarUrl === '/app/cases/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
				</SidebarDropdownWrapper>

				<SidebarDropdownWrapper label="Tasks">
					<SidebarDropdownItem
						label="Boards"
						href="/app/tasks"
						class={`${itemClass} ${mainSidebarUrl === '/app/tasks' ? 'bg-blue-100 font-semibold dark:bg-blue-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="Calendar"
						href="/app/tasks/calendar"
						class={`${itemClass} ${mainSidebarUrl === '/app/tasks/calendar' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
				</SidebarDropdownWrapper>
			</SidebarGroup>
			<SidebarGroup ulClass={groupClass}>
				{#each links as { label, href, icon } (label)}
					<SidebarItem {label} {href} spanClass="ml-3" class={itemClass} target="_blank">
						<svelte:component this={icon} slot="icon" class={iconClass} />
					</SidebarItem>
				{/each}
			</SidebarGroup>
		</nav>
	</SidebarWrapper>
</Sidebar>

<div
	hidden={drawerHidden}
	class="fixed inset-0 z-20 bg-gray-900/50 dark:bg-gray-900/60"
	on:click={closeDrawer}
	on:keydown={closeDrawer}
	role="presentation"
></div>
