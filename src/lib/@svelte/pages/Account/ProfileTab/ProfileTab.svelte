<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { TrashIcon } from '$lib/@svelte/icons';
	import { Input, Spinner } from '$lib/@svelte/components';

	import * as Table from '$lib/components/ui/table';
	import {
		CreateOrgInviteRequestSchema,
		type CreateOrgInviteRequest,
		type GetOrgDetailsResponse,
		type GetOrgMembersResponse
	} from '@schema';
	import DataTable from './data-table.svelte';

	let inviteMemberDialogOpen = false;
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-french-toast';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Button } from '@/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	export let createInviteForm: SuperValidated<CreateOrgInviteRequest> | undefined;
	export let organizationMembers: GetOrgMembersResponse | undefined;

	let loading = false;
	const superform = superForm<CreateOrgInviteRequest>(createInviteForm, {
		validators: valibot(CreateOrgInviteRequestSchema),
		applyAction: true,
		dataType: 'json',
		invalidateAll: 'force',
		onSubmit() {
			console.log("Hasdas");
			loading = true;
		},
		onResult({ result }) {
			loading = false;
			if (result.type === 'success') {
				inviteMemberDialogOpen = false;
				toast.success($_('user-pages.accounts.invitationSuccess'));
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});
	const { form: formData, enhance } = superform;
</script>

<div>
	<section class="">
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.accounts.personalInformation')}
		</h2>
		<h4 class=" text-stone-500 text-sm">
			{$_('user-pages.accounts.personalInformationSubHeading')}
		</h4>
	</section>
	<pre>{JSON.stringify(organizationMembers, null, 2)}</pre>
	<DataTable memberResponse={organizationMembers} bind:inviteMemberDialogOpen />

	<Dialog.Root bind:open={inviteMemberDialogOpen}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>{$_(
					'user-pages.accounts.invite-dialog-title'
				)}</Dialog.Title>
				<Dialog.Description>
					{$_(
						'user-pages.accounts.invite-dialog-description'
					)}
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/createInvite" method="POST" id="create-invite-form" use:enhance>
				<div class=" flex flex-col gap-1">
					<Field form={superform} name="userMail">
						<Control let:attrs>
							<Label>{$_('user-pages.accounts.emailAddress')}</Label>
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

					<footer>
						<footer class=" flex justify-end items-center w-full">
							<Button class="mr-2" variant="outline" on:click={() => (inviteMemberDialogOpen = false)}
							>{$_('common.cancel')}</Button
							>
							{#if loading}
								<Button form="create-invite-form" disabled
								>
									<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />{$_('user-pages.accounts.invite')}
								</Button>
							{:else}

								<Button form="create-invite-form" type="submit"
								>{$_('user-pages.accounts.invite')}</Button
								>
							{/if}
						</footer>
					</footer>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Root>
	<!--
	{#each contacts as contact, index (contact)}
		<section class=" w-full mt-10">
			<div class=" pb-4 border-b-1 border-slate-200 flex justify-between items-center">
				<h4 class=" text-sm font-extrabold text-stone-800">
					{index + 1}. {$_('user-pages.accounts.contactPerson')}
				</h4>
				{#if contacts.length > 1}
					<button class=" m-0 text-red-500 text-xs" on:click={() => handleRemoveContact(index)}>
						<TrashIcon />
					</button>{/if}
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.fullName')}
				</div>
				<div class="col-span-3 grid grid-cols-2 gap-4">
					<Input placeholder={$_('user-pages.accounts.firstName')} />
					<Input placeholder={$_('user-pages.accounts.lastName')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts..emailAddress')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.emailAddress')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.phoneNumber')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.phoneNumber')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.department')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.department')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.areaOfResponsibility')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.areaOfResponsibility')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.responsibility')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.responsibility')} />
				</div>
			</div>
		</section>
	{/each}

	<footer>
		<div class=" flex justify-between items-center my-6 pb-6">
			<GradientButton onClick={handleAddMoreContact}
				>{$_('user-pages.accounts.addContactPerson')}</GradientButton
			>
			<div class=" flex justify-between items-center">
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">{$_('common.cancel')}</Button>
				<GradientButton onClick={() => goto('/dashboard')}>{$_('common.save')}</GradientButton>
			</div>
		</div>
	</footer>
	-->
</div>
