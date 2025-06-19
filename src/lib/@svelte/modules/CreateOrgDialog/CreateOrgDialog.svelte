<script lang="ts">
	import { buttonVariants } from '@/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '@/utils';
	import { CirclePlus } from '@lucide/svelte';
	import { _ } from '@services';
	import CreateOrgForm from '@/@svelte/modules/CreateOrgDialog/CreateOrgForm.svelte';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';

	const api = trpc(page)

	const createForm = api.admin.orgs.createForm.createQuery();

	let createOrgDialogOpen = $state(false);
</script>

<Dialog.Root bind:open={createOrgDialogOpen}>
	<Dialog.Trigger class={cn(buttonVariants({variant:'outline'}))}>
		<CirclePlus class="mr-2 size-4" />
		{$_('common.create')}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{$_(`admin-pages.organizations.createOrganization`)}</Dialog.Title>
			<Dialog.Description>{$_(`admin-pages.organizations.createOrganizationDescription`)}</Dialog.Description>
		</Dialog.Header>
		{#if $createForm.data}
			<CreateOrgForm createForm={$createForm.data} bind:createOrgDialogOpen />
			{/if}
	</Dialog.Content>
</Dialog.Root>