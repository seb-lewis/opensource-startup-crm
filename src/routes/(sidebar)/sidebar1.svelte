<script>
	import '../../app.css';
	import imgLogo from '$lib/assets/images/logo.png';
  import Fa from 'svelte-fa';
  import { 
    faUser, faArrowRightFromBracket, faBookOpen, 
    faLayerGroup, faListCheck, faBuildingColumns, faLocationDot, 
	faCog,

	faPieChart


  } from '@fortawesome/free-solid-svg-icons';
	import {
		Sidebar,
		SidebarDropdownWrapper,
		SidebarDropdownItem,
		SidebarWrapper,
		SidebarBrand,
		SidebarItem,
		SidebarGroup
	} from 'flowbite-svelte';
	import {
		ChartPieSolid,
		GridSolid,
		MailBoxSolid,
		UserSolid,
		ArrowRightToBracketOutline,
		EditOutline
	} from 'flowbite-svelte-icons';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';

	let site = {
		name: 'Bottle CRM',
		href: '/',
		img: imgLogo
	};
</script>

<div class="w-full bg-white">
	<!-- Sidebar -->
	<aside
		class="sidebar fixed left-0 h-screen w-64 overflow-x-hidden overflow-y-auto border-r px-2 py-4 text-neutral-500"
	>
		<Sidebar>
			<SidebarWrapper>
				<SidebarGroup>
					<SidebarBrand {site} />

					<SidebarItem label="Dashboard">
						<svelte:fragment slot="icon">
							<Fa icon={faPieChart} />
						</svelte:fragment>
					</SidebarItem>

					<!-- Leads -->
					<SidebarDropdownWrapper label="Leads">
						<SidebarDropdownItem label="All Leads" href="/leads" />
						<SidebarDropdownItem label="Create Lead" href="/leads/new" />
					</SidebarDropdownWrapper>

					<!-- Companies -->
					<SidebarDropdownWrapper label="Companies">
						<SidebarDropdownItem label="All Companies" href="/companies" />
						<SidebarDropdownItem label="Create Company" href="/companies/new" />

						<!-- Nested: Accounts under Companies -->
						<SidebarDropdownWrapper label="Accounts">
							<SidebarDropdownItem label="All Accounts" href="/accounts" />
							<SidebarDropdownItem label="Create Account" href="/accounts/new" />
						</SidebarDropdownWrapper>

						<!-- Nested: Contacts under Accounts -->
						<SidebarDropdownWrapper label="Contacts">
							<SidebarDropdownItem label="All Contacts" href="/contacts" />
							<SidebarDropdownItem label="Create Contact" href="/contacts/new" />
						</SidebarDropdownWrapper>

						<!-- Nested: Opportunities -->
						<SidebarDropdownWrapper label="Opportunities">
							<SidebarDropdownItem label="All Opportunities" href="/opportunities" />
							<SidebarDropdownItem label="Create Opportunity" href="/opportunities/new" />
						</SidebarDropdownWrapper>

						<!-- Nested: Cases -->
						<SidebarDropdownWrapper label="Cases">
							<SidebarDropdownItem label="All Cases" href="/cases" />
							<SidebarDropdownItem label="Create Case" href="/cases/new" />
						</SidebarDropdownWrapper>

						<!-- Nested: Tasks -->
						<SidebarDropdownWrapper label="Tasks">
							<SidebarDropdownItem label="All Tasks" href="/tasks" />
							<SidebarDropdownItem label="Create Task" href="/tasks/new" />
						</SidebarDropdownWrapper>
					</SidebarDropdownWrapper>

					<!-- Users -->
					<SidebarDropdownWrapper label="Users">
						<SidebarDropdownItem label="All Users" href="/users" />
						<SidebarDropdownItem label="Create User" href="/users/new" />
					</SidebarDropdownWrapper>

					<!-- Auth links -->
					<SidebarItem label="Settings" href="/settings">
						<svelte:fragment slot="icon">
              <Fa icon={faCog} />
							
						</svelte:fragment>
					</SidebarItem>

					<SidebarItem label="Logout" href="/logout">
						<svelte:fragment slot="icon">
                <Fa icon={faArrowRightFromBracket} />
						</svelte:fragment>
					</SidebarItem>
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</aside>
	<main class="mx-auto ml-64 p-4">
		<slot />
	</main>
</div>
