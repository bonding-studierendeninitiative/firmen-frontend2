<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type {
		ConfirmEventRegistrationSchema,
		EventRegistration as EventRegistrationSchema
	} from '@schema';
	import { toast } from 'svelte-french-toast';
	import type { InferOutput } from 'valibot';
	import { EventRegistration } from '@/@svelte/modules';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { _ } from '@services';

	export let isOpen: boolean;
	export let id: string;
	let confirmForm: Writable<SuperValidated<Infer<ConfirmEventRegistrationSchema>>> = getContext('confirmForm');
	export let eventRegistration: InferOutput<EventRegistrationSchema>;


	const superConfirmForm = superForm($confirmForm, {
		onSubmit({ formData }) {
			formData.set('eventRegistrationId', id);
		},
		onResult({ result }) {
			if (result.type === 'success') {
				isOpen = false;
				toast.success('Event registration confirmed successfully');
			} else {
				toast.error(`Error: ${result.status}`);
			}
		}
	});
	const { enhance } = superConfirmForm;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<form action="?/confirmEventRegistration" method="post" use:enhance>
			<Dialog.Header>
				<Dialog.Title>{$_("admin-pages.events.event-registrations.confirm-event-registration.title")}</Dialog.Title>
				<Dialog.Description>{$_("admin-pages.events.event-registrations.confirm-event-registration.title")}</Dialog.Description>
			</Dialog.Header>
			<EventRegistration {eventRegistration} />

			<Dialog.Footer>
				<Button type="submit">{$_("admin-pages.events.event-registrations.confirm-event-registration.proceed")}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
