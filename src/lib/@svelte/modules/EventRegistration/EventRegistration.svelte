<script lang="ts">
	import type { InferOutput } from 'valibot';
	import type { EventRegistration } from '@schema';
	import { AddonList } from '@/@svelte/components';
	import Organization from '@/@svelte/modules/EventRegistration/Organization.svelte';
	import ContactPerson from '@/@svelte/modules/EventRegistration/ContactPerson.svelte';
	import Package from '@/@svelte/modules/EventRegistration/Package.svelte';

	export let eventRegistration: InferOutput<EventRegistration>;
</script>

<section>
	<div class=" grid grid-cols-1 gap-4">
		<Organization organization={eventRegistration.organization} />
		<ContactPerson contactPerson={eventRegistration.contactPerson} />
		<div>{eventRegistration.organizationComment}</div>
		<div>{eventRegistration.participationNote}</div>
		<Package _package={eventRegistration.purchasedPackage} />
	</div>

	<AddonList addons={eventRegistration.addonPackages} />
</section>
