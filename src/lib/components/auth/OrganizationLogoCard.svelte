<script lang="ts">
	import { cn } from '@/utils';
	import SettingsCard from './shared/SettingsCard.svelte';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import OrganizationLogo from './OrganizationLogo.svelte';
	import { UploadCloudIcon, Trash2Icon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			content?: string;
			button?: string;
		};
		localization?: any;
		// Mock props - would come from context in real implementation
		activeOrganization?: { id: string; name: string; logo?: string } | null;
		hasPermission?: boolean;
		isPending?: boolean;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		activeOrganization = { id: '1', name: 'Test Organization', logo: '' },
		hasPermission = true,
		isPending = false
	}: Props = $props();

	let fileInput: HTMLInputElement;
	let isUploading = $state(false);
	let isDeleting = $state(false);

	function handleUploadClick() {
		fileInput?.click();
	}

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast.error(localization.INVALID_FILE_TYPE || 'Please select a valid image file');
			return;
		}

		// Validate file size (2MB limit)
		if (file.size > 2 * 1024 * 1024) {
			toast.error(localization.FILE_TOO_LARGE || 'File size must be less than 2MB');
			return;
		}

		isUploading = true;

		try {
			// Mock upload logic - would use actual upload in real implementation
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Create temporary URL for display
			const imageUrl = URL.createObjectURL(file);
			if (activeOrganization) {
				activeOrganization.logo = imageUrl;
			}

			toast.success(localization.LOGO_UPLOADED || 'Logo uploaded successfully');
		} catch (error) {
			toast.error(localization.UPLOAD_FAILED || 'Failed to upload logo');
		} finally {
			isUploading = false;
			// Clear input
			target.value = '';
		}
	}

	async function handleDeleteLogo() {
		if (!activeOrganization?.logo) return;

		isDeleting = true;

		try {
			// Mock delete logic
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (activeOrganization) {
				activeOrganization.logo = '';
			}

			toast.success(localization.LOGO_DELETED || 'Logo deleted successfully');
		} catch (error) {
			toast.error(localization.DELETE_FAILED || 'Failed to delete logo');
		} finally {
			isDeleting = false;
		}
	}

	let isProcessing = $derived(isUploading || isDeleting);
</script>

<SettingsCard
	{className}
	{classNames}
	title={localization.ORGANIZATION_LOGO || 'Organization Logo'}
	description={localization.ORGANIZATION_LOGO_DESCRIPTION || 'Upload a logo for your organization'}
	instructions={localization.ORGANIZATION_LOGO_INSTRUCTIONS ||
		'Choose an image that represents your organization'}
	disabled={!hasPermission || isProcessing}
	{isPending}
>
	{#snippet children()}
		<Card.Content class={cn('flex items-center gap-6', classNames?.content)}>
			<div class="flex items-center gap-4">
				<OrganizationLogo
					organization={activeOrganization}
					size="lg"
					{isPending}
					{classNames}
					{localization}
				/>

				<div class="flex flex-col gap-2">
					<div class="flex items-center gap-2">
						{#if activeOrganization?.logo}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child(props)}
										<Button
											{...props}
											variant="outline"
											disabled={isProcessing || !hasPermission}
											class={cn('gap-2', classNames?.button)}
										>
											{#if isProcessing}
												<div
													class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
												></div>
											{:else}
												<UploadCloudIcon class="size-4" />
											{/if}
											{localization.CHANGE_LOGO || 'Change Logo'}
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>

								<DropdownMenu.Content>
									<DropdownMenu.Item onclick={handleUploadClick}>
										<UploadCloudIcon class="size-4" />
										{localization.UPLOAD_NEW || 'Upload New'}
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={handleDeleteLogo} class="text-destructive">
										<Trash2Icon class="size-4" />
										{localization.DELETE_LOGO || 'Delete Logo'}
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<Button
								variant="outline"
								onclick={handleUploadClick}
								disabled={isProcessing || !hasPermission}
								class={cn('gap-2', classNames?.button)}
							>
								{#if isUploading}
									<div
										class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
									></div>
								{:else}
									<UploadCloudIcon class="size-4" />
								{/if}
								{localization.UPLOAD_LOGO || 'Upload Logo'}
							</Button>
						{/if}
					</div>

					<p class="text-xs text-muted-foreground">
						{localization.LOGO_REQUIREMENTS || 'PNG, JPG up to 2MB'}
					</p>
				</div>
			</div>
		</Card.Content>
	{/snippet}
</SettingsCard>

<!-- Hidden file input -->
<input
	bind:this={fileInput}
	type="file"
	accept="image/*"
	onchange={handleFileChange}
	class="hidden"
/>
