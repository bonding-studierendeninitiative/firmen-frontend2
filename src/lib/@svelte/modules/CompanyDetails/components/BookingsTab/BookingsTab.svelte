<script lang="ts">
	import { InfoListItem, NoDataFound } from '$lib/@svelte/components';
	import type { GetEventRegistrationsForOrganizationResponse } from '@schema';
	import type { InferOutput } from 'valibot';
	import { _ } from '@services';


	export let eventRegistrations: InferOutput<GetEventRegistrationsForOrganizationResponse>['eventRegistrations'] = [];
</script>

<section>
	<div class="grid grid-cols-1 gap-8">
		{#if eventRegistrations.length > 0}
			{#each eventRegistrations as { event: { name, location, dateFrom }, id } (id)}
				<InfoListItem heading={name} subHeading={location} date={dateFrom} showButton={false} />
			{/each}
		{:else }
			<NoDataFound heading={$_("admin-pages.organizations.eventRegistrations.none-found")} />
		{/if}
	</div>
</section>
