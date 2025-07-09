<script lang="ts">
	import { type GetPortraitTemplatesResponse } from '@schema';
	import type { InferOutput } from 'valibot';
	import { Link } from '@/@svelte/components';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { FileText, LoaderCircle, Trash2 } from '@lucide/svelte';
	import * as Dialog from '@/components/ui/dialog';
	import { _ } from '@services';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { trpc } from '@/trpc/client';

	interface Props {
		portrait: InferOutput<GetPortraitTemplatesResponse>['portraitTemplates'][number];
	}

	let { portrait }: Props = $props();

	const api = trpc(page);

	const deletePortrait = api.portraitTemplates.delete.createMutation();

	let deleteDialogOpen = $state(false);
</script>

<Card.Root class="h-full transition-all hover:shadow-md cursor-pointer relative group ">
	<Button
		onclick={() => (deleteDialogOpen = true)}
		variant="ghost"
		size="icon"
		class="absolute top-2 right-2 p-0 max-w-6 max-h-6 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground "
	>
		<Trash2 class="size-3.5" />
	</Button>
	<Link
		data-sveltekit-replacestate
		href={`portraits/${portrait.id}`}
		class="size-full hover:no-underline"
	>
			<Card.Header class="flex-row gap-4">
				<div
					class="shrink-0 size-12 rounded-full bg-primary/10 inline-flex justify-center items-center"
				>
					<FileText />
				</div>
				<Card.Title class="text-secondary-foreground font-medium text-base mb-1"
					>{portrait.title}</Card.Title
				>
			</Card.Header>
	</Link>
	<Card.Footer></Card.Footer>
</Card.Root>

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Title>{$_('user-pages.portraits.deletePortrait')}</Dialog.Title>
		<Dialog.Description>
			<p>{$_('user-pages.portraits.deletePortraitDescription')}</p>
			<p class="mt-2 font-medium">{$_('user-pages.portraits.nameOfPortrait')}:</p>
			<p>{portrait.title}</p>
		</Dialog.Description>
		<Dialog.Footer class="flex justify-end items-center w-full">
			<Button variant="secondary" onclick={() => (deleteDialogOpen = false)}
				>{$_('common.cancel')}</Button
			>
			{#if $deletePortrait.isPending}
				<Button form={`delete-portrait-form-${portrait.id}`} disabled variant="destructive">
					<LoaderCircle class="mr-2 size-4 animate-spin" />{$_('common.delete')}
				</Button>
			{:else}
				<Button
					onclick={() => {
						$deletePortrait.mutate(portrait.id, {
							onError: (error) => {
								toast.error(error.message);
							},
							onSuccess: () => {
								toast.success($_('user-pages.portraits.portraitDeletedSuccessMessage'));
								deleteDialogOpen = false;
							}
						});
					}}
					variant="destructive">{$_('common.delete')}</Button
				>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
