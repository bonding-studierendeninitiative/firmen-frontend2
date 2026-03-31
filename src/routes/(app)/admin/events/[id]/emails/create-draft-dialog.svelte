<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { createEmailDraft } from '@/remote/functions/admin/event-emails.remote.js';
	import { Plus } from '@lucide/svelte';
	import * as Dialog from '@/components/ui/dialog';
	import { Button, buttonVariants } from '@/components/ui/button';
	import Label from '@/components/ui/label/label.svelte';
	import { Input } from '@/components/ui/input';
	import { cn } from '@/utils';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import { Carta } from 'carta-md';
	import 'carta-md/default.css';

	let {
		onCreateDraft,
		eventId
	}: {
		onCreateDraft?: ({
			submit
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
		}) => Promise<void>;
		eventId: string;
	} = $props();
	let open = $state(false);

	let carta = new Carta({
		shikiOptions: {
			langs: ['markdown', 'handlebars']
		},
		sanitizer: false
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'default' }))}>
		<Plus class=" size-4 mr-2 inline-block" />
		{$_('common.create')}
	</Dialog.Trigger>
	<Dialog.Content>
		<form
			{...createEmailDraft.enhance(async ({ submit }) => {
				try {
					await onCreateDraft?.({ submit });
					const result = createEmailDraft.result;
					if (result !== undefined) {
						open = false;
					}
				} catch (e) {
					console.error('Error creating draft:', e);
				}
			})}
		>
			<Dialog.Header>
				<Dialog.Title>{$_('admin-pages.events.emails.createDraft')}</Dialog.Title>
				<Dialog.Description>
					{$_('admin-pages.events.emails.createDraftDescription')}
				</Dialog.Description>
			</Dialog.Header>
			<fieldset class=" py-4 space-y-4">
				<input {...createEmailDraft.fields.eventId.as('hidden', eventId)} />
				<div>
					<Label for="subject">{$_('admin-pages.events.emails.subject')}</Label>
					<Input id="subject" {...createEmailDraft.fields.subject.as('text')} />
					{#each createEmailDraft.fields.subject.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</div>

				<div>
					<Label for="reply-to">{$_('admin-pages.events.emails.reply-to')}</Label>
					<Input
						id="reply-to"
						{...createEmailDraft.fields.replyTo.as('text')}
						placeholder="z. B. ac_messe@bonding.de"
					/>
					{#each createEmailDraft.fields.replyTo.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</div>
			</fieldset>
			<Dialog.Footer>
				<Dialog.Close class={cn(buttonVariants({ variant: 'outline' }))}>
					{$_('common.cancel')}
				</Dialog.Close>
				<Button
					type="submit"
					class={cn(buttonVariants({ variant: 'default' }))}
					disabled={createEmailDraft.pending > 0}
				>
					{$_('common.create')}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<style>
	.carta-theme__default.carta-editor {
		--border-color: var(--color-border);
	}
</style>
