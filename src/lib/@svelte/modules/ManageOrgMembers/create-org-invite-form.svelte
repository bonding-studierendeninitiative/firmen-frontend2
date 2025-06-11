<script lang="ts">
	import { _ } from '@services';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Button } from '@/components/ui/button';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Input } from '@/@svelte/components';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type CreateOrgInviteRequest, CreateOrgInviteRequestSchema } from '@schema';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import type { InferOutput } from 'valibot';

	export let inviteMemberDialogOpen = false;

	export let createInviteForm: SuperValidated<InferOutput<CreateOrgInviteRequest>>;

	let superform = superForm(createInviteForm, {
		validators: valibot(CreateOrgInviteRequestSchema),
		applyAction: true,
		dataType: 'json',
		invalidateAll: 'force',
		onResult({ result }) {
			if (result.type === 'success') {
				inviteMemberDialogOpen = false;
				toast.success($_('modules.manage-org-members.invitationSuccess'));
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});
	let { form: formData, enhance, submitting } = superform;
</script>

<form action="?/createInvite" method="POST" use:enhance>
	<div class=" flex flex-col gap-1">
		<Field form={superform} name="userMail">
			<Control let:attrs>
				<Label>{$_('admin-pages.organizations.organizationEmail')}</Label>
				<Input
					{...attrs}
					bind:value={$formData.userMail}
					placeholder={$_(
						'user-pages.organizations.createOrganization.placeholders.organizationEmail'
					)}
				/>
			</Control>

			<Description />
			<FieldErrors />
		</Field>

		<footer class=" flex justify-end items-center w-full">
			<Button class="mr-2" variant="outline" on:click={() => (inviteMemberDialogOpen = false)}
				>{$_('common.cancel')}</Button
			>
			{#if $submitting}
				<Button disabled>
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />{$_(
						'modules.manage-org-members.invite'
					)}
				</Button>
			{:else}
				<Button type="submit"
					>{$_('modules.manage-org-members.invite')}</Button
				>
			{/if}
		</footer>
	</div>
</form>
