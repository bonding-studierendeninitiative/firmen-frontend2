<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		type UploadCatalogueDataForm
	} from '@schema';
	import { toast } from 'svelte-french-toast';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { FileImage, Shield } from 'lucide-svelte';

	export let isOpen: boolean;
	export let id: string;
	let catalogueDataUploadForm: SuperValidated<Infer<UploadCatalogueDataForm>> = getContext('uploadCatalogueDataForm');

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
		<form action="?/uploadCatalogueData" enctype="multipart/form-data" method="post" use:enhance class="space-y-4">
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_("modules.upload-catalogue-data.title")}</Dialog.Title>
				<Dialog.Description>{$_("modules.upload-catalogue-data.description")}</Dialog.Description>
			</Dialog.Header>

			<Field class="flex-col flex justify-start" form={superCatalogueDataUploadForm} name="documentType">
				<Control let:attrs>
					<Label>{$_("modules.upload-catalogue-data.document-type")}</Label>
					<input type="hidden" {...attrs} value={$formData.documentType} />
					<Tabs.Root class="p-1" bind:value={$formData.documentType}>
						<Tabs.List class="space-x-1">
							{#each documentTypeOptions as { value, label, icon }}
								<Tabs.Trigger {value}>
									<svelte:component class="w-4 h-4 mr-2" this={icon} />{label}</Tabs.Trigger>
							{/each}
						</Tabs.List>
					</Tabs.Root>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field class="flex-col flex justify-start" form={superCatalogueDataUploadForm} name="file">
				<Control let:attrs>
					<Label>{$_("modules.upload-catalogue-data.file")}</Label>
					<Input type="file" {...attrs}
								 on:input={(e) => $formData.file = e.currentTarget.files?.item(0)} />
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superCatalogueDataUploadForm} name="eventRegistrationId">
				<Control let:attrs>
					<input type="hidden" bind:value={id} name={attrs.name} />
				</Control>
			</Field>
			<Field form={superCatalogueDataUploadForm} name="orgSlug">
				<Control let:attrs>
					<input type="hidden" bind:value={id} name={attrs.name} />
				</Control>
			</Field>
			<Dialog.Footer>
				<Button disabled={!isTainted($tainted) || $submitting}
								type="submit">{$_("modules.upload-catalogue-data.upload")}</Button>
			</Dialog.Footer>
		</form>
		<SuperDebug data={$formData} />
	</Dialog.Content>
</Dialog.Root>
