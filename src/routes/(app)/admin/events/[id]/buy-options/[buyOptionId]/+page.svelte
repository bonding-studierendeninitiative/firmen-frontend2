<script lang="ts">
	import { EditBuyOptions } from '@/@svelte/modules/EditBuyOptions';
	import type { PageServerData } from './$types';
	import { AddonPackage } from '@/@svelte/components';
	import { CreateAddonPackage } from '@/@svelte/modules/CreateAddonPackage';

	export let data: PageServerData;
</script>

<div class="flex flex-col gap-6 justify-center @container">
	<EditBuyOptions form={data.updateForm} />

	<div class="p-6 border rounded-xl flex flex-col gap-y-6 w-full">
		<h3 class="font-semibold text-lg">Add-ons</h3>
		{#if data.addonPackages}
			<div class="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-4 w-full">
				{#each data.addonPackages as addonPackage}
					<AddonPackage {addonPackage} />
				{/each}
			</div>
		{:else}
			<p>No addon packages</p>
		{/if}
		<CreateAddonPackage createAddonPackageForm={data.createAddonPackageForm} />
	</div>
</div>
