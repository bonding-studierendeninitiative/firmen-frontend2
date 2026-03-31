<script lang="ts">
	import EmailDraftEditor from './email-draft-editor.svelte';
	import { getEmailDraft } from '@/remote/functions/admin';

	let { params } = $props();

	let eventId = params.id;
	let draftId = params.draftId;

	let draftQuery = getEmailDraft({ eventId, draftId });
</script>

<EmailDraftEditor
	{eventId}
	{draftId}
	emailDraft={draftQuery.current}
	loading={draftQuery.loading}
	error={draftQuery.error}
	onCreateDraft={({ submit }) => submit()}
/>
