<script lang="ts">
	import { EditBuyOptionsV2 } from '@/@svelte/modules/EditBuyOptions';
	import { AddonPackage } from '@/@svelte/components';
	import { CreateAddonPackage } from '@/@svelte/modules/CreateAddonPackage';
	import { _ } from '@services';
	import { Separator } from '@/components/ui/separator';
	import { LoaderCircle } from '@lucide/svelte';
	import { deleteAddonPackage, getAddonPackages, getBuyOption } from '@/remote/functions/admin';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { Button } from '@/components/ui/button';

	let addonPackageFilter = $derived({
		eventId: page.params.id!,
		buyOptionId: page.params.buyOptionId!,
		page: 0,
		limit: 6
	});

	let getBuyOptionQuery = $derived(getBuyOption(addonPackageFilter));
	let getAddonPackagesQuery = $derived(getAddonPackages(addonPackageFilter));
</script>

<div class="flex flex-col gap-y-2 justify-center @container p-6 rounded-xl border">
	{#if getBuyOptionQuery.loading}
		<LoaderCircle class="size-12 animate-spin mx-auto" />
	{:else if getBuyOptionQuery.ready}
		<EditBuyOptionsV2 data={getBuyOptionQuery.current} />
	{/if}
	<Separator class="-mx-6 w-auto" />
	<div class="py-6 space-y-6 w-full">
		<h3 class="font-semibold text-lg">{$_('admin-pages.events.buy-options.addons')}</h3>
		{#if getAddonPackagesQuery.loading}
			<LoaderCircle class="size-12 animate-spin mx-auto" />
		{:else if getAddonPackagesQuery.ready}
			{#if Number(getAddonPackagesQuery.current?.addonPackages?.length) > 0}
				<div class="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-4 w-full">
					{#each getAddonPackagesQuery.current?.addonPackages ?? [] as addonPackage (addonPackage.id)}
						<AddonPackage
							{addonPackage}
							onDelete={async () => {
								await deleteAddonPackage({
									addonPackageId: addonPackage.id
								}).updates(
									getAddonPackagesQuery.withOverride((prev) => {
										return {
											...prev,
											addonPackages: prev.addonPackages?.filter((ap) => ap.id !== addonPackage.id),
											totalElements: Number(prev.totalElements) - 1
										};
									})
								);
							}}
						/>
					{/each}
				</div>
			{:else}
				<p>{$_('admin-pages.events.buy-options.no-addon-packages')}</p>
			{/if}
		{/if}
		<svelte:boundary
			onerror={(e) => {
				toast.error(e?.message);
				console.error(e);
			}}
		>
			{#snippet failed(error, reset)}
				<Button variant="outline" onclick={reset} class="mx-auto">
					{$_('common.reset')}
				</Button>
			{/snippet}
			<CreateAddonPackage
				onCreateAddonPackage={async ({ submit, form, data }) => {
					await submit().updates(
						getAddonPackagesQuery.withOverride((prev) => {
							return {
								...prev,
								addonPackages: [
									{
										...data.addonPackage,
										id: 'temp-id',
										purchasable: data.addonPackage.purchasable === 'true' ? true : false,
										price:
											data.addonPackage.purchasable === 'true'
												? Number(data.addonPackage.price)
												: 0,
										addons: data.addonPackage.addons?.map((addon) => ({
											...addon,
											id: 'temp-id-' + Math.random().toString(36).substring(2, 15),
											price: Number(addon.price)
										}))
									},
									...(prev.addonPackages ?? [])
								],
								totalElements: Number(prev.totalElements) + 1
							};
						})
					);
					/*const result = createAddonPackage.result;
						if (result?.data !== undefined) {
							toast.success($_('modules.create-buy-option.success'));
							form.reset();
						} else {
							toast.error($_('modules.create-buy-option.error'));
							console.error(result);
							throw new Error('Could not create addon package');
						}*/
				}}
			/>
		</svelte:boundary>
	</div>
</div>
