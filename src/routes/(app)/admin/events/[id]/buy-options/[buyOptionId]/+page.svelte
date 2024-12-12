<script lang="ts">
	import { EditBuyOptions } from '@/@svelte/modules/EditBuyOptions';
	import type { PageServerData } from './$types';
	import { AddonPackage } from '@/@svelte/components';
	import { CreateAddonPackage } from '@/@svelte/modules/CreateAddonPackage';
	import { _ } from '@services';
	import { Separator } from '@/components/ui/separator';

	export let data: PageServerData;
</script>

<div class="flex flex-col gap-6 justify-center @container">
	<EditBuyOptions form={data.updateForm} />
<Separator />
	<div class="py-6 space-y-6 w-full">
		<h3 class="font-semibold text-lg">{$_("admin-pages.events.buy-options.addons")}</h3>
		{#if data.addonPackages}
			<div class="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-4 w-full">
				{#each data.addonPackages as addonPackage}
					<AddonPackage {addonPackage} />
				{/each}
			</div>
		{:else}
			<p>{$_("admin-pages.events.buy-options.no-addon-packages")}</p>
		{/if}
		<CreateAddonPackage createAddonPackageForm={data.createAddonPackageForm} />
	</div>
</div>
