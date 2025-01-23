<script lang="ts">
	import type { Infer } from 'sveltekit-superforms';
	import type { OrgEventRegistration } from '@schema';

	export let id: string;
	export let eventRegistration: Infer<OrgEventRegistration>;
	export let documentType: 'portrait' | 'advert' | 'logo';
</script>
{#if documentType === 'portrait'}
	<p>Placeholder</p>
{:else if documentType === 'advert' && eventRegistration.advertisement}
	<embed
		src={`http://localhost:50678/firmenintranet/${eventRegistration.advertisement.name}#toolbar=0&navpanes=0&scrollbar=0`}
		width="100%" class="[aspect-ratio:1/_1.41]" title="Preview" />
{:else if documentType === 'logo' && eventRegistration.logo}
	{#if eventRegistration.logo.mimeType === 'image/png'}
		<img alt="Logo" src={`http://localhost:50678/firmenintranet/${eventRegistration.logo.name}`} />
	{:else }
		<embed src={`http://localhost:50678/${eventRegistration.logo.name}`} />
	{/if}

{/if}
