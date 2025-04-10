<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-french-toast';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UploadAdvertisementRequest } from '@schema';

	export let open: boolean;
	export let advertisementUploadForm: SuperValidated<Infer<UploadAdvertisementRequest>>;

	const superform = superForm(advertisementUploadForm, {
		validators: valibotClient(UploadAdvertisementRequest),
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Advertisement uploaded successfully');
			} else {
				toast.error(`Error: ${result.status}`);
			}
		}
	});
	const { enhance, form: formData, submitting, tainted, isTainted } = superform;

</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<form action="?/uploadAdvertisement" enctype="multipart/form-data" method="post" use:enhance class="space-y-4">
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_("modules.upload-advertisement.title")}</Dialog.Title>
				<Dialog.Description>{$_("modules.upload-advertisement.description")}</Dialog.Description>
			</Dialog.Header>
			<Field class="flex-col flex justify-start" form={superform} name="title">
				<Control let:attrs>
					<Label>{$_("modules.upload-advertisement.title")}</Label>
					<Input {...attrs} bind:value={$formData.title}/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field class="flex-col flex justify-start" form={superform} name="file">
				<Control let:attrs>
					<Label>{$_("modules.upload-advertisement.file")}</Label>
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
				<Button disabled={!isTainted($tainted)}
								type="submit">{$_("modules.upload-advertisement.upload")}</Button>
			</Dialog.Footer>
		</form>
		<SuperDebug data={{
			tainted: $tainted,
			submitting: $submitting,
			formData: $formData,
		}} />
	</Dialog.Content>
</Dialog.Root>
