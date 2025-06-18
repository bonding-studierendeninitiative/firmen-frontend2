<script lang="ts">
	import type { InferOutput } from 'valibot';
	import type { EventRegistration, AdminEventRegistrationsResponse } from '@schema';
	import { AddonList, Chip } from '@/@svelte/components';
	import Organization from './Organization.svelte';
	import ContactPerson from './ContactPerson.svelte';
	import Package from './Package.svelte';
	import { dayjs } from '@services/i18n';

	interface Props {
		eventRegistration: InferOutput<AdminEventRegistrationsResponse>['eventRegistrations'][number];
		[key: string]: any
	}

	let { eventRegistration, ...rest }: Props = $props();
</script>

<section {...rest}>
	<div class=" grid grid-cols-1 gap-4">
		<span>{eventRegistration.organizationName}</span>
		<span>Wunschtage</span>
		<div>
			{#each eventRegistration.desiredEventRegistrationDays ?? [] as day}
				{@const date = dayjs(day)}
				<span>{date.format("dd")}</span>
				<span>{date.format("ll")}</span>
			{/each}
		</div>
		{#if eventRegistration.organizationComment}
			<div>{eventRegistration.organizationComment}</div>
		{/if}
		{#if eventRegistration.participationNote}
			<div class="rounded-md border p-4">{eventRegistration.participationNote}</div>
		{/if}
		{#if eventRegistration.purchasedPackage}
			<Package _package={eventRegistration.purchasedPackage} />
		{/if}
	</div>

	<AddonList addons={eventRegistration.addonPackages} />
</section>
