<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		type LogoSchema,
		type ReviewDocumentRequest
	} from '@schema';
	import { toast } from 'svelte-sonner';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { _ } from '@services';
	import { Textarea } from '@/components/ui/textarea';
	import { CheckIcon, MessageCircleX, RefreshCwIcon } from '@lucide/svelte';
	import { LogoPreview } from '@/@svelte/components';
	import type { InferOutput } from 'valibot';


	interface Props {
		open: boolean;
		logo: InferOutput<LogoSchema>;
		catalogueDataReviewForm: SuperValidated<Infer<ReviewDocumentRequest>>;
	}

	let { open = $bindable(), logo, catalogueDataReviewForm }: Props = $props();

	const superCatalogueDataReviewForm = superForm(catalogueDataReviewForm, {
		dataType: 'json',
		onSubmit({ jsonData }) {
			jsonData({
				...$formData,
				logoId: logo.id
			});
		},
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success('Logo reviewed successfully');
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

<form action="?/reviewLogo" method="post" use:enhance>
	<Dialog.Header class="space-y-4 mb-4">
		<Dialog.Title>{$_("modules.review-catalogue-data.title")}</Dialog.Title>
		<Dialog.Description>{$_("modules.review-catalogue-data.description")}</Dialog.Description>
	</Dialog.Header>

	<div class="grid grid-cols-3 py-2 gap-x-6">
		<div class="space-y-4 py-2 col-span-2">

			<Field class="flex-col flex justify-start" form={superCatalogueDataReviewForm} name="documentChangeType">
				<Control >
					{#snippet children({ props })}
										<Label>{$_("modules.review-catalogue-data.feedback-type")}</Label>
						<Tabs.Root class="p-1" bind:value={$formData.documentChangeType}>
							<Tabs.List class="space-x-1">
								{#each feedbackTypeOptions as { value, label, icon, clazz }}
									<Tabs.Trigger {...props} class={clazz} {value}>
										{@const SvelteComponent = icon}
									<SvelteComponent class="size-4 mr-2" />{label}</Tabs.Trigger>
								{/each}
							</Tabs.List>
						</Tabs.Root>
														{/snippet}
								</Control>
				<Description />
				<FieldErrors />
			</Field>

			<Field class="flex-col flex justify-start" form={superCatalogueDataReviewForm} name="feedback">
				<Control >
					{#snippet children({ props })}
										<Label>{$_("admin-pages.events.feedback.placeholders.feedback")}</Label>
						<Textarea {...props} bind:value={$formData.feedback} disabled={!$formData.documentChangeType} />
														{/snippet}
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
			<LogoPreview {logo} />
		</div>
	</div>

	<details>
		<SuperDebug data={logo} />
	</details>
</form>
