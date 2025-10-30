<script lang="ts">
	import { _ } from '@services';
	import { getContext } from 'svelte';
	import BuyOptionPackages from './buy-option-packages.svelte';
	import BuyOptionServices from './buy-option-services.svelte';
	import BuyOptionBenefits from './buy-option-benefits.svelte';
	import type { RemoteQuery } from '@sveltejs/kit';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import { moveBuyOptionPackage, moveBuyOptionService } from '@/remote/functions/admin';

	let { params } = $props();
	let eventId = params.id;
	let buyOptionId = params.buyOptionId;

	// Use the shared query instance from the layout
	let getBuyOptionQuery = getContext<RemoteQuery<GetEventBuyOptionOutput>>('sharedBuyOptionQuery');
</script>

<div class="@container/buy-option-editor grid grid-cols-2 gap-6">
	<div class="col-span-2 space-y-1">
		<h2 class="text-2xl font-semibold">{$_('components.editBuyOptions.buyOptionEditor')}</h2>
		<p class="text-muted-foreground">{$_('components.editBuyOptions.editorDescription')}</p>
	</div>

	{#if getBuyOptionQuery.loading}
		<div class="col-span-2">
			<p class="text-center text-muted-foreground">{$_('common.loading')}...</p>
		</div>
	{/if}

	{#if getBuyOptionQuery.ready && getBuyOptionQuery.current}
		{@const data = getBuyOptionQuery.current}

		<BuyOptionPackages
			{eventId}
			{buyOptionId}
			{getBuyOptionQuery}
			version={data.version!}
			packages={data.packages!}
			movePackage={async (packageId, direction, version) => {
				await moveBuyOptionPackage({
					eventId,
					buyOptionId,
					packageId,
					direction,
					version
				}).updates(
					getBuyOptionQuery.withOverride((prev) => {
						// Simple re-fetch logic; in a real app, you might want to implement more complex state updates
						return {
							...prev,
							packages: prev.packages
								? (() => {
										const index = prev.packages.findIndex((pkg) => pkg.id === packageId);
										if (index === -1) return prev.packages;

										const newPackages = [...prev.packages];
										const [movedPackage] = newPackages.splice(index, 1);
										const newIndex =
											direction === 'up'
												? Math.max(0, index - 1)
												: Math.min(newPackages.length, index + 1);
										newPackages.splice(newIndex, 0, movedPackage);
										return newPackages;
									})()
								: [],
							version: (prev.version ?? 0) + 1
						};
					})
				);
			}}
		/>

		<BuyOptionServices
			{eventId}
			{buyOptionId}
			version={data.version!}
			services={data.services!}
			{getBuyOptionQuery}
			moveService={async (serviceId, direction, version) => {
				await moveBuyOptionService({
					eventId,
					buyOptionId,
					serviceId,
					direction,
					version
				}).updates(
					getBuyOptionQuery.withOverride((prev) => {
						// Simple re-fetch logic; in a real app, you might want to implement more complex state updates
						return {
							...prev,
							services: prev.services
								? (() => {
										const index = prev.services.findIndex((svc) => svc.id === serviceId);
										if (index === -1) return prev.services;

										const newServices = [...prev.services];
										const [movedService] = newServices.splice(index, 1);
										const newIndex =
											direction === 'up'
												? Math.max(0, index - 1)
												: Math.min(newServices.length, index + 1);
										newServices.splice(newIndex, 0, movedService);
										return newServices;
									})()
								: [],
							version: (prev.version ?? 0) + 1
						};
					})
				);
			}}
		/>

		<BuyOptionBenefits
			{eventId}
			{buyOptionId}
			version={data.version!}
			services={data.services!}
			packages={data.packages!}
			benefits={data.benefits!}
			{getBuyOptionQuery}
		/>
	{/if}
</div>
