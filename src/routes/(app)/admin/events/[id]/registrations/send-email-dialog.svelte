<script lang="ts">
	import { _ } from 'svelte-i18n';
	import {
		getEmailDrafts,
		previewBulkEmail,
		sendBulkEmail
	} from '@/remote/functions/admin/event-emails.remote.js';
	import { ChevronDown, Mail, Plus } from '@lucide/svelte';
	import * as Dialog from '@/components/ui/dialog';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Carousel from '@/components/ui/carousel';
	import { Button, buttonVariants } from '@/components/ui/button';

	import { cn } from '@/utils';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import Label from '@/components/ui/label/label.svelte';
	import { Skeleton } from '@/components/ui/skeleton';

	let {
		onEmailSent,
		registrationIds,
		eventId
	}: {
		onEmailSent?: ({
			submit
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
		}) => Promise<void>;
		eventId: string;
		registrationIds?: string[];
	} = $props();
	let open = $state(false);

	let emailDraftQuery = getEmailDrafts({
		eventId,
		page: 0,
		size: 100
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={cn(buttonVariants({ variant: 'outline' }))}
		disabled={registrationIds === undefined || registrationIds.length === 0}
	>
		<Mail class=" size-4 mr-2 inline-block" />
		{$_('admin-pages.events.emails.send-email.trigger')}
	</Dialog.Trigger>
	<Dialog.Content class="max-w-2xl">
		<form
			{...sendBulkEmail.enhance(async ({ submit }) => {
				try {
					await onEmailSent?.({ submit });
					const result = sendBulkEmail.result;
					if (result !== undefined) {
						open = false;
					}
				} catch (e) {
					console.error('Error creating draft:', e);
				}
			})}
		>
			<Dialog.Header>
				<Dialog.Title>{$_('admin-pages.events.emails.send-email.title')}</Dialog.Title>
				<Dialog.Description>
					{$_('admin-pages.events.emails.send-email.description')}
				</Dialog.Description>
			</Dialog.Header>
			<fieldset class=" py-4 space-y-4">
				<input {...sendBulkEmail.fields.eventId.as('hidden', eventId)} />
				{#if registrationIds}
					{#each registrationIds as id, index}
						<input {...sendBulkEmail.fields.recipients.registrationIds[index].as('hidden', id)} />
					{/each}
				{/if}

				<div class="flex flex-col gap-1">
					<Label for="draft">
						{$_('admin-pages.events.emails.send-email.selected-draft')}
					</Label>
					<!-- Select Draft -->
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'outline' }))}>
							{emailDraftQuery.current?.drafts?.find(
								(draft) => draft.id === sendBulkEmail.fields.draftId.value()
							)?.subject ?? $_('admin-pages.events.emails.send-email.select-draft')}
							<ChevronDown class="size-4 ml-2" />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="min-w-[200px]">
							{#if emailDraftQuery.loading}
								<DropdownMenu.Item class="cursor-not-allowed opacity-50">
									{$_('common.loading')}...
								</DropdownMenu.Item>
							{:else if emailDraftQuery.ready}
								{#each emailDraftQuery.current.drafts as draft}
									<DropdownMenu.Item
										class="cursor-pointer hover:bg-accent hover:text-accent-foreground"
										onclick={() => sendBulkEmail.fields.draftId.set(draft.id!)}
									>
										{draft.subject}
									</DropdownMenu.Item>
								{:else}
									<DropdownMenu.Item class="cursor-not-allowed opacity-50">
										{$_('admin-pages.events.emails.send-email.no-drafts')}
									</DropdownMenu.Item>
								{/each}
							{/if}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
				{#if sendBulkEmail.fields.draftId.value() !== undefined}
					<input
						{...sendBulkEmail.fields.draftId.as('hidden', sendBulkEmail.fields.draftId.value())}
					/>
					{#if previewBulkEmail( { eventId, draftId: sendBulkEmail.fields.draftId.value(), recipients: { registrationIds } } ).ready}
						<div class="px-4">
							<Carousel.Root
								opts={{
									duration: 10
								}}
							>
								<Carousel.Content>
									{#each previewBulkEmail( { eventId, draftId: sendBulkEmail.fields.draftId.value(), recipients: { registrationIds } } ).current?.previews as preview, index}
										<Carousel.Item>
											<div class="p-1">
												<div class="border border-border rounded p-4 bg-secondary/50">
													<h3 class="font-medium mb-2">
														{$_('admin-pages.events.emails.send-email.preview-for', {
															values: {
																contactName: preview.recipient?.contactName,
																email: preview.recipient?.email
															}
														})}
													</h3>
													<div class="markdown-body max-h-96 overflow-y-auto bg-secondary">
														<iframe
															title="Email Preview"
															class="w-full h-96 border border-border"
															srcdoc={preview.bodyHtml}
														></iframe>
														<!-- <div class="markdown-body" > -->
														<!-- 	{@html preview.bodyHtml} -->
														<!-- </div> -->
														<!-- Using iframe to better simulate email client rendering -->
														<!-- <div class="markdown-body" > -->
														<!-- 	{@html preview.bodyHtml} -->
													</div>
												</div>
											</div>
										</Carousel.Item>
									{/each}
								</Carousel.Content>
								<Carousel.Previous />
								<Carousel.Next />
							</Carousel.Root>
						</div>
					{:else}
						<Skeleton class="h-96 w-full animate-pulse" />
					{/if}
				{/if}
			</fieldset>
			<Dialog.Footer>
				<Dialog.Close class={cn(buttonVariants({ variant: 'outline' }))} type="button">
					{$_('common.cancel')}
				</Dialog.Close>
				<Button
					type="submit"
					class={cn(buttonVariants({ variant: 'default' }))}
					disabled={sendBulkEmail.pending > 0}
				>
					{$_('common.create')}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
