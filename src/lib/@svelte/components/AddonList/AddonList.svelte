<script lang="ts">
	import Chip from '../Chip/Chip.svelte';
	import { Checkbox } from '@/components/ui/checkbox/index.js';
	import { Label } from '@/components/ui/label/index.js';
	import { CircleCheck } from 'lucide-svelte';
	import type { GetAddonPackageTemplateResponse } from '@schema';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import type { InferOutput } from 'valibot';
	import { number, _ } from '@services/i18n';
	import { onMount } from 'svelte';

	export let addons: InferOutput<GetAddonPackageTemplateResponse>[] = [];
	export let selectedAddonPackages: string[] = [];
	export let selectedAddons: string[] = [];

	onMount(async () => {
		for (const addonPackage of addons) {
			if (selectedAddonPackages.includes(addonPackage.id)) {
				for (const addon of addonPackage.addons) {
					if (!selectedAddons.includes(addon.id)) {
						selectedAddons = [...selectedAddons, addon.id];
					}
				}
			}
		}
	});

	function handleAddonPackageChecked(id: string) {
		if (selectedAddonPackages.includes(id)) {
			// so the package was checked and was now clicked on

			// find the addon package using the id
			const addonPackage = addons.filter(Boolean).find((addonPackage) => addonPackage.id === id);
			if (!addonPackage) return;

			// remove the addon package from the selected array
			selectedAddonPackages = selectedAddonPackages.filter((i) => i !== id);

			addonPackage.addons.forEach((addon) => {
				if (selectedAddons.includes(addon.id)) {
					// remove the addon packages addons from top array
					selectedAddons = selectedAddons.filter((i) => i !== addon.id);
				}
			});
		} else {
			// add the package to the selected array
			selectedAddonPackages = [...selectedAddonPackages, id];

			// find the addonPackage
			const addonPackage = addons.find((addon) => addon.id === id);
			if (!addonPackage) return;

			addonPackage.addons.forEach((addon) => {
				if (!selectedAddons.includes(addon.id)) {
					// add the addon packages addons from top array
					selectedAddons = [...selectedAddons, addon.id];
				}
			});
		}
	}

	function handleAddonCheck(id: string) {
		if (selectedAddons.includes(id)) {
			selectedAddons = selectedAddons.filter((i) => i !== id);
		} else {
			selectedAddons = [...selectedAddons, id];
		}
	}
</script>

<div class=" border border-stone-200 w-full rounded-lg mt-6 p-4 space-y-4">
	<span>{$_("admin-pages.events.event-registrations.purchased-addons")}</span>
	<!-- marketingServices -->
	{#each addons as addonPackage}
		{@const checkedPKG = selectedAddonPackages.includes(addonPackage.id)}
		<div class="">
			<div class="flex justify-between items-center align-middle">
				<div class=" flex items-center align-middle">
					<div class="flex items-center space-x-2">
						{#if addonPackage.purchasable}
							<Checkbox
								id={addonPackage.id}
								aria-labelledby="terms-label"
								checked={checkedPKG}
								onCheckedChange={() => {
											handleAddonPackageChecked(addonPackage.id);
										}}
							/>
						{/if}
						<Label
							for={addonPackage.id}
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{#if addonPackage.description && addonPackage.description !== ''}
								<HoverCard.Root closeDelay={0} openDelay={0}>
									<HoverCard.Trigger>{addonPackage.title}</HoverCard.Trigger>
									<HoverCard.Content side="right" sideOffset={10} align="center">
										<div class="text-sm">{addonPackage.description}</div>
									</HoverCard.Content>
								</HoverCard.Root>
							{:else}
								{addonPackage.title}
							{/if}
						</Label>
					</div>

					{#if addonPackage.label && addonPackage.label !== ''}
						<Chip variant="brand" classes="ml-2" status={addonPackage.label} />
					{/if}
				</div>
				{#if addonPackage.purchasable}
					<p class=" text-sm font-stone-800 font-extrabold">
						{$number((checkedPKG? addonPackage.price ?? 0 : 0) / 100, {
							style: 'currency',
							currency: 'EUR',
							currencyDisplay: 'code'
						})}
					</p>
				{/if}
			</div>
			{#each addonPackage.addons as addon}
				{@const checkedAddon = selectedAddons.includes(addon.id)}
				<div class=" px-3 py-1 flex items-center justify-between ml-8">
					<div class="flex items-center space-x-2">
						{#if checkedPKG}
							<CircleCheck class="h-4 w-4" />
						{:else}
							<Checkbox
								id={addon.id}
								aria-labelledby="terms-label"
								checked={checkedAddon}
								onCheckedChange={() => {
											handleAddonCheck(addon.id);
										}}
							/>
						{/if}
						<Label
							for={addon.id}
							class="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{#if addon.description && addon.description !== ''}
								<HoverCard.Root closeDelay={0} openDelay={0}>
									<HoverCard.Trigger>{addon.title}</HoverCard.Trigger>
									<HoverCard.Content side="right" sideOffset={10} align="center">
										<div class="text-sm">{addon.description}</div>
									</HoverCard.Content>
								</HoverCard.Root>
							{:else}
								{addon.title}
							{/if}
						</Label>
					</div>
					<p class=" text-sm font-stone-800 font-medium">
						{checkedPKG
							? 'included'
							: $number((checkedAddon ? addon.price ?? 0 : 0) / 100, {
								style: 'currency',
								currency: 'EUR',
								currencyDisplay: 'code'
							})}
					</p>
				</div>
			{/each}
		</div>
	{/each}
</div>