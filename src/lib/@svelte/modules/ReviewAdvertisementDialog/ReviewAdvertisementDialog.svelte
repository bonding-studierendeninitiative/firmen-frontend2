<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		type AdvertisementSchema, type ReviewAdvertisementRequest
	} from '@schema';
	import { toast } from 'svelte-french-toast';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Textarea } from '@/components/ui/textarea';
	import { CheckIcon, MessageCircleX, RefreshCwIcon } from 'lucide-svelte';
	import { AdvertisementPreview } from '@/@svelte/components';
	import type { InferOutput } from 'valibot';
	import { cn } from '@/utils';

	let open: boolean;

	export let advertisement: InferOutput<AdvertisementSchema>;
	let catalogueDataReviewForm: Writable<SuperValidated<Infer<ReviewAdvertisementRequest>>> = getContext('reviewAdvertisementForm');

	const superCatalogueDataReviewForm = superForm($catalogueDataReviewForm, {
		dataType: 'json',
		onSubmit({ jsonData }) {
			jsonData({
				...$formData,
				advertisementId: advertisement.id
			});
		},
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Advertisement reviewed successfully');
			} else if (result.type === 'error') {
				toast.error(`Error: ${result.error.message}`);
			} else if (result.type === 'failure') {
				toast.error(`Unknown error ${result.data}`);
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
			value: 'changes-request',
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
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({variant:"outline"}))}>
		Review&hellip;
	</Dialog.Trigger>
	<Dialog.Content class="max-w-screen-lg">
		<form action="?/reviewAdvertisement" method="post" use:enhance>
			<Dialog.Header class="space-y-4 mb-4">
				<Dialog.Title>{$_("modules.review-catalogue-data.title")}</Dialog.Title>
				<Dialog.Description>{$_("modules.review-catalogue-data.description")}</Dialog.Description>
			</Dialog.Header>

			<div class="grid grid-cols-3 py-2 gap-x-6">
				<div class="space-y-4 py-2 col-span-2">

					<Field class="flex-col flex justify-start" form={superCatalogueDataReviewForm} name="documentChangeType">
						<Control let:attrs>
							<Label>{$_("modules.review-catalogue-data.feedback-type")}</Label>
							<Tabs.Root class="p-1" bind:value={$formData.documentChangeType}>
								<Tabs.List class="space-x-1">
									{#each feedbackTypeOptions as { value, label, icon, clazz }}
										<Tabs.Trigger {...attrs} class={clazz} {value}>
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
							<Textarea {...attrs} bind:value={$formData.feedback} disabled={!$formData.documentChangeType} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>

					<Dialog.Footer>
						<Button
							type="submit">{$_("modules.review-catalogue-data.proceed")}</Button>
					</Dialog.Footer>
				</div>
				<div>
					<AdvertisementPreview {advertisement} />
				</div>
			</div>

			<details>
				<SuperDebug data={advertisement} />
			</details>
		</form>
	</Dialog.Content>
</Dialog.Root>
