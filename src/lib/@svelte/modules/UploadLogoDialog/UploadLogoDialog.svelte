<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		type UploadLogoRequest
	} from '@schema';
	import { toast } from 'svelte-french-toast';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { Plus } from 'lucide-svelte';
	import { cn } from '@/utils';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let open: boolean;
	export let logoUploadForm: SuperValidated<Infer<UploadLogoRequest>>;
	const utils = trpc($page).createUtils();

	const superform = superForm(logoUploadForm, {
		// validators: valibotClient(UploadCatalogueDataRequest),
		async onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Logo uploaded successfully');
				await utils.catalogueData.logos.uploadForm.invalidate()
			} else {
				toast.error(`Error: ${result.status}`);
			}
		}
	});
	const { enhance, form: formData, submitting, tainted, isTainted } = superform;

</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({variant: 'default'}), "mr-2")}>
		<Plus class="h-4 w-4 mr-2" />
		{$_("common.upload")}
	</Dialog.Trigger>
	<Dialog.Content>
		<form action="?/uploadLogo" enctype="multipart/form-data" method="post" use:enhance class="space-y-4">
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_("modules.upload-logo.title")}</Dialog.Title>
				<Dialog.Description>{$_("modules.upload-logo.description")}</Dialog.Description>
			</Dialog.Header>
			<Field class="flex-col flex justify-start" form={superform} name="title">
				<Control let:attrs>
					<Label>{$_("modules.upload-logo.title")}</Label>
					<Input {...attrs} bind:value={$formData.title} />
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field class="flex-col flex justify-start" form={superform} name="file">
				<Control let:attrs>
					<Label>{$_("modules.upload-logo.file")}</Label>
					<Input type="file" {...attrs}
								 on:input={(e) => $formData.file = e.currentTarget.files?.item(0)} />
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="orgId">
				<Control let:attrs>
					<input type="hidden" value={$formData.orgId} name={attrs.name} />
				</Control>
			</Field>
			<Dialog.Footer>
				<Button disabled={!isTainted($tainted) || $submitting}
								type="submit">{$_("modules.upload-logo.upload")}</Button>
			</Dialog.Footer>
		</form>
		<SuperDebug data={$formData} />
	</Dialog.Content>
</Dialog.Root>
