<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { PieChart, HelpCircle, ChevronDown } from '@lucide/svelte';

	let { drawerHidden = $bindable(false) } = $props();

	const closeDrawer = () => {
		drawerHidden = true;
	};

	let iconClass = 'w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white';

	let mainSidebarUrl = $derived($page.url.pathname);
	let activeMainSidebar;
	let openDropdowns = $state({});

	const toggleDropdown = (key) => {
		openDropdowns[key] = !openDropdowns[key];
	};

	afterNavigate((navigation) => {
		document.getElementById('svelte')?.scrollTo({ top: 0 });
		closeDrawer();
		activeMainSidebar = navigation.to?.url.pathname ?? '';
	});
</script>

<aside
	class={`fixed inset-0 z-30 flex-none h-full w-64 lg:h-auto border-e border-gray-200 dark:border-gray-600 lg:overflow-y-visible lg:pt-15 lg:block ${drawerHidden ? 'hidden' : ''}`}
>
	<div class="overflow-y-auto px-3 pt-20 lg:pt-5 h-full bg-white scrolling-touch max-w-2xs lg:h-[calc(100vh-4rem)] lg:block dark:bg-gray-800 lg:me-0 lg:sticky top-2">
		<nav class="divide-y divide-gray-200 dark:divide-gray-700">
			<ul class="pt-2 space-y-2 mb-3">
				<li>
					<a
						href="/app"
						class={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${mainSidebarUrl === '/app' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					>
						<PieChart class={`${iconClass} ${mainSidebarUrl === '/app' ? 'text-gray-900 dark:text-white' : ''}`} />
						<span class="ml-3">Dashboard</span>
					</a>
				</li>
				
				<li>
					<button
						type="button"
						class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
						onclick={() => toggleDropdown('leads')}
					>
						<span class="flex-1 ml-3 text-left whitespace-nowrap">Leads</span>
						<ChevronDown class={`w-3 h-3 transition-transform ${openDropdowns.leads ? 'rotate-180' : ''}`} />
					</button>
					{#if openDropdowns.leads}
						<ul class="py-2 space-y-2">
							<li>
								<a
									href="/app/leads/open"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/leads/open' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									Open Leads
								</a>
							</li>
							<li>
								<a
									href="/app/leads/new"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/leads/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									Create Lead
								</a>
							</li>
						</ul>
					{/if}
				</li>

				<li>
					<button
						type="button"
						class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
						onclick={() => toggleDropdown('accounts')}
					>
						<span class="flex-1 ml-3 text-left whitespace-nowrap">Accounts</span>
						<ChevronDown class={`w-3 h-3 transition-transform ${openDropdowns.accounts ? 'rotate-180' : ''}`} />
					</button>
					{#if openDropdowns.accounts}
						<ul class="py-2 space-y-2">
							<li>
								<a
									href="/app/accounts"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/accounts' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									All Accounts
								</a>
							</li>
							<li>
								<a
									href="/app/accounts/new"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/accounts/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									New Account
								</a>
							</li>
							<li>
								<a
									href="/app/accounts/opportunities"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/accounts/opportunities' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									Account Opportunities
								</a>
							</li>
						</ul>
					{/if}
				</li>

				<li>
					<button
						type="button"
						class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
						onclick={() => toggleDropdown('cases')}
					>
						<span class="flex-1 ml-3 text-left whitespace-nowrap">Cases</span>
						<ChevronDown class={`w-3 h-3 transition-transform ${openDropdowns.cases ? 'rotate-180' : ''}`} />
					</button>
					{#if openDropdowns.cases}
						<ul class="py-2 space-y-2">
							<li>
								<a
									href="/app/cases"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/cases' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									All Cases
								</a>
							</li>
							<li>
								<a
									href="/app/cases/new"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/cases/new' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									New Case
								</a>
							</li>
						</ul>
					{/if}
				</li>

				<li>
					<button
						type="button"
						class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
						onclick={() => toggleDropdown('tasks')}
					>
						<span class="flex-1 ml-3 text-left whitespace-nowrap">Tasks</span>
						<ChevronDown class={`w-3 h-3 transition-transform ${openDropdowns.tasks ? 'rotate-180' : ''}`} />
					</button>
					{#if openDropdowns.tasks}
						<ul class="py-2 space-y-2">
							<li>
								<a
									href="/app/tasks/list"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/tasks/list' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									List
								</a>
							</li>
							<li>
								<a
									href="/app/tasks/calendar"
									class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${mainSidebarUrl === '/app/tasks/calendar' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
								>
									Calendar
								</a>
							</li>
						</ul>
					{/if}
				</li>

				<li>
					<a
						href="/app/support"
						class={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${mainSidebarUrl === '/app/support' ? 'bg-gray-100 font-semibold dark:bg-gray-700' : ''}`}
					>
						<HelpCircle class={`${iconClass} ${mainSidebarUrl === '/app/support' ? 'text-gray-900 dark:text-white' : ''}`} />
						<span class="ml-3">Support</span>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</aside>

<div
	hidden={drawerHidden}
	class="fixed inset-0 z-20 bg-gray-900/50 dark:bg-gray-900/60"
	onclick={closeDrawer}
	onkeydown={closeDrawer}
	role="presentation"
></div>
