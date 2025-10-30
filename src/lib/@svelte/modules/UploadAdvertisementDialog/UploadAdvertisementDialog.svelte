<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { cn } from '@/utils';
	import { Plus } from '@lucide/svelte';
	import { uploadCatalogueData } from '@/remote/functions';
	import * as Field from '@/components/ui/field';

	interface Props {
		open: boolean;
		onSuccess?: () => void;
	}

	let { open = $bindable(false), onSuccess }: Props = $props();

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
						toast.success('Advertisement uploaded successfully');
						open = false;
						if (onSuccess) {
							onSuccess();
						}
					}
				} catch (e) {
					toast.error((e as any)?.message ?? 'Error uploading');
					console.error('Error uploading advertisment:', e);
				}
			})}
			enctype="multipart/form-data"
			class="space-y-4"
		>
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_('modules.upload-advertisement.title')}</Dialog.Title>
				<Dialog.Description>{$_('modules.upload-advertisement.description')}</Dialog.Description>
			</Dialog.Header>
			<Field.Field>
				<Field.Label for="title">{$_('modules.upload-advertisement.name')}</Field.Label>
				<Input
					id="title"
					{...title.as('text')}
					placeholder={$_('auth.sign-up.placeholders.name')}
					disabled={uploadCatalogueData.pending > 0}
				/>
				<Field.Error>
					{#each uploadCatalogueData.fields.title.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</Field.Error>
			</Field.Field>

			<Field.Field>
				<Field.Label for="file">{$_('modules.upload-advertisement.file')}</Field.Label>
				<input
					id="file"
					class="focus-within:ring-2 focus-within:ring-offset-2 text-sm font-medium ring-offset-background border-input focus-visible:outline-hidden h-10 bg-background border rounded-md px-3 py-2"
					accept="image/*, application/pdf"
					{...file.as('file')}
					disabled={uploadCatalogueData.pending > 0}
				/>
				<Field.Error>
					{#each uploadCatalogueData.fields.file.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</Field.Error>
			</Field.Field>

			<input {...documentType.as('hidden', 'advert')} />

			<Dialog.Footer>
				<Button disabled={uploadCatalogueData.pending > 0} type="submit"
					>{$_('common.upload')}</Button
				>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
