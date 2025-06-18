<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Input } from '@/components/ui/input';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UploadAdvertisementRequest } from '@schema';
	import { cn } from '@/utils';
	import { Plus } from 'lucide-svelte';

	interface Props {
		open: boolean;
		advertisementUploadForm: SuperValidated<Infer<UploadAdvertisementRequest>>;
	}

	let { open = $bindable(), advertisementUploadForm }: Props = $props();

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
	<Dialog.Trigger class={cn(buttonVariants({variant: 'default'}), "mr-2")}>
		<Plus class="h-4 w-4 mr-2" />
		{$_("common.upload")}
	</Dialog.Trigger>
	<Dialog.Content>
		<form action="?/uploadAdvertisement" enctype="multipart/form-data" method="post" use:enhance class="space-y-4">
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_("modules.upload-advertisement.title")}</Dialog.Title>
				<Dialog.Description>{$_("modules.upload-advertisement.description")}</Dialog.Description>
			</Dialog.Header>
			<Field class="flex-col flex justify-start" form={superform} name="title">
				<Control >
					{#snippet children({ props })}
										<Label>{$_("modules.upload-advertisement.name")}</Label>
						<Input {...props} bind:value={$formData.title}/>
														{/snippet}
								</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field class="flex-col flex justify-start" form={superform} name="file">
				<Control >
					{#snippet children({ props })}
										<Label>{$_("modules.upload-advertisement.file")}</Label>
						<Input type="file" {...props}
									 oninput={(e) => $formData.file = e.currentTarget.files?.item(0)} />
														{/snippet}
								</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="orgId">
				<Control >
					{#snippet children({ props })}
										<input type="hidden" value={$formData.orgId} name={props.name} />
														{/snippet}
								</Control>
			</Field>
			<Dialog.Footer>
				<Button disabled={!isTainted($tainted)}
								type="submit">{$_("common.upload")}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
