<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		type OrgEventRegistration, type ReviewCatalogueDataForm
	} from '@schema';
	import { toast } from 'svelte-french-toast';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Textarea } from '@/components/ui/textarea';
	import { CheckIcon, FileIcon, FileImage, MessageCircleX, RefreshCwIcon, Shield } from 'lucide-svelte';
	import CatalogueDataPreview from '@/@svelte/modules/ReviewCatalogueData/CatalogueDataPreview.svelte';

	export let isOpen: boolean;
	export let id: string;

	export let eventRegistration: Infer<OrgEventRegistration>;
	let catalogueDataReviewForm: Writable<SuperValidated<Infer<ReviewCatalogueDataForm>>> = getContext('reviewCatalogueDataForm');

	const superCatalogueDataReviewForm = superForm($catalogueDataReviewForm, {
		dataType: 'json',
		onSubmit({ jsonData }) {
			jsonData({ ...$formData, eventRegistrationId: id });
		},
		onResult({ result }) {
			if (result.type === 'success') {
				isOpen = false;
				toast.success('Catalogue data reviewed successfully');
			} else {
				toast.error(`Error: ${result.error.message}`);
			}
		}
	});
	const { enhance, form: formData } = superCatalogueDataReviewForm;
	const feedbackTypeOptions = [
		{
			value: 'confirmation',
			label: $_('common.confirm'),
			icon: CheckIcon,
			clazz: 'data-[state=active]:text-brand-green'
		},
		{
			value: 'change-request',
			label: $_('common.request-changes'),
			icon: RefreshCwIcon,
			clazz: 'data-[state=active]:bg-brand-yellow'
		},
		{
			value: 'rejection',
			label: $_('common.reject'),
			icon: MessageCircleX,
			clazz: 'data-[state=active]:text-error'
		}
	] as const;
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
		},
		{
			value: 'portrait',
			label: $_('common.portrait'),
			icon: FileIcon
		}
	] as const;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="max-w-screen-lg">
		<form action="?/reviewCatalogueData" method="post" use:enhance>
			<Dialog.Header class="space-y-4 mb-4">
				<Dialog.Title>{$_("modules.review-catalogue-data.title")}</Dialog.Title>
				<Dialog.Description>{$_("modules.review-catalogue-data.description")}</Dialog.Description>
			</Dialog.Header>

			<div class="grid grid-cols-3 py-2 gap-x-6">
				<div class="space-y-4 py-2 col-span-2">
					<Field class="flex-col flex justify-start" form={superCatalogueDataReviewForm} name="documentType">
						<Control let:attrs>
							<Label>{$_("modules.review-catalogue-data.document-type")}</Label>
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

					<Field class="flex-col flex justify-start" form={superCatalogueDataReviewForm} name="feedback-type">
						<Control let:attrs>
							<Label>{$_("modules.review-catalogue-data.feedback-type")}</Label>
							<Tabs.Root class="p-1" bind:value={$formData.feedbackType}>
								<Tabs.List class="space-x-1">
									{#each feedbackTypeOptions as { value, label, icon, clazz }}
										<Tabs.Trigger class={clazz} {value}>
											<svelte:component class="w-4 h-4 mr-2" this={icon} />{label}</Tabs.Trigger>
									{/each}
								</Tabs.List>
							</Tabs.Root>
						</Control>
						<Description />
						<FieldErrors />
					</Field>

					<Field class="flex-col flex justify-start" form={superCatalogueDataReviewForm} name="feedback">
						<Control let:attrs>
							<Label>{$_("admin-pages.events.feedback.placeholders.feedback")}</Label>
							<Textarea {...attrs} bind:value={$formData.feedback} disabled={!$formData.feedbackType} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>

					<Dialog.Footer>
						<Button
							disabled={!$formData.feedback}
							type="submit">{$_("modules.review-catalogue-data.proceed")}</Button>
					</Dialog.Footer>
				</div>
				<div>
					<CatalogueDataPreview documentType={$formData.documentType} {eventRegistration} {id} />
				</div>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
