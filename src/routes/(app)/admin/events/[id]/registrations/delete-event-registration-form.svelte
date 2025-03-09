<script lang="ts">

	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { DeleteEventRegistrationSchema } from '@schema';
	import type { Writable } from 'svelte/store';
	import { toast } from 'svelte-french-toast';

	export let open = false;

	export let deleteForm: Writable<SuperValidated<Infer<DeleteEventRegistrationSchema>>>;
	export let eventRegistrationId: string;

	let superform = superForm($deleteForm, {
		onResult: ({result}) => {
			if (result.type === 'success') {
				open = false;
				toast.success('Event registration deleted');
			} else {
				toast.error('Error deleting event registration');
			}
		}
	});

	let { form, enhance } = superform;

</script>

<Dialog.Root bind:open>

	<Dialog.Content>
		<Dialog.Title>Delete Event Registration</Dialog.Title>
		<p>Are you sure you want to delete this event registration?</p>
		<Dialog.Footer>
			<form method="post" action="?/deleteEventRegistration" use:enhance>
				<input type="hidden" name="eventRegistrationId" value={eventRegistrationId} />
				<Button type="submit" variant="destructive">Delete</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>