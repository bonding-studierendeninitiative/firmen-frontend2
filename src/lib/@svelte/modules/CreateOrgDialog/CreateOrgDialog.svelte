<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { cn } from '@/utils';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-french-toast';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { InferOutput } from 'valibot';
	import { type CreateOrgRequest, CreateOrgRequestSchema } from '@schema';
	import { CirclePlus, LoaderCircle } from 'lucide-svelte';
	import { _ } from '@services';

	export let createForm: SuperValidated<InferOutput<CreateOrgRequest>>;

	let createOrgDialogOpen = false;

	const superform = superForm(createForm, {
		validators: valibot(CreateOrgRequestSchema),
		onResult({ result }) {
			if (result.type === 'success') {
				createOrgDialogOpen = false;
				toast.success($_(`admin-pages.organizations.createOrgSuccess`));
			} else if (result.type === 'error') {
				toast.error(result.error.message);
				createOrgDialogOpen = false;
			}
		}
	});
	const { form: formData, enhance, submitting } = superform;
</script>

<Dialog.Root bind:open={createOrgDialogOpen}>
	<Dialog.Trigger class={cn(buttonVariants({variant:'outline'}))}>
		<CirclePlus class="mr-2 h-4 w-4" />
		{$_('common.create')}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{$_(`admin-pages.organizations.createOrganization`)}</Dialog.Title>
			<Dialog.Description>{$_(`admin-pages.organizations.createOrganizationDescription`)}</Dialog.Description>
		</Dialog.Header>
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
		<footer>
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
		</footer>

	</Dialog.Content>
</Dialog.Root>