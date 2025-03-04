<script lang="ts">
	import * as Card from '@/components/ui/card';
	import type { InferOutput } from 'valibot';
	import { Event, PdfFilePreview } from '@/@svelte/components';
	import type { OrgLogoSchema } from '@schema';


	export let logo: InferOutput<OrgLogoSchema>;
</script>

<section>
	<Card.Root>
		<Card.Header>
			<img alt="Logo" src={`${logo.url}#toolbar=0&navpanes=0&scrollbar=0`} />
		</Card.Header>
		<Card.Content>
			<Event event={logo.eventRegistration.event} />
		</Card.Content>
	</Card.Root>
</section>