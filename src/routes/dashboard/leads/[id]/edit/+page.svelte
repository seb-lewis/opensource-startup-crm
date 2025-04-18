<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	// import { getLead, updateLead } from '$lib/api';
	import type { Lead } from '$lib/types';

	let lead: Lead | null = null;
	let error: string | null = null;

	// onMount(async () => {
	// 	const id = $page.params.id;
	// 	try {
	// 		lead = await getLead(id);
	// 	} catch (err) {
	// 		error = 'Failed to load lead details';
	// 	}
	// });

	// async function handleSubmit(event: Event) {
	// 	event.preventDefault();
	// 	if (lead) {
	// 		try {
	// 			await updateLead(lead);
	// 			// Redirect or show success message
	// 		} catch (err) {
	// 			error = 'Failed to update lead';
	// 		}
	// 	}
	// }
</script>

<svelte:head>
	<title>Edit Lead | CRM</title>
</svelte:head>

<div class="container mx-auto p-4 md:p-8">
	<h1 class="text-2xl font-semibold mb-6">Edit Lead</h1>

	{#if lead}
		<form method="POST" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" on:submit={handleSubmit}>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="company"> Company </label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="company"
						type="text"
						placeholder="Company"
						name="company"
						bind:value={lead.company}
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="contact_person">
						Contact Person
					</label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="contact_person"
						type="text"
						placeholder="Contact Person"
						name="contact_person"
						bind:value={lead.contact_person}
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="email"> Email </label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="email"
						type="email"
						placeholder="Email"
						name="email"
						bind:value={lead.email}
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="phone"> Phone </label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="phone"
						type="text"
						placeholder="Phone"
						name="phone"
						bind:value={lead.phone}
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="website"> Website </label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="website"
						type="text"
						placeholder="Website"
						name="website"
						bind:value={lead.website}
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="confidence">
						Confidence
					</label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="confidence"
						type="number"
						placeholder="Confidence"
						name="confidence"
						bind:value={lead.confidence}
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="estimated_value">
						Estimated Value
					</label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="estimated_value"
						type="number"
						placeholder="Estimated Value"
						name="estimated_value"
						bind:value={lead.estimated_value}
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="status"> Status </label>
					<select
						class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="status"
						name="status"
						bind:value={lead.status}
					>
						<option value="new">New</option>
						<option value="contacted">Contacted</option>
						<option value="inprogress">In Progress</option>
						<option value="lost">Lost</option>
						<option value="won">Won</option>
					</select>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="priority">
						Priority
					</label>
					<select
						class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="priority"
						name="priority"
						bind:value={lead.priority}
					>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>
			</div>

			<div class="flex items-center justify-between mt-6">
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				>
					Save Changes
				</button>
				<a
					href="/dashboard/leads/{lead.id}"
					class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
				>
					Cancel
				</a>
			</div>
		</form>
	{:else}
		<p>Loading lead details...</p>
		<!-- You might want to add a loading spinner or skeleton screen here -->
	{/if}
</div>