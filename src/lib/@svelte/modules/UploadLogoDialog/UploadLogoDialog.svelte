<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { Plus } from '@lucide/svelte';
	import { cn } from '@/utils';
	import { toast } from 'svelte-sonner';
	import { uploadCatalogueData } from '@/remote/functions';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	
	interface Props {
		open: boolean
		onSuccess?: () => void;
	}
	
	let { open = $bindable(false), onSuccess }:Props = $props();

	// use the remote form's fields directly
	const { title, file, documentType } = uploadCatalogueData.fields;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'default' }), 'mr-2')}>
		<Plus class="size-4 mr-2" />
		{$_('common.upload')}
	</Dialog.Trigger>
	<Dialog.Content>
		<form
			{...uploadCatalogueData.enhance(async ({ submit }) => {
				try {
					await submit();
					if (uploadCatalogueData.result) {
						toast.success('Logo uploaded successfully');
						open = false;
						if (onSuccess) {
							onSuccess();
						}
					}
				} catch (e) {
					toast.error((e as any)?.message ?? 'Error uploading');
					console.error('Error uploading logo:', e);
				}
			})}
			enctype="multipart/form-data"
			class="space-y-4"
		>
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_('modules.upload-logo.title')}</Dialog.Title>
				<Dialog.Description>{$_('modules.upload-logo.description')}</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-2">
				<label for="title" class="sr-only">{$_('modules.upload-logo.name')}</label>
				<Input
					id="title"
					{...title.as('text')}
					placeholder={$_('modules.upload-logo.name')}
					disabled={uploadCatalogueData.pending > 0}
				/>
				{#each uploadCatalogueData.fields.title.issues() ?? [] as issue}
					<div class="text-red-500 text-sm">{issue.message}</div>
				{/each}
			</div>

			<div class="grid gap-2">
				<label for="file" class="sr-only">{$_('modules.upload-logo.file')}</label>
				<input
					id="file"
					class="focus-within:ring-2 focus-within:ring-offset-2 text-sm font-medium ring-offset-background border-input focus-visible:outline-hidden h-10 bg-gray-50 border rounded-md px-3 py-2 placeholder-gray-400 w-full"
					accept="image/*, application/pdf"
					{...file.as('file')}
					disabled={uploadCatalogueData.pending > 0}
				/>
				{#each uploadCatalogueData.fields.file.issues() ?? [] as issue}
					<div class="text-red-500 text-sm">{issue.message}</div>
				{/each}
				<div class="text-sm text-muted-foreground">{$_('modules.upload-logo.file-description')}</div>
			</div>

			<!-- ensure document type is set -->
			<input {...documentType.as('hidden')} value="logo" />

			<Dialog.Footer>
				<Button disabled={uploadCatalogueData.pending > 0} type="submit">
					{$_('common.upload')}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
