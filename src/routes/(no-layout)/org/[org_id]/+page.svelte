<script>
	import '../../../../app.css';
	import { Fa } from 'svelte-fa';
	import {
		faBuilding,
		faGlobe,
		faUsers,
		faUser,
		faUserShield,
		faUserTie
	} from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
export let data;
let org = data.organization;
let editing = false;
let formOrg = { name: org.name, domain: org.domain || '', description: org.description || '' };
function startEdit() {
    formOrg = { name: org.name, domain: org.domain || '', description: org.description || '' };
    editing = true;
}
function cancelEdit() {
    editing = false;
}
let users = Array.isArray(data.users)
    ? data.users.map(u => ({
        id: u.user.id,
        name: u.user.name || u.user.email,
        email: u.user.email,
        role: u.role,
        joined: u.joinedAt ? (typeof u.joinedAt === 'string' ? u.joinedAt.slice(0, 10) : new Date(u.joinedAt).toISOString().slice(0, 10)) : '',
        avatar: u.user.profilePhoto || ''
    }))
    : [];

	// Map roles to icons (cover all UserRole enum values)
const roleIcons = {
    ADMIN: faUserShield,
    USER: faUser,
    SALES_REP: faUserTie,
    SUPPORT_REP: faUser,
    READ_ONLY: faUser
};
</script>


<div class="mx-auto max-w-5xl p-6">
   <!-- Organization Details -->
   <div class="mb-8 flex flex-col items-center gap-6 rounded-lg bg-white p-6 shadow sm:flex-row relative">
       <button
           type="button"
           class="absolute top-4 right-4 text-gray-400 hover:text-blue-600"
           on:click={startEdit}
           aria-label="Edit"
           style:display={editing ? 'none' : 'inline-block'}
       >
           <Fa icon={faPen} class="h-5 w-5" />
       </button>
       {#if editing}
           <form method="POST" action="?/update" class="w-full">
               <h1 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
                   <Fa icon={faBuilding} class="h-6 w-6 text-blue-500" />
                   <input name="name" type="text" bind:value={formOrg.name} required class="font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-auto min-w-[120px]" />
               </h1>
               <div class="mt-2 flex flex-wrap gap-4 text-gray-500">
                   <span class="flex items-center gap-1">
                       <Fa icon={faGlobe} class="h-4 w-4" />
                       <input name="domain" type="text" bind:value={formOrg.domain} placeholder="Domain" class="text-blue-600 bg-transparent border-b border-gray-200 focus:outline-none focus:border-blue-500 w-auto min-w-[100px]" />
                   </span>
                   <span class="flex items-center gap-1">
                       <Fa icon={faUsers} class="h-4 w-4" />
                       {org.industry}
                   </span>
               </div>
               <textarea name="description" rows="2" bind:value={formOrg.description} class="mt-3 text-gray-600 bg-transparent border-b border-gray-200 focus:outline-none focus:border-blue-500 w-full resize-none" placeholder="Description"></textarea>
               <div class="mt-4 flex gap-2">
                   <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                   <button type="button" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" on:click={cancelEdit}>Cancel</button>
               </div>
           </form>
       {:else}
           <div class="w-full">
               <h1 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
                   <Fa icon={faBuilding} class="h-6 w-6 text-blue-500" />
                   <span>{org.name}</span>
               </h1>
               <div class="mt-2 flex flex-wrap gap-4 text-gray-500">
                   <span class="flex items-center gap-1">
                       <Fa icon={faGlobe} class="h-4 w-4" />
                       <span class="text-blue-600">{org.domain || '—'}</span>
                   </span>
                   <span class="flex items-center gap-1">
                       <Fa icon={faUsers} class="h-4 w-4" />
                       {org.industry}
                   </span>
               </div>
               {#if org.description}
                   <p class="mt-3 text-gray-600 whitespace-pre-line">{org.description}</p>
               {/if}
           </div>
       {/if}
   </div>

	<!-- Users Table -->
	<div class="rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
			<Fa icon={faUsers} class="h-5 w-5 text-blue-500" /> Users
		</h2>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead>
					<tr>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each users as user}
						<tr>
							<td class="px-4 py-3 whitespace-nowrap">
								<div class="flex items-center gap-2">
									{#if user.avatar}
										<img
											src={user.avatar}
											alt={user.name}
											class="h-8 w-8 rounded-full bg-gray-100 object-cover"
										/>
									{:else}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-400"
										>
											<Fa icon={faUser} class="h-4 w-4" />
										</div>
									{/if}
									<span class="font-medium text-gray-800">{user.name}</span>
								</div>
							</td>
							<td class="px-4 py-3 text-gray-600">{user.email}</td>
							<td class="px-4 py-3">
								<span
									class="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800"
								>
									<Fa icon={roleIcons[user.role] || faUser} class="h-3.5 w-3.5" />
									{user.role}
								</span>
							</td>
							<td class="px-4 py-3 text-gray-500">{user.joined}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
