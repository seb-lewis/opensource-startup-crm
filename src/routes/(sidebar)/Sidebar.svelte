<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
    import Fa from 'svelte-fa';
  import { 
    faUser, faArrowRightFromBracket, faBookOpen, 
    faLayerGroup, faListCheck, faBuildingColumns, faLocationDot, 
	faCog,

	faPieChart


  } from '@fortawesome/free-solid-svg-icons';
	import {
		Sidebar,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import {
		AngleDownOutline,
		AngleUpOutline,
		ClipboardListSolid,
		CogOutline,
		FileChartBarSolid,
		GithubSolid,
		LayersSolid,
		LifeSaverSolid,
		LockSolid,
		WandMagicSparklesOutline,
		ChartPieOutline,
		RectangleListSolid,
		TableColumnSolid
	} from 'flowbite-svelte-icons';

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
	{ name: 'Dashboard', icon: 'ChartPieOutline', href: '/dashboard' },
	{ name: 'Leads', icon: 'FunnelOutline', href: '/leads' },
	{ name: 'Contacts', icon: 'UserOutline', href: '/contacts' },
	{ name: 'Accounts', icon: 'BuildingOfficeOutline', href: '/accounts' },
	{
		name: 'Opportunities',
		icon: 'CurrencyDollarOutline',
		children: {
			'All Opportunities': '/opportunities',
			'New Opportunity': '/opportunities/new'
		}
	},
	{
		name: 'Cases',
		icon: 'LifebuoyOutline',
		children: {
			'All Cases': '/cases',
			'New Case': '/cases/new'
		}
	},
	{
		name: 'Tasks',
		icon: 'ClipboardOutline',
		children: {
			'All Tasks': '/tasks',
			'New Task': '/tasks/new',
			Calendar: '/tasks/calendar'
		}
	},
	{
		name: 'Invoices',
		icon: 'ReceiptOutline',
		children: {
			'All Invoices': '/invoices',
			'Create Invoice': '/invoices/new'
		}
	},
	{
		name: 'Reports',
		icon: 'ChartBarOutline',
		children: {
			'Sales Reports': '/reports/sales',
			'Case Stats': '/reports/cases',
			'Invoice Trends': '/reports/invoices'
		}
	},
	{
		name: 'Settings',
		icon: 'CogOutline',
		children: {
			'User Management': '/settings/users',
			'Custom Fields': '/settings/fields',
			Integrations: '/settings/integrations'
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
                <SidebarItem label="Dashboard">
                    <svelte:fragment slot="icon">
                        <Fa icon={faPieChart} />
                    </svelte:fragment>
                </SidebarItem>
				<SidebarDropdownWrapper label="Leads">
                    <SidebarDropdownItem label="Open Leads" href="/leads/open" />
                    <SidebarDropdownItem label="Closed Leads" href="/leads/closed" />
                    <SidebarDropdownItem label="Create Lead" href="/leads/new" />
                </SidebarDropdownWrapper>
                <SidebarItem label="Tasks" href="/tasks">
                    <svelte:fragment slot="icon">
                        <Fa icon={faPieChart} />
                    </svelte:fragment>
                </SidebarItem>
			</SidebarGroup>
			<SidebarGroup ulClass={groupClass}>
				{#each links as { label, href, icon } (label)}
					<SidebarItem
						{label}
						{href}
						spanClass="ml-3"
						class={itemClass}
						target="_blank"
					>
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
