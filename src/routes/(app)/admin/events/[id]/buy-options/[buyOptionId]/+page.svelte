<script lang="ts">
	import { EditBuyOptions } from '@/@svelte/modules/EditBuyOptions';
	import { AddonPackage } from '@/@svelte/components';
	import { CreateAddonPackage } from '@/@svelte/modules/CreateAddonPackage';
	import { _ } from '@services';
	import { Separator } from '@/components/ui/separator';
	import { LoaderCircle } from 'lucide-svelte';

	export let data;
</script>

<div class="flex flex-col gap-y-2 justify-center @container p-6 rounded-xl border">
	{#await data.updateForm}
		<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
	{:then form}
		<EditBuyOptions {form} />
	{:catch error}
		<p>{error.message}</p>
	{/await}
	<Separator class="-mx-6 w-auto" />
	<div class="py-6 space-y-6 w-full">
		<h3 class="font-semibold text-lg">{$_("admin-pages.events.buy-options.addons")}</h3>
		{#await data.addonPackages}
			<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
		{:then addonPackages}
			{#if addonPackages?.length > 0}
				<div class="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-4 w-full">
					{#each addonPackages as addonPackage}
						<AddonPackage {addonPackage} />
					{/each}
				</div>
			{:else}
				<p>{$_("admin-pages.events.buy-options.no-addon-packages")}</p>
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
		{#await data.createAddonPackageForm}
			<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
		{:then form}
			<CreateAddonPackage createAddonPackageForm={form} />
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</div>
