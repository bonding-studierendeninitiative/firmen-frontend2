<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import OrganizationLogo from './OrganizationLogo.svelte';
	import authClient from '@/auth-client';
	import { useId } from 'bits-ui';

	interface Props {
		className?: string;
		classNames?: any;
		localization?: any;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		open = $bindable(false),
		onOpenChange = () => {}
	}: Props = $props();

	let name = $state('');
	let slug = $state('');
	let logo: string | null = $state(null);
	let uploadingLogo = false;
	let isSubmitting = $state(false);
	let error: string | null = $state(null);
	let fileInput: HTMLInputElement | null = $state(null);
	let orgNameId = useId();
	let orgSlugId = useId();

	function validateSlug(slug: string) {
		return /^[a-z0-9-]+$/.test(slug);
	}

	function handleLogoChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				logo = e.target?.result as string;
			};
			reader.readAsDataURL(files[0]);
		}
	}

	function deleteLogo() {
		logo = null;
		if (fileInput) fileInput.value = '';
	}

	async function handleSubmit() {
		isSubmitting = true;
		error = null;
		if (!name) {
			error = localization?.ORGANIZATION_NAME_REQUIRED ?? 'Name is required';
			isSubmitting = false;
			return;
		}
		if (!slug || !validateSlug(slug)) {
			error = localization?.ORGANIZATION_SLUG_INVALID ?? 'Invalid slug';
			isSubmitting = false;
			return;
		}

		await authClient.organization.create({
			name,
			slug
		});
		isSubmitting = false;
		name = '';
		slug = '';
		logo = null;
		onOpenChange(false);
	}
</script>

<Dialog bind:open {onOpenChange}>
    <DialogContent class={`max-w-md !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 ${className} ${classNames?.dialog?.content ?? ''}`}>
		<DialogHeader class={classNames?.dialog?.header}>
			<DialogTitle class={classNames?.title}>
				{localization?.CREATE_ORGANIZATION ?? 'Create Organization'}
			</DialogTitle>
		</DialogHeader>

		<form onsubmit={preventDefault(handleSubmit)} class="space-y-6">
			{#if error}
				<div class="text-red-500 text-sm">{error}</div>
			{/if}

			<!-- Logo upload -->
			<div class="flex items-center gap-4">
				<input
					type="file"
					accept="image/*"
					bind:this={fileInput}
					onchange={handleLogoChange}
					hidden
				/>
				<Button
					type="button"
					variant="outline"
					onclick={() => fileInput?.click()}
					disabled={uploadingLogo}
				>
					{localization?.UPLOAD_LOGO ?? 'Upload Logo'}
				</Button>
				{#if logo}
					<OrganizationLogo src={logo} className="size-16" />
					<Button type="button" variant="destructive" onclick={deleteLogo}>
						{localization?.DELETE_LOGO ?? 'Delete Logo'}
					</Button>
				{/if}
			</div>

			<!-- Name input -->
			<div>
				<label class="block text-sm font-medium mb-1" for={orgNameId}
					>{localization?.ORGANIZATION_NAME ?? 'Name'}</label
				>
				<Input
					type="text"
					bind:value={name}
					placeholder={localization?.ORGANIZATION_NAME_PLACEHOLDER ?? 'Organization name'}
					required
					id={orgNameId}
				/>
			</div>

			<!-- Slug input -->
			<div>
				<label class="block text-sm font-medium mb-1" for={orgSlugId}
					>{localization?.ORGANIZATION_SLUG ?? 'Slug'}</label
				>
				<Input
					type="text"
					bind:value={slug}
					placeholder={localization?.ORGANIZATION_SLUG_PLACEHOLDER ?? 'organization-slug'}
					required
					id={orgSlugId}
				/>
				{#if slug && !validateSlug(slug)}
					<div class="text-red-500 text-xs">
						{localization?.ORGANIZATION_SLUG_INVALID ??
							'Slug must be lowercase, numbers, and hyphens only.'}
					</div>
				{/if}
			</div>

			<DialogFooter class={classNames?.dialog?.footer}>
				<Button type="button" variant="outline" onclick={() => onOpenChange(false)}>
					{localization?.CANCEL ?? 'Cancel'}
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting
						? (localization?.CREATING ?? 'Creating...')
						: (localization?.CREATE_ORGANIZATION ?? 'Create Organization')}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>

<style>
	/* Add any scoped styles here if needed */
</style>
