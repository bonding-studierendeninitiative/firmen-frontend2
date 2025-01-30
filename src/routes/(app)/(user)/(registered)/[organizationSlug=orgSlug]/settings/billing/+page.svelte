<script lang="ts">
	import { _ } from '@services';
	import { BillingAddressCard } from '$lib/@svelte/components';
	import type { PageServerData } from './$types';
	import { AddBillingAddressTemplate } from '@/@svelte/modules';

	export let data: PageServerData;
	$: billingAddresses = data.billingAddressTemplates;
	let organization = data.organization;
	let deleteBillingAddressTemplateForm = data.deleteBillingAddressTemplateForm;
	let makeBillingAddressTemplateDefaultForm = data.makeBillingAddressTemplateDefaultForm;
	let createBillingAddressTemplateForm = data.createBillingAddressTemplateForm;

</script>

<div>
	<div class="grid grid-cols-3 gap-6 @container">
		<section class=" w-full col-span-3 @3xl:col-span-1">
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.settings.billingAddress')}
			</h2>
			<h4 class=" text-stone-500 text-sm">{$_('user-pages.settings.billingsSubHeading')}</h4>
		</section>
		<section class="flex flex-col @3xl:col-span-2 col-span-3">
			{#each (billingAddresses ?? []).filter(Boolean) as billingAddress, index (index)}
				<BillingAddressCard {makeBillingAddressTemplateDefaultForm} {deleteBillingAddressTemplateForm}
														{billingAddress}
														isDefault={billingAddress.id === organization?.defaultBillingAddressId} />
			{/each}
			<div class=" flex justify-between items-center my-6 pb-6">
				<AddBillingAddressTemplate {createBillingAddressTemplateForm} />
			</div>
		</section>
	</div>
</div>
