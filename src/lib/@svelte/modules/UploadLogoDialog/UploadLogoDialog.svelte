<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { fileProxy, type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { UploadCatalogueDataRequest, type UploadLogoRequest } from '@schema';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { Plus } from '@lucide/svelte';
	import { cn } from '@/utils';
	import { uploadCatalogueData } from '@/remote/functions';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	interface Props {
		open: boolean;
		logoUploadForm: SuperValidated<Infer<UploadLogoRequest>>;
		onUpload?: (args: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
			data: FormData;
		}) => Promise<void>;
	}

	let { open = $bindable(), logoUploadForm, onUpload }: Props = $props();

	const superform = superForm(logoUploadForm, {
		validators: valibotClient(UploadCatalogueDataRequest)
	});
	const { form: formData, submitting, tainted, isTainted } = superform;

	let file = fileProxy(formData, 'file');
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
				<Dialog.Title>{$_('modules.upload-logo.title')}</Dialog.Title>
				<Dialog.Description>{$_('modules.upload-logo.description')}</Dialog.Description>
			</Dialog.Header>
			<Field class="flex-col flex justify-start" form={superform} name="title">
				<Control>
					{#snippet children({ props })}
						<Label>{$_('modules.upload-logo.name')}</Label>
						<Input {...props} bind:value={$formData.title} />
					{/snippet}
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field class="flex-col flex justify-start" form={superform} name="file">
				<Control>
					{#snippet children({ props })}
						<Label>{$_('modules.upload-logo.file')}</Label>
						<!-- Due to some weird bug, we can't use Input here! (02.07.2025) -->
						<input
							class="focus-within:ring-2 focus-within:ring-offset-2 text-sm font-medium ring-offset-background border-input focus-visible:outline-hidden h-10 bg-gray-50 border rounded-md px-3 py-2 placeholder-gray-400 w-full"
							accept="image/*, application/pdf"
							{...props}
							type="file"
							bind:files={$file}
						/>
					{/snippet}
				</Control>
				<Description>{$_('modules.upload-logo.file-description')}</Description>
				<FieldErrors />
			</Field>
			<Field form={superform} name="orgId">
				<Control>
					{#snippet children({ props })}
						<input type="hidden" value={$formData.orgId} name={props.name} />
					{/snippet}
				</Control>
			</Field>
			<Field form={superform} name="documentType">
				<Control>
					{#snippet children({ props })}
						<input type="hidden" value="logo" {...props} />
					{/snippet}
				</Control>
			</Field>
			<Dialog.Footer>
				<Button disabled={!isTainted($tainted) || $submitting} type="submit"
					>{$_('common.upload')}</Button
				>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
