<script lang="ts">
	import { _ } from '@services';
	import { NoDataFound } from '@/@svelte/components';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import RegistrationCard from './registration-card.svelte';
	import { forOrganization as getEventRegistrations } from '@/remote/functions';

	let { data } = $props();

	const params = { limit: 10, orgId: data.orgId, cursor: 0 } as const;
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.dashboard.dashboard')}</h1>
	<h4 class=" text-stone-500">
		{$_('user-pages.dashboard.subHeading', {
			values: {
				name: data.user?.name
			}
		})}
	</h4>

	<section class=" mt-10">
		<div class=" flex justify-between items-center w-full mb-4">
			<h2 class=" text-stone-950 font-extrabold text-2xl mb-4">
				{$_('user-pages.dashboard.registeredEvents')}
			</h2>
		</div>
		{#if getEventRegistrations(params).loading}
			<LoaderCircle class="size-10 mx-auto animate-spin" />
		{:else}
			{@const allEventRegistrations =
				getEventRegistrations(params).current?.eventRegistrations ?? []}
			<div in:fade class="mt-2 @container/registrations">
				{#if allEventRegistrations.length > 0}
					<div class="grid grid-cols-1 @4xl/registrations:grid-cols-2 gap-8 items-start">
						{#each allEventRegistrations as eventRegistration, index}
							<RegistrationCard registration={eventRegistration} />
						{/each}
					</div>
				{:else}
					<NoDataFound
						heading={$_('user-pages.dashboard.noEventsRegistered')}
						subHeading={$_('user-pages.dashboard.noEventsRegisteredDetail')}
						buttonText={$_('common.viewEvents')}
						onButtonClick={() => {}}
					/>
				{/if}
			</div>
		{/if}
	</section>
</div>
