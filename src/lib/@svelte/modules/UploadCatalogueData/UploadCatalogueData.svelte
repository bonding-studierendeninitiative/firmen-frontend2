<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type UploadCatalogueDataForm } from '@schema';
	import { toast } from 'svelte-sonner';
	import { getContext, onMount } from 'svelte';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { FileImage, Shield } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		id: string;
	}

	let { isOpen = $bindable(), id = $bindable() }: Props = $props();
	let catalogueDataUploadForm: SuperValidated<Infer<UploadCatalogueDataForm>> =
		getContext('uploadCatalogueDataForm');

	const superCatalogueDataUploadForm = superForm(catalogueDataUploadForm, {
		// validators: valibotClient(UploadCatalogueDataRequest),
		onResult({ result }) {
			if (result.type === 'success') {
				isOpen = false;
				toast.success('Catalogue data uploaded successfully');
			} else {
				toast.error(`Error: ${result.status}`);
			}
		}
	});
	const { enhance, form: formData, submitting, tainted, isTainted } = superCatalogueDataUploadForm;
	const documentTypeOptions = [
		{
			value: 'logo',
			label: $_('common.logo'),
			icon: Shield
		},
		{
			value: 'advert',
			label: $_('common.advert'),
			icon: FileImage
		}
	] as const;
	onMount(() => {
		$formData.documentType = documentTypeOptions[1].value;
		$formData.eventRegistrationId = id;
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<form
			action="?/uploadCatalogueData"
			enctype="multipart/form-data"
			method="post"
			use:enhance
			class="space-y-4"
		>
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_('modules.upload-catalogue-data.title')}</Dialog.Title>
				<Dialog.Description>{$_('modules.upload-catalogue-data.description')}</Dialog.Description>
			</Dialog.Header>

			<Field
				class="flex-col flex justify-start"
				form={superCatalogueDataUploadForm}
				name="documentType"
			>
				<Control>
					{#snippet children({ props })}
						<Label>{$_('modules.upload-catalogue-data.document-type')}</Label>
						<input type="hidden" {...props} value={$formData.documentType} />
						<Tabs.Root class="p-1" bind:value={$formData.documentType}>
							<Tabs.List class="space-x-1">
								{#each documentTypeOptions as { value, label, icon }}
									<Tabs.Trigger {value}>
										{@const SvelteComponent = icon}
										<SvelteComponent class="w-4 h-4 mr-2" />{label}</Tabs.Trigger
									>
								{/each}
							</Tabs.List>
						</Tabs.Root>
					{/snippet}
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field class="flex-col flex justify-start" form={superCatalogueDataUploadForm} name="file">
				<Control>
					{#snippet children({ props })}
						<Label>{$_('modules.upload-catalogue-data.file')}</Label>
						<Input
							type="file"
							{...props}
							oninput={(e) => ($formData.file = e.currentTarget.files?.item(0))}
						/>
					{/snippet}
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superCatalogueDataUploadForm} name="eventRegistrationId">
				<Control>
					{#snippet children({ props })}
						<input type="hidden" bind:value={id} {...props} />
					{/snippet}
				</Control>
			</Field>
			<Field form={superCatalogueDataUploadForm} name="orgId">
				<Control>
					{#snippet children({ props })}
						<input type="hidden" bind:value={id} {...props} />
					{/snippet}
				</Control>
			</Field>
			<Dialog.Footer>
				<Button disabled={!isTainted($tainted) || $submitting} type="submit"
					>{$_('modules.upload-catalogue-data.upload')}</Button
				>
			</Dialog.Footer>
		</form>
		<SuperDebug data={$formData} />
	</Dialog.Content>
</Dialog.Root>
