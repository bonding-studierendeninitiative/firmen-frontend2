<script lang="ts">
	import { EditBuyOptionsV2 } from '@/@svelte/modules/EditBuyOptions';
	import { AddonPackage } from '@/@svelte/components';
	import { CreateAddonPackage } from '@/@svelte/modules/CreateAddonPackage';
	import { _ } from '@services';
	import { Separator } from '@/components/ui/separator';
	import { LoaderCircle } from '@lucide/svelte';
	import {
		createAddonPackage,
		createAddonPackageForm,
		deleteAddonPackage,
		getAddonPackages,
		getBuyOption,
		updateBuyOption,
		updateBuyOptionForm
	} from '@/trpc/routers/admin';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let addonPackageFilter = $derived({
		eventId: page.params.id!,
		buyOptionId: page.params.buyOptionId!,
		page: 0,
		limit: 6
	});
</script>

<div class="flex flex-col gap-y-2 justify-center @container p-6 rounded-xl border">
	{#if updateBuyOptionForm(addonPackageFilter).loading}
		<LoaderCircle class="size-12 animate-spin mx-auto" />
	{:else if updateBuyOptionForm(addonPackageFilter).ready}
		<EditBuyOptionsV2
			form={updateBuyOptionForm(addonPackageFilter).current!}
			onUpdateBuyOption={async ({ submit }) => {
				await submit().updates(getBuyOption(addonPackageFilter));
			}}
		/>
	{/if}
	<Separator class="-mx-6 w-auto" />
	<div class="py-6 space-y-6 w-full">
		<h3 class="font-semibold text-lg">{$_('admin-pages.events.buy-options.addons')}</h3>
		{#if getAddonPackages(addonPackageFilter).loading}
			<LoaderCircle class="size-12 animate-spin mx-auto" />
		{:else if getAddonPackages(addonPackageFilter).ready}
			{#if Number(getAddonPackages(addonPackageFilter).current?.addonPackages?.length) > 0}
				<div class="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-4 w-full">
					{#each getAddonPackages(addonPackageFilter).current?.addonPackages ?? [] as addonPackage (addonPackage.id)}
						<AddonPackage
							{addonPackage}
							onDelete={async () => {
								await deleteAddonPackage({
									addonPackageId: addonPackage.id
								}).updates(
									getAddonPackages(addonPackageFilter).withOverride((prev) => {
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
		{#if createAddonPackageForm(addonPackageFilter).loading}
			<LoaderCircle class="size-12 animate-spin mx-auto" />
		{:else if createAddonPackageForm(addonPackageFilter).ready}
			<CreateAddonPackage
				createAddonPackageForm={createAddonPackageForm(addonPackageFilter).current!}
				onCreateAddonPackage={async ({ submit, form, data }) => {
					await submit().updates(
						getAddonPackages(addonPackageFilter).withOverride((prev) => {
							return {
								...prev,
								addonPackages: [
									createAddonPackage.result?.data?.savedAddonPackage!,
									...(prev.addonPackages ?? [])
								],
								totalElements: Number(prev.totalElements) + 1
							};
						})
					);
					const result = createAddonPackage.result;
					if (result?.success !== undefined && result.success && result?.data !== undefined) {
						toast.success($_('modules.create-buy-option.success'));
						await goto(
							`/admin/events/${page.params.id!}/buy-options/${result.data.savedAddonPackage?.id}`
						);
						form.reset();
						await createAddonPackageForm(addonPackageFilter).refresh();
					} else {
						toast.error($_('modules.create-buy-option.error'));
						throw new Error('Could not create buy option');
					}
				}}
			/>
		{/if}
	</div>
</div>
