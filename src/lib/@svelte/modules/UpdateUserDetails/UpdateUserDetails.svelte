<script lang="ts">
	import { _ } from '@services/i18n';
	import { Button } from '@/components/ui/button';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { PhoneInput } from '@/@svelte/components/PhoneInput';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { type UpdateUserDetails, UpdateUserDetailsRequest } from '@schema';
	import authClient from '@/auth-client';
	import { goto } from '$app/navigation';
	import { updateMetadataForm } from '@/remote/functions';

	const { position, title, phone } = updateMetadataForm.fields;
	interface Props {
		onUserDetailsUpdate?: () => Promise<void>;
	}

	let {
		onUserDetailsUpdate
	}: Props = $props()
</script>

<form
	class="my-4"
	{...updateMetadataForm.enhance(async ({ submit }) => {
		try {
			await submit();
			toast.success($_('user-pages.contactPersons.signUp.successCreated'));
			if (onUserDetailsUpdate) {
				await onUserDetailsUpdate();
			}
		} catch (e) {
			console.error(e);
			toast.error(e?.body?.message);
		}
	})}
>
	<div class=" flex flex-col gap-4">
		<Label>{$_('user-pages.contactPersons.signUp.labels.title')}</Label>
		<Input
			{...title.as('text')}
			placeholder={$_('user-pages.contactPersons.signUp.placeholders.title')}
			disabled={updateMetadataForm.pending > 0}

		/>
		{#each title.issues() ?? [] as issue}
			<div class="text-red-500 text-sm">{issue.message}</div>
		{/each}

		<Label>{$_('user-pages.contactPersons.signUp.labels.responsibility')}</Label>
		<Input
			{...position.as('text')}
			placeholder={$_('user-pages.contactPersons.signUp.placeholders.responsibility')}
			disabled={updateMetadataForm.pending > 0}

		/>
		{#each position.issues() ?? [] as issue}
			<div class="text-red-500 text-sm">{issue.message}</div>
		{/each}

		<Label>{$_('user-pages.contactPersons.signUp.labels.phoneNumber')}</Label>
		<PhoneInput
			searchPlaceholder={$_('user-pages.contactPersons.signUp.placeholders.phoneCountryCodeSearch')}
			{...phone.as('text')}
			disabled={updateMetadataForm.pending > 0}

		/>
		{#each phone.issues() ?? [] as issue}
			<div class="text-red-500 text-sm">{issue.message}</div>
		{/each}
	</div>

	<footer class=" flex justify-end items-center w-full mt-5">
			<Button
					variant="secondary"
					class="mr-2"
					onclick={async () =>
						await authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									goto('/login'); // redirect to login page
								}
							}
						})}>{$_('common.cancel')}</Button
				>
				<Button type="submit" disabled={updateMetadataForm.pending > 0}>{$_('common.continue')}</Button>
	</footer>

</form>