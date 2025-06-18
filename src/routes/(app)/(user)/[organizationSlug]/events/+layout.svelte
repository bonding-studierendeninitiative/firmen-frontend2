<script lang="ts">
	import { page } from '$app/state';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import * as RadioGroup from '@/components/ui/radio-group';
	import * as Card from '@/components/ui/card';
	import { trpc } from '@/trpc/client';
	import { Label } from '@/components/ui/label';
	import { goto } from '$app/navigation';

	let { data, children } = $props();

	let selectedEvent = $state(page.params.eventId);

	const api = trpc(page);

	const opts = api.eventRegistrations.forOrganization.createQuery.opts({
		initialData: data.eventRegistrations
	});

	const eventRegistrationQuery = api.eventRegistrations.forOrganization.createQuery(
		{
			orgId: data.orgId,
			cursor: 0,
			limit: 10
		},
		opts
	);

	$effect(() => {
		if (selectedEvent && !page.url.pathname.includes(selectedEvent)) {
			goto(`/${data.orgSlug}/events/${selectedEvent}/registration`);
		}
	});
</script>

<section class="space-y-4">
	<ScrollArea orientation="horizontal">
		<RadioGroup.Root class="flex items-stretch p-2" bind:value={selectedEvent}>
			{#each $eventRegistrationQuery?.data?.eventRegistrations ?? [] as { event, id } (id)}
				<Label for={`event-registration-${id}`} class="overflow-visible">
					<RadioGroup.Item id={`event-registration-${id}`} value={event.id} class="sr-only" />
					<Card.Root
						class={[
							event.id === selectedEvent &&
								'bg-muted outline-black outline-2 outline outline-offset-1'
						]}
					>
						<Card.Header>
							<Card.Title>{event.name}</Card.Title>
							<Card.Description>{event.location}</Card.Description>
						</Card.Header>
					</Card.Root>
				</Label>
			{/each}
		</RadioGroup.Root>
	</ScrollArea>

	{@render children()}
</section>
