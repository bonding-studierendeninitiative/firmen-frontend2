<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { fileProxy, type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UploadAdvertisementRequest } from '@schema';
	import { cn } from '@/utils';
	import { Plus } from '@lucide/svelte';
	import { uploadCatalogueData } from '@/remote/functions';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';

	interface Props {
		open: boolean;
		advertisementUploadForm: SuperValidated<Infer<UploadAdvertisementRequest>>;
		onUpload?: (args: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
			data: FormData;
		}) => Promise<void>;
	}

	let { open = $bindable(), advertisementUploadForm, onUpload }: Props = $props();

	const superform = superForm(advertisementUploadForm, {
		validators: valibotClient(UploadAdvertisementRequest),
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Advertisement uploaded successfully');
			} else {
				console.log('Upload error:', result);

				toast.error(`Error: ${result.status}`);
			}
		}
	});
	const { enhance, form: formData, submitting, tainted, isTainted } = superform;

	const file = fileProxy(superform, 'file');
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'default' }), 'mr-2')}>
		<Plus class="size-4 mr-2" />
		{$_('common.upload')}
	</Dialog.Trigger>
	<Dialog.Content>
		<form
			{...uploadCatalogueData.enhance(async ({ submit, form, data }) => {
				try {
					await onUpload?.({ submit, form, data });
					open = false;
				} catch (error) {
					console.error('Error uploading logo:', error);
				}
			})}
			enctype="multipart/form-data"
			class="space-y-4"
		>
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_('modules.upload-advertisement.title')}</Dialog.Title>
				<Dialog.Description>{$_('modules.upload-advertisement.description')}</Dialog.Description>
			</Dialog.Header>
			<Field class="flex-col flex justify-start" form={superform} name="title">
				<Control>
					{#snippet children({ props })}
						<Label>{$_('modules.upload-advertisement.name')}</Label>
						<Input bind:value={$formData.title} {...props} />
					{/snippet}
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field class="flex-col flex justify-start" form={superform} name="file">
				<Control>
					{#snippet children({ props })}
						<Label>{$_('modules.upload-advertisement.file')}</Label>
						<!-- Due to some weird bug, we can't use Input here! (02.07.2025) -->
						<input
							class="focus-within:ring-2 focus-within:ring-offset-2 text-sm font-medium ring-offset-background border-input focus-visible:outline-hidden h-10 bg-background border rounded-md px-3 py-2"
							accept="image/*, application/pdf"
							{...props}
							type="file"
							bind:files={$file}
						/>
					{/snippet}
				</Control>
				<Description>{$_('modules.upload-advertisement.file-description')}</Description>
				<FieldErrors />
			</Field>
			<Field form={superform} name="orgId">
				<Control>
					{#snippet children({ props })}
						<input type="hidden" value={$formData.orgId} name={props.name} />
					{/snippet}
				</Control>
			</Field>
			<Dialog.Footer>
				<Button disabled={$file.length !== 1} type="submit">{$_('common.upload')}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
