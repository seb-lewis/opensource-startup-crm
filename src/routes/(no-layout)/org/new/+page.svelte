<script>
	import '../../../../app.css';

	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';
	import { Card } from 'flowbite-svelte';
</script>

<Card>
	<form action="/org/new" method="POST">
		<div class="mb-6 grid gap-6 md:grid-cols-2">
			<div>
				<Label for="org_name" class="mb-2">Org Name</Label>
				<Input type="text" id="org_name" name="org_name" required />
			</div>
		</div>
		
		<Button type="submit">Create</Button>
	</form>
</Card>
