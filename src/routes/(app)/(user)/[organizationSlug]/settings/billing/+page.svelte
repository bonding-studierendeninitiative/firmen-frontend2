<script lang="ts">
	import { _ } from '@services';
	import { BillingAddressCard } from '@/@svelte/components';
	import type { PageServerData } from './$types';
	import { AddBillingAddressTemplate } from '@/@svelte/modules';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data: PageServerData;
</script>

<div>
	<div class="grid grid-cols-3 gap-6 @container">
		<section class=" w-full col-span-3 @3xl:col-span-1">
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.settings.billingAddress')}
			</h2>
			<h4 class=" text-stone-500 text-sm">{$_('user-pages.settings.billingsSubHeading')}</h4>
		</section>
		{#await data.pageData}
			<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
		{:then { makeBillingAddressTemplateDefaultForm, deleteBillingAddressTemplateForm, createBillingAddressTemplateForm, billingAddressTemplates, organization }}
			<section in:fade class="flex flex-col @3xl:col-span-2 col-span-3">
				{#each (billingAddressTemplates ?? []).filter(Boolean) as billingAddress, index (index)}
					<BillingAddressCard {makeBillingAddressTemplateDefaultForm}
															{deleteBillingAddressTemplateForm}
															{billingAddress}
															isDefault={billingAddress.id === organization?.publicMetadata?.defaultBillingAddressTemplateId} />
				{/each}
				<div class=" flex justify-between items-center my-6 pb-6">
					<AddBillingAddressTemplate {createBillingAddressTemplateForm} />
				</div>
			</section>
		{:catch error}
			<div class="text-red-500">{error}</div>
		{/await}
	</div>
</div>
