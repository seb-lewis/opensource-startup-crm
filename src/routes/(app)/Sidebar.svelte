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

	export let drawerHidden = false;

	const closeDrawer = () => {
		drawerHidden = true;
	};

	let iconClass =
		'flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white';
	let groupClass = 'pt-2 space-y-2';

	$: mainSidebarUrl = $page.url.pathname;
	let activeMainSidebar;

	afterNavigate((navigation) => {
		// this fixes https://github.com/themesberg/flowbite-svelte/issues/364
		document.getElementById('svelte')?.scrollTo({ top: 0 });
		closeDrawer();

		activeMainSidebar = navigation.to?.url.pathname ?? '';
	});

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
					class={`${mainSidebarUrl === '/app' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
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
						class={`${mainSidebarUrl === '/app/leads/open' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="Create Lead"
						href="/app/leads/new"
						class={`${mainSidebarUrl === '/app/leads/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
				</SidebarDropdownWrapper>

				<SidebarDropdownWrapper label="Accounts">
					<SidebarDropdownItem
						label="All Accounts"
						href="/app/accounts"
						class={`${mainSidebarUrl === '/app/accounts' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="New Account"
						href="/app/accounts/new"
						class={`${mainSidebarUrl === '/app/accounts/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="Account Opportunities"
						href="/app/accounts/opportunities"
						class={`${mainSidebarUrl === '/app/accounts/opportunities' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
				</SidebarDropdownWrapper>
				<SidebarDropdownWrapper label="Cases">
					<SidebarDropdownItem
						label="All Cases"
						href="/app/cases"
						class={`${mainSidebarUrl === '/app/cases' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="New Case"
						href="/app/cases/new"
						class={`${mainSidebarUrl === '/app/cases/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
				</SidebarDropdownWrapper>

				<SidebarDropdownWrapper label="Tasks">
					<SidebarDropdownItem
						label="Boards"
						href="/app/tasks"
						class={`${mainSidebarUrl === '/app/tasks' ? 'bg-blue-100 font-semibold dark:bg-blue-700' : ''}`}
					/>
					<SidebarDropdownItem
						label="Calendar"
						href="/app/tasks/calendar"
						class={`${mainSidebarUrl === '/app/tasks/calendar' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					/>
				</SidebarDropdownWrapper>
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
