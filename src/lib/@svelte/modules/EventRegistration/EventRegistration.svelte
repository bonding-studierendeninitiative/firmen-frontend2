<script lang="ts">
	import type { InferOutput } from 'valibot';
	import type { EventRegistration } from '@schema';
	import { AddonList } from '@/@svelte/components';
	import Organization from './Organization.svelte';
	import ContactPerson from './ContactPerson.svelte';
	import Package from './Package.svelte';

	export let eventRegistration: InferOutput<EventRegistration>;
</script>

<section {...$$props}>
	<div class=" grid grid-cols-1 gap-4">
		<Organization organization={eventRegistration.organization} />
		<ContactPerson contactPerson={eventRegistration.contactPerson} />
		{#if eventRegistration.organizationComment }
			<div>{eventRegistration.organizationComment}</div>
		{/if}
		{#if eventRegistration.participationNote }
			<div class="rounded-md border p-4">{eventRegistration.participationNote}</div>
		{/if}
		<Package _package={eventRegistration.purchasedPackage} />
	</div>

	<AddonList addons={eventRegistration.addonPackages} />
</section>
