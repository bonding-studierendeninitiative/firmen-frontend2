<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { updateEmailDraft } from '@/remote/functions/admin';
	import * as Field from '@/components/ui/field';
	import { cn } from '@/utils';
	import type { DetailedEmailDraftDTO, SimpleEmailDraftDTO } from '@api/admin-client';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import { Carta, MarkdownEditor } from 'carta-md';
	import { _ } from '@services';

	let carta = new Carta({
		shikiOptions: {
			langs: ['markdown', 'handlebars']
		},
		sanitizer: false
	});

	let {
		eventId,
		draftId,
		onCreateDraft,
		emailDraft
	}: {
		eventId: string;
		draftId: string;
		onCreateDraft?: ({
			submit
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
		}) => Promise<void>;
		emailDraft: DetailedEmailDraftDTO;
	} = $props();
</script>

<form
	{...updateEmailDraft.enhance(async ({ submit }) => {
		try {
			await onCreateDraft?.({ submit });
			const result = updateEmailDraft.result;
			if (result !== undefined) {
				// success logic if needed
			}
		} catch (e) {
			console.error('Error creating draft:', e);
		}
	})}
>
	<Field.Set disabled={updateEmailDraft.pending > 0} class=" py-4">
		<input {...updateEmailDraft.fields.eventId.as('hidden', eventId)} />
		<input {...updateEmailDraft.fields.draftId.as('hidden', draftId)} />
		<Field.Field>
			<Field.Label for="subject">{$_('admin-pages.events.emails.subject')}</Field.Label>
			<Input
				id="subject"
				{...updateEmailDraft.fields.subject.as('text')}
				value={emailDraft?.subject ?? ''}
			/>
			{#each updateEmailDraft.fields.subject.issues() ?? [] as issue}
				<div class="text-red-500 text-sm">{issue.message}</div>
			{/each}
		</Field.Field>

		<Field.Field>
			<Field.Label for="reply-to">{$_('admin-pages.events.emails.reply-to')}</Field.Label>
			<Input
				id="reply-to"
				{...updateEmailDraft.fields.replyTo.as('text')}
				value={emailDraft?.replyToEmail ?? ''}
				placeholder="z. B. ac_messe@bonding.de"
			/>
			{#each updateEmailDraft.fields.replyTo.issues() ?? [] as issue}
				<div class="text-red-500 text-sm">{issue.message}</div>
			{/each}
		</Field.Field>

		<Field.Field>
			<input {...updateEmailDraft.fields.bodyMarkdown.as('text')} type="hidden" />
			<MarkdownEditor
				{carta}
				theme="default"
				bind:value={
					() => updateEmailDraft.fields.bodyMarkdown.value() ?? emailDraft?.bodyMarkdown ?? '',
					updateEmailDraft.fields.bodyMarkdown.set
				}
			/>
			{#each updateEmailDraft.fields.bodyMarkdown.issues() ?? [] as issue}
				<div class="text-red-500 text-sm">{issue.message}</div>
			{/each}
			<details class="mt-2">
				<summary class="cursor-pointer text-sm text-primary underline">
					{$_('admin-pages.events.emails.markdown.help.title')}
				</summary>
				<div class="markdown-body mt-2 max-h-60 overflow-y-auto rounded border border-border p-4">
					{@html await carta.render(
						'This is help on **Markdown**. You can find more information [here](https://www.markdownguide.org/basic-syntax/) and [here](https://commonmark.org/help/).'
					)}
				</div>
			</details>
		</Field.Field>
	</Field.Set>
	<Button
		type="submit"
		class={cn(buttonVariants({ variant: 'default' }))}
		disabled={updateEmailDraft.pending > 0}
	>
		{$_('common.update')}
	</Button>
</form>
