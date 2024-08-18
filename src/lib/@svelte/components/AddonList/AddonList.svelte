<script lang="ts">
	import { _ } from '@services';
	import Chip from '../Chip/Chip.svelte';
	import { Checkbox } from '@/components/ui/checkbox/index.js';
	import { Label } from '@/components/ui/label/index.js';
	import { CircleCheck } from 'lucide-svelte';
	import type { GetAddonPackageTemplateResponse } from '@schema';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import type { InferOutput } from 'valibot';
	type AddonType = 'PACKAGE' | 'SUBPACKAGE';

	import { number } from '@services/i18n';
	import { onMount } from 'svelte';
	export let addons: InferOutput<GetAddonPackageTemplateResponse>[];
	export let selectedAddons: string[];


	let topCheckedSubAddons: string[] = [];

	onMount(async () => {
		for (const addon of addons) {
			if (selectedAddons.includes(addon.id)) {
				for (const subAddon of addon.addons) {
					selectedAddons = selectedAddons.filter((i) => i !== subAddon.id);
					if (!topCheckedSubAddons.includes(subAddon.id)) {
						topCheckedSubAddons = [...topCheckedSubAddons, subAddon.id];
					}
				}
			}
		}

	})

	function handleCheck(id: string, addonType: AddonType) {
		if (selectedAddons.includes(id)) {
			if (addonType === 'PACKAGE') {
				const addon = addons.find(addon => addon.id === id);
				if (!addon) return;

				selectedAddons = selectedAddons.filter((i) => i !== id);

				addon.addons.forEach((subaddon) => {
					selectedAddons = selectedAddons.filter((i) => i !== subaddon.id);

					if (topCheckedSubAddons.includes(subaddon.id)) {
						topCheckedSubAddons = topCheckedSubAddons.filter((i) => i !== subaddon.id);
					}
				});
			} else {
				selectedAddons = selectedAddons.filter((i) => i !== id);
			}

		} else {
			// addon gets selected
			if (addonType === 'PACKAGE') {
				selectedAddons = [...selectedAddons, id];
				const addon = addons.find(addon => addon.id === id);
				if (!addon) return;

				addon.addons.forEach((subaddon) => {
					selectedAddons = selectedAddons.filter((i) => i !== subaddon.id);
					if (!topCheckedSubAddons.includes(subaddon.id)) {
						topCheckedSubAddons = [...topCheckedSubAddons, subaddon.id];
					}
				});
			} else if (addonType === 'SUBPACKAGE') {
				selectedAddons = [...selectedAddons, id];
			}
		}
	}
</script>


<section>
	<h4 class=" font-extrabold text-sm text-stone-900">
		{$_('user-pages.events.additionalMarketingServices')}
	</h4>
	<p class=" mt-2 text-stone-500 font-normal text-sm">
		{$_('user-pages.events.additionalMarketingServicesDescription')}
	</p>
	<div class=" border border-stone-200 w-full rounded-lg mt-6">
		<div>
			<!-- marketingServices -->
			{#each addons as addon}
				{@const checkedPKG = selectedAddons.includes(addon.id)}
				<div class=" border-b border-stone-200 py-3">
					<div class="px-3 flex justify-between items-center align-middle">
						<div class=" flex items-center align-middle">
							<div class="flex items-center space-x-2">
								{#if addon.purchasable}
									<Checkbox id={addon.id} aria-labelledby="terms-label" checked={checkedPKG}
														onCheckedChange={(v) => {handleCheck(addon.id, "PACKAGE")}} />

								{/if}
								<Label
									for={addon.id}
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{#if addon.description && addon.description !== ""}
										<HoverCard.Root closeDelay={0} openDelay={0}>
											<HoverCard.Trigger>{addon.title}</HoverCard.Trigger>
											<HoverCard.Content side="right" sideOffset={10} align="center">
												<div class="text-sm">{addon.description}</div>
											</HoverCard.Content>
										</HoverCard.Root>
									{:else }
										{addon.title}
									{/if}

								</Label>
							</div>

							{#if addon.label && addon.label !== ""}
								<Chip variant="brand" classes="ml-2" status={addon.label} />
							{/if}
						</div>
						{#if addon.purchasable}
							<p class=" text-sm font-stone-800 font-extrabold">{$number((addon.price ?? 0) / 100, {
								style: "currency",
								currency: "EUR",
								currencyDisplay: "code"
							})}</p>
						{/if}
					</div>
					{#each addon.addons as subAddon}
						{@const checkedPKGAddon = selectedAddons.includes(subAddon.id)}
						<div class=" px-3 py-1 flex items-center justify-between ml-8">
							<div class="flex items-center space-x-2">
								{#if topCheckedSubAddons.includes(subAddon.id)}
									<CircleCheck class="h-4 w-4" />
								{:else }
									<Checkbox id={subAddon.id} aria-labelledby="terms-label" checked={checkedPKGAddon}
														onCheckedChange={(v) => {handleCheck(subAddon.id, "SUBPACKAGE")}} />
								{/if}
								<Label
									for={subAddon.id}
									class="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{#if subAddon.description && subAddon.description !== ""}
										<HoverCard.Root closeDelay={0} openDelay={0}>
											<HoverCard.Trigger>{subAddon.title}</HoverCard.Trigger>
											<HoverCard.Content side="right" sideOffset={10} align="center">
												<div class="text-sm">{subAddon.description}</div>
											</HoverCard.Content>
										</HoverCard.Root>
									{:else }
										{subAddon.title}
									{/if}
								</Label>
							</div>
							<p class=" text-sm font-stone-800 font-medium">{$number((subAddon.price ?? 0) / 100, {
								style: "currency",
								currency: "EUR",
								currencyDisplay: "code"
							})}</p>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</section>