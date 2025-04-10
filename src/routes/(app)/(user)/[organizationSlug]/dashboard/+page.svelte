<script lang="ts">
	import { _ } from '@services';
	import { NoDataFound } from '@/@svelte/components';
	import type { PageData } from './$types';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import RegistrationCard from './registration-card.svelte';

	export let data: PageData;

</script>

<div>

	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.dashboard.dashboard')}</h1>
	<h4 class=" text-stone-500">
		{$_('user-pages.dashboard.subHeading', {
			values: {
				name: data.user?.fullName ?? data.user?.firstName + " " + data.user?.lastName
			}
		})}
	</h4>

	<section class=" mt-10">
		<div class=" flex justify-between items-center w-full mb-4">
			<h2 class=" text-stone-950 font-extrabold text-2xl mb-4">
				{$_('user-pages.dashboard.registeredEvents')}
			</h2>
		</div>
		{#await data.dashboardData}
			<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
		{:then dashboardData}
			<div in:fade class="mt-2 @container/registrations">
				{#if dashboardData?.eventRegistrations?.eventRegistrations?.length > 0 }
					<div class="grid grid-cols-1 @4xl/registrations:grid-cols-2 gap-8 items-start">
					{#each dashboardData?.eventRegistrations?.eventRegistrations as eventRegistration, index}
						<RegistrationCard registration={eventRegistration}
						/>
					{/each}
					</div>
				{:else }
					<NoDataFound
						heading={$_('user-pages.dashboard.noEventsRegistered')}
						subHeading={$_('user-pages.dashboard.noEventsRegisteredDetail')}
						buttonText={$_('common.viewEvents')}
						onButtonClick={()=> {}}
					/>
				{/if}
			</div>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</section>
</div>
