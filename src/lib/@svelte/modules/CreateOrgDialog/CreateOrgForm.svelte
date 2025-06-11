<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { InferOutput } from 'valibot';
	import { type CreateOrgRequest, CreateOrgRequestSchema } from '@schema';
	import { LoaderCircle } from 'lucide-svelte';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let createForm: SuperValidated<InferOutput<CreateOrgRequest>>;
	const api = trpc($page)
	const utils = api.createUtils();

	export let createOrgDialogOpen = false;

	const superform = superForm(createForm, {
		validators: valibot(CreateOrgRequestSchema),
		onResult({ result }) {
			if (result.type === 'success') {
				createOrgDialogOpen = false;
				toast.success($_(`admin-pages.organizations.createOrgSuccess`));
				utils.admin.orgs.list.invalidate();
				utils.admin.orgs.createForm.invalidate();
			} else if (result.type === 'error') {
				toast.error(result.error.message);
				createOrgDialogOpen = false;
			}
		}
	});
	const { form: formData, enhance, submitting } = superform;
</script>

<form action="?/createOrg" method="post" id="create-org-form" use:enhance>
	<div class="flex flex-col gap-1">
		<Field form={superform} name="name">
			<Control let:attrs>
				<Label>{$_('admin-pages.organizations.name')}</Label>
				<Input
					{...attrs}
					bind:value={$formData.name}
					placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationName'
								)}
				/>
			</Control>

			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="ownerMail">
			<Control let:attrs>
				<Label>{$_('admin-pages.organizations.ownerMail')}</Label>
				<Input
					{...attrs}
					bind:value={$formData.ownerMail}
					placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationEmail'
								)}
				/>
			</Control>

			<Description />
			<FieldErrors />
		</Field>
	</div>
</form>
<footer class=" flex justify-end items-center w-full">
	<Button
		class="mr-2"
		variant="outline"
		on:click={() => (createOrgDialogOpen = false)}>{$_('common.cancel')}</Button
	>
	{#if $submitting}
		<Button form="create-org-form" disabled>
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />{$_(
			'common.create'
		)}
		</Button>
	{:else}
		<Button form="create-org-form" type="submit"
		>{$_('common.create')}</Button
		>
	{/if}
</footer>