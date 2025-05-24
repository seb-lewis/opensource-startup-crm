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
	import { faPen, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
// Get logged-in user id from data (must be provided by server load)
let loggedInUserId = data.user?.id;
let users = Array.isArray(data.users)
    ? data.users.map((u) => ({
            id: u.user.id,
            name: u.user.name || u.user.email,
            email: u.user.email,
            role: u.role,
            joined: u.joinedAt
                ? typeof u.joinedAt === 'string'
                    ? u.joinedAt.slice(0, 10)
                    : new Date(u.joinedAt).toISOString().slice(0, 10)
                : '',
            avatar: u.user.profilePhoto || '',
            isSelf: loggedInUserId === u.user.id,
            editingRole: false
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
   <!-- Logout Icon Top Right -->
    <div class="absolute top-4 right-4 z-10">
        <a href="/logout" title="Logout" class="text-gray-500 hover:text-red-600 transition">
            <Fa icon={faSignOutAlt} class="w-6 h-6" /> Logout
        </a>
    </div>
	<!-- Organization Details -->
	<div
		class="relative mb-8 flex flex-col items-center gap-6 rounded-lg bg-white p-6 shadow sm:flex-row"
	>
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
			<form method="POST" action="?/update" class="w-full space-y-4">
				<div>
					<label for="org-name" class="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
					<div class="flex items-center gap-2">
						<Fa icon={faBuilding} class="h-5 w-5 text-gray-400" />
						<input
							id="org-name"
							name="name"
							type="text"
							bind:value={formOrg.name}
							required
							class="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
						/>
					</div>
				</div>

				<div>
					<label for="org-domain" class="block text-sm font-medium text-gray-700 mb-1">Domain</label>
					<div class="flex items-center gap-2">
						<Fa icon={faGlobe} class="h-5 w-5 text-gray-400" />
						<input
							id="org-domain"
							name="domain"
							type="text"
							bind:value={formOrg.domain}
							placeholder="yourcompany.com"
							class="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
						/>
					</div>
				</div>
				
				

				<div>
					<label for="org-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
					<textarea
						id="org-description"
						name="description"
						rows="3"
						bind:value={formOrg.description}
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
						placeholder="Describe your organization"
					></textarea>
				</div>

				<div class="mt-6 flex justify-end gap-3">
					<button
						type="button"
						class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						on:click={cancelEdit}>Cancel</button
					>
					<button type="submit" class="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>Save Changes</button
					>
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
					<p class="mt-3 whitespace-pre-line text-gray-600">{org.description}</p>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Users Table -->
<div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
        <Fa icon={faUsers} class="h-5 w-5 text-blue-500" /> Users
    </h2>
    <!-- Add User Form -->
    <form method="POST" action="?/add_user" class="mb-4 flex flex-wrap items-end gap-2 bg-gray-50 p-3 rounded">
        <div>
            <label for="add-user-email" class="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input id="add-user-email" name="email" type="email" required class="border rounded px-2 py-1 text-sm" placeholder="user@email.com" />
        </div>
        <div>
            <label for="add-user-role" class="block text-xs font-semibold text-gray-600 mb-1">Role</label>
            <select id="add-user-role" name="role" class="border rounded px-2 py-1 text-sm w-full min-w-[120px]">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
            </select>
        </div>
        <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">Add User</button>
    </form>
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th class="px-4 py-2"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                {#each users as user, i}
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
                            {#if user.isSelf}
                                <span class="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-400" title="You cannot edit your own role">
                                    <Fa icon={roleIcons[user.role] || faUser} class="h-3.5 w-3.5" />
                                    {user.role}
                                </span>
                            {:else}
                                {#if user.editingRole}
                                    <form method="POST" action="?/edit_role" class="flex items-center gap-1">
                                        <input type="hidden" name="user_id" value={user.id} />
                                        <select name="role" class="border rounded px-1 py-0.5 text-xs">
                                            <option value="USER" selected={user.role === 'USER'}>User</option>
                                            <option value="ADMIN" selected={user.role === 'ADMIN'}>Admin</option>
                                            <option value="SALES_REP" selected={user.role === 'SALES_REP'}>Sales Rep</option>
                                            <option value="SUPPORT_REP" selected={user.role === 'SUPPORT_REP'}>Support Rep</option>
                                            <option value="READ_ONLY" selected={user.role === 'READ_ONLY'}>Read Only</option>
                                        </select>
                                        <button type="submit" class="text-blue-600 text-xs px-2 py-0.5 rounded hover:bg-blue-50">Save</button>
                                        <button type="button" class="text-gray-400 text-xs px-2 py-0.5 rounded hover:bg-gray-100" on:click={() => { users[i].editingRole = false }}>Cancel</button>
                                    </form>
                                {:else}
                                    <span class="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                        <Fa icon={roleIcons[user.role] || faUser} class="h-3.5 w-3.5" />
                                        {user.role}
                                        <button type="button" class="ml-1 text-gray-400 hover:text-blue-600" title="Edit Role" on:click={() => { users[i].editingRole = true }}>
                                            <Fa icon={faPen} class="h-3 w-3" />
                                        </button>
                                    </span>
                                {/if}
                            {/if}
                        </td>
                        <td class="px-4 py-3 text-gray-500">{user.joined}</td>
                        <td class="px-4 py-3">
                            {#if user.isSelf}
                                <span class="text-gray-300 text-xs px-2 py-1 rounded cursor-not-allowed">Remove</span>
                            {:else}
                                <form method="POST" action="?/remove_user" on:submit={() => confirm('Remove this user from organization?') || event.preventDefault()}>
                                    <input type="hidden" name="user_id" value={user.id} />
                                    <button type="submit" class="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded">Remove</button>
                                </form>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
</div>
