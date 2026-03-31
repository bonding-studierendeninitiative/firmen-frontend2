<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { LoaderCircle } from '@lucide/svelte';
	import { _ } from '@services';
	import { createOrganizationByAdminForm } from '@/remote/functions/admin';

	let request = $state({
		name: '',
		ownerMail: ''
	});

	let pending = $state(false);

	interface Props {
		createOrgDialogOpen?: boolean;
		onOrgCreated?: () => void;
	}

	let { createOrgDialogOpen = $bindable(false), onOrgCreated }: Props = $props();
</script>

<form
	{...createOrganizationByAdminForm.enhance(async ({ submit }) => {
		try {
			pending = true;
			await submit();
			pending = false;
			createOrgDialogOpen = false;
			onOrgCreated?.();
		} catch (e) {
			console.error(e);
			toast.error(e?.body?.message);
			pending = false;
		}
	})}
	id="create-org-form"
>
	<div class="flex flex-col gap-1">
		<Label>{$_('admin-pages.organizations.name')}</Label>
		<Input
			name="name"
			bind:value={request.name}
			placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationName')}
		/>
		<Label>{$_('admin-pages.organizations.ownerMail')}</Label>
		<Input
			name="ownerMail"
			bind:value={request.ownerMail}
			placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationEmail')}
		/>
	</div>
</form>
<footer class=" flex justify-end items-center w-full">
	<Button class="mr-2" variant="outline" onclick={() => (createOrgDialogOpen = false)}
		>{$_('common.cancel')}</Button
	>
	{#if pending}
		<Button form="create-org-form" disabled>
			<LoaderCircle class="mr-2 size-4 animate-spin" />{$_('common.create')}
		</Button>
	{:else}
		<Button form="create-org-form" type="submit">{$_('common.create')}</Button>
	{/if}
</footer>
