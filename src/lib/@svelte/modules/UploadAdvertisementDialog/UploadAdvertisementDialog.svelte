<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Label } from '@/components/ui/label';
	import * as Dialog from '@/components/ui/dialog';
	import SuperDebug, {
		fileProxy,
		type Infer,
		superForm,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UploadAdvertisementRequest } from '@schema';
	import { cn } from '@/utils';
	import { Plus } from '@lucide/svelte';
	import { uploadCatalogueData } from '@/remote/functions';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';

	interface Props {
		open: boolean
		onSuccess?: () => void;
	}
	
	let { open = $bindable(false), onSuccess }:Props = $props();
	
	const { title, file, documentType } = uploadCatalogueData.fields;

	// const superform = superForm(advertisementUploadForm, {
	// 	validators: valibotClient(UploadAdvertisementRequest),
	// 	onResult({ result }) {
	// 		if (result.type === 'success') {
	// 			open = false;

	// 		} else {
	// 			console.log('Upload error:', result);

	// 		}
	// 	}
	// });
	// // const { enhance, form: formData, submitting, tainted, isTainted } = superform;

	// const file = fileProxy(superform, 'file');
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
					// await uploadCatalogueData.validate()
					// if (uploadCatalogueData.fields.allIssues()?.length == 0) {

					// }else {
					// 	console.log(uploadCatalogueData.fields.allIssues())
					// }
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
			<div class="grid gap-2">
				<Label for="title">{$_('modules.upload-advertisement.name')}</Label>
				<Input
					id="title"
					{...title.as('text')}
					placeholder={$_('auth.sign-up.placeholders.name')}
					disabled={uploadCatalogueData.pending > 0}
				/>
				{#each uploadCatalogueData.fields.title.issues() ?? [] as issue}
					<div class="text-red-500 text-sm">{issue.message}</div>
				{/each}
			</div>

			<!-- <Field class="flex-col flex justify-start" form={superform} name="title">
				<Control>
					{#snippet children({ props })}
						<Label>{$_('modules.upload-advertisement.name')}</Label>
						<Input bind:value={$formData.title} {...props} />
					{/snippet}
				</Control>
				<Description />
				<FieldErrors />
			</Field> -->

			<div class="grid gap-2">
				<Label for="file">{$_('modules.upload-advertisement.file')}</Label>
				<input
					id="file"
					class="focus-within:ring-2 focus-within:ring-offset-2 text-sm font-medium ring-offset-background border-input focus-visible:outline-hidden h-10 bg-background border rounded-md px-3 py-2"
					accept="image/*, application/pdf"
					{...file.as('file')}
					disabled={uploadCatalogueData.pending > 0}
				/>
				{#each uploadCatalogueData.fields.file.issues() ?? [] as issue}
					<div class="text-red-500 text-sm">{issue.message}</div>
				{/each}
			</div>

			<!-- <Field class="flex-col flex justify-start" form={superform} name="file">
				<Control>
					{#snippet children({ props })}
						<Label>{$_('modules.upload-advertisement.file')}</Label>
						Due to some weird bug, we can't use Input here! (02.07.2025)
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
			</Field> -->
			<!-- <div class="grid gap-2">
				<input {...orgId.as("hidden")} value={"advert"}/>
			</div> -->
			<div class="grid gap-2">
				<input {...documentType.as('hidden')} value={'advert'} />
			</div>
			<!-- <Field form={superform} name="orgId">
				<Control>
					{#snippet children({ props })}
						<input type="hidden" value={$formData.orgId} name={props.name} />
					{/snippet}
				</Control>
			</Field> -->
			<Dialog.Footer>
				<Button disabled={false} type="submit">{$_('common.upload')}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
