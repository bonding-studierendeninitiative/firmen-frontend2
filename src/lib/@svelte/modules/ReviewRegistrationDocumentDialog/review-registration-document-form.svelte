<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import { toast } from 'svelte-sonner';
	import { Label } from '@/components/ui/label';
	import { _ } from '@services';
	import { Textarea } from '@/components/ui/textarea';
	import { CheckIcon, MessageCircleX, RefreshCwIcon } from '@lucide/svelte';
	import type { AdminRegistrationDocumentOutput } from '@api/admin-client';
	import AdminRegistrationDocumentPreview from '@/@svelte/components/AdminRegistrationDocumentPreview/admin-registration-document-preview.svelte';
	import { reviewDocument } from '@/remote/functions/admin';

	interface Props {
		open: boolean;
		document: AdminRegistrationDocumentOutput;
	}

	let { open = $bindable(), document }: Props = $props();

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

<form
	{...reviewDocument.enhance(async ({ submit }) => {
		try {
			await submit();
			if (reviewDocument.result) {
				toast.success('Review submitted successfully');
			}
		} catch (error) {
			console.error('Failed to submit review:', error);
			toast.error('Failed to submit review. Please try again.');
		}
	})}
>
	<Dialog.Header class="space-y-4 mb-4">
		<Dialog.Title>{$_('modules.review-catalogue-data.title')}</Dialog.Title>
		<Dialog.Description>{$_('modules.review-catalogue-data.description')}</Dialog.Description>
	</Dialog.Header>

	<div class="space-y-4 py-2 col-span-2">
		<AdminRegistrationDocumentPreview registrationDocument={document} />

		<input {...reviewDocument.fields.documentId.as('hidden', document.id)} />

		<div>
			<Label>{$_('modules.review-catalogue-data.feedback-type')}</Label>
			<Tabs.Root
				class="p-1"
				bind:value={
					() => reviewDocument.fields.data.documentChangeType.value() ?? 'confirmation',
					(a) => {
						if (a) reviewDocument.fields.data.documentChangeType.set(a);
					}
				}
			>
				<Tabs.List class="space-x-1">
					{#each feedbackTypeOptions as { value, label, icon, clazz }}
						<Tabs.Trigger class={clazz} {value}>
							{@const SvelteComponent = icon}
							<SvelteComponent class="size-4 mr-2" />{label}</Tabs.Trigger
						>
					{/each}
				</Tabs.List>
			</Tabs.Root>
		</div>

		<div>
			<Label>{$_('admin-pages.events.feedback.placeholders.feedback')}</Label>
			<Textarea
				{...reviewDocument.fields.data.feedback.as('text')}
				bind:value={
					reviewDocument.fields.data.feedback.value, reviewDocument.fields.data.feedback.set
				}
				disabled={!reviewDocument.fields.data.documentChangeType.value()}
			/>
		</div>

		<Dialog.Footer>
			<Button type="submit">{$_('modules.review-catalogue-data.proceed')}</Button>
		</Dialog.Footer>
	</div>
</form>
