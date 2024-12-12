<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { RejectEventRegistrationSchema } from '@schema';
	import { toast } from 'svelte-french-toast';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { _ } from '@services';

	export let isOpen: boolean;
	export let id: string;
	let rejectForm: Writable<SuperValidated<Infer<RejectEventRegistrationSchema>>> = getContext('rejectForm');

	const superConfirmForm = superForm($rejectForm, {
		id,
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
			<Dialog.Title>{$_("admin-pages.events.event-registrations.reject-event-registration.title")}</Dialog.Title>
			<Dialog.Description>{$_("admin-pages.events.event-registrations.reject-event-registration.description")}</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/rejectEventRegistration"
			id="reject-event-registration-form"
			method="post"
			use:enhance
		></form>
		<Dialog.Footer>
			<Button form="reject-event-registration-form" type="submit">{$_("admin-pages.events.event-registrations.reject-event-registration.proceed")}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
