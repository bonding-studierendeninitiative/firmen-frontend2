<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Select from '@/components/ui/select';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type {
		DocumentType, ReviewCatalogueDataForm
	} from '@schema';
	import { toast } from 'svelte-french-toast';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';

	export let isOpen: boolean;
	export let id: string;
	let catalogueDataReviewForm: Writable<SuperValidated<Infer<ReviewCatalogueDataForm>>> = getContext('confirmForm');

	const superCatalogueDataReviewForm = superForm($catalogueDataReviewForm, {
		onSubmit({ formData }) {
			formData.set('eventRegistrationId', id);
		},
		onResult({ result }) {
			if (result.type === 'success') {
				isOpen = false;
				toast.success('Event registration confirmed successfully');
			} else {
				toast.error(`Error: ${result.status}`);
			}
		}
	});
	const { enhance, form: formData } = superCatalogueDataReviewForm;
	const documentTypeOptions: {value: DocumentType; label?:string}[] = [
		{
			value: 'logo',
			label: "Logo"
		},
		{
			value: 'advert',
			label: "Advertisement"
		},
		{
			value: 'portrait',
			label: "Portrait"
		},
	]
	let selectedDocumentType = documentTypeOptions[2]
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<form action="?/reviewCatalogueData" method="post" use:enhance  class="space-y-4">
			<Dialog.Header class="space-y-4">
				<Dialog.Title>{$_("admin-pages.events.event-registrations.review-catalogue-data.title")}</Dialog.Title>
				<Dialog.Description>{$_("admin-pages.events.event-registrations.review-catalogue-data.description")}</Dialog.Description>
			</Dialog.Header>

			<Field class="flex-col flex justify-start" form={superCatalogueDataReviewForm} name="documentType">
				<Control let:attrs>
					<Label>{$_("admin-pages.events.event-registrations.review-catalogue-data.document-type")}</Label>
					<Select.Root
						selected={selectedDocumentType}
						onSelectedChange={(v) => {
								v !== undefined && ($formData.documentType = v.value);
								selectedDocumentType = v || documentTypeOptions[2];
							}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value
								placeholder={$_(
										'user-pages.organizations.createOrganization.placeholders.organizationType'
									)}
							/>
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="portrait"  label={$_("common.portrait")} />
							<Select.Item value="logo" label={$_("common.logo")}/>
							<Select.Item value="advert"  label={$_("common.advert")} />
						</Select.Content>
					</Select.Root>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Dialog.Footer>
				<Button type="submit">{$_("admin-pages.events.event-registrations.review-catalogue-data.proceed")}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
