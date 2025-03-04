<script lang="ts">
	import { _ } from '@services';
	import { Archive, Globe, Shield } from 'lucide-svelte';
	import * as Card from '@/components/ui/card';
	import

	{
		Skeleton
	} from '@/components/ui/skeleton';
	import { Link } from '@/@svelte/components';

	export let data;
</script>

<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('admin-pages.dashboard.dashboard')}</h1>

<main class="grid grid-cols-1 gap-4 lg:grid-cols-12">
	<Card.Root class="col-span-12 lg:col-span-6">
		<Card.Header>
			<Card.Title class="text-stone-950 text-xl font-extrabold">{$_('admin-pages.dashboard.events')}</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="flex items-baseline flex-nowrap gap-2 flex-row">
				<Globe class="w-5 text-muted-foreground" />
				{#await data.publishedEvents}
					<Skeleton class="w-6 h-12 text-muted-foreground" />
				{:then publishedEvents}
					<span class="text-3xl font-semibold">{publishedEvents?.length}</span>
				{:catch error}
					<span class="text-3xl font-semibold">NaN</span>
				{/await}
				<span>veröffentlicht</span>
			</div>
			<div class="flex items-center flex-nowrap gap-2 flex-row">
				<Shield class="w-5 text-muted-foreground" />
				{#await data.unpublishedEvents}
					<Skeleton class="w-6 h-12 text-muted-foreground" />
				{:then unpublishedEvents}
					<span class="text-3xl font-semibold">{unpublishedEvents?.length}</span>
				{:catch error}
					<span class="text-3xl font-semibold">NaN</span>
				{/await}
				<span>unveröffentlicht</span>
			</div>
			<div class="flex items-center flex-nowrap gap-2 flex-row">
				<Archive class="w-5 text-muted-foreground" />
				{#await data.archivedEvents}
					<Skeleton class="w-6 h-12 text-muted-foreground" />
				{:then archivedEvents}
					<span class="text-3xl font-semibold">{archivedEvents?.length}</span>
				{:catch error}
					<span class="text-3xl font-semibold">NaN</span>
				{/await}
				<span>archiviert</span>
			</div>
		</Card.Content>
		<Card.Footer>
			<Link href="/admin/events">&rarr; Zu den Veranstaltungen</Link>
		</Card.Footer>
	</Card.Root>
</main>