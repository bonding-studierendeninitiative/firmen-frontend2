<script lang="ts">
	import * as Card from '@/components/ui/card';
	import type { InferOutput } from 'valibot';
	import type { OrgAdvertisementSchema } from '@schema/advertisements';
	import { Event, PdfFilePreview } from '@/@svelte/components';


	export let advertisement: InferOutput<OrgAdvertisementSchema>;
</script>

<section>
	<Card.Root>
		<Card.Header>
			<PdfFilePreview url={`${advertisement.url}#toolbar=0&navpanes=0&scrollbar=0`} />
		</Card.Header>
		<Card.Content>
			<Event event={advertisement.eventRegistration.event} />
		</Card.Content>
	</Card.Root>
</section>