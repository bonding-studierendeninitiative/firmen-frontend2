<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { ConfirmEventRegistrationSchema, RejectEventRegistrationSchema } from '@schema';
	import { toast } from 'svelte-french-toast';

	export let isOpen: boolean;
	export let id: string;
	export let rejectForm: SuperValidated<Infer<RejectEventRegistrationSchema>>;

	const superConfirmForm = superForm(rejectForm, {
		onSubmit({ formData }) {
			formData.set('eventRegistrationId', id);
		},
		onResult({ result }) {
			if (result.type === 'success') {
				isOpen = false;
				toast.success('Event registration rejected successfully');
			} else {
				toast.error(`Error: ${result.status}`);
			}
		}
	});
	const { enhance } = superConfirmForm;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Reject event registration</Dialog.Title>
			<Dialog.Description>Do you want to reject this Event Registration?</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/rejectEventRegistration"
			id="reject-event-registration-form"
			method="post"
			use:enhance
		></form>
		<Dialog.Footer>
			<Button form="reject-event-registration-form" type="submit">Reject registration</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
