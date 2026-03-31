<script lang="ts">
	import { _ } from '@services';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import {
		deleteBillingAddressTemplate,
		getBillingAddressTemplates,
		getDetails,
		makeBillingAddressTemplateDefault
	} from '@/remote/functions';
	import AddBillingAddressTemplate from './add-billing-address-template.svelte';
	import BillingAddressItem from './billing-address-item.svelte';
	import * as Item from '@/components/ui/item';

	let { params } = $props();

	let billingAddressTemplatesQuery = getBillingAddressTemplates({
		page: '0',
		limit: '10'
	});

	let orgQuery = getDetails({
		slug: params.organizationSlug
	});
</script>

<div>
	<div class="grid grid-cols-3 gap-6 @container">
		<section class=" w-full col-span-3 @3xl:col-span-1">
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.settings.billingAddress')}
			</h2>
			<h4 class=" text-stone-500 text-sm">{$_('user-pages.settings.billingsSubHeading')}</h4>
		</section>
		{#if billingAddressTemplatesQuery.loading}
			<LoaderCircle class="size-10 mx-auto animate-spin" />
		{:else if billingAddressTemplatesQuery.ready}
			<section in:fade class="flex flex-col @3xl:col-span-2 col-span-3">
				<Item.Group class="gap-4">
					{#each (billingAddressTemplatesQuery.current.billingAddressTemplates ?? []).filter(Boolean) as billingAddress, index (index)}
						<BillingAddressItem
							{billingAddress}
							isDefault={billingAddress.id ===
								JSON.parse(orgQuery?.current?.metadata)?.public?.defaultBillingAddressTemplateId}
							makeBillingAddressTemplateDefault={async (args) => {
								await makeBillingAddressTemplateDefault(args).updates(orgQuery);
							}}
							deleteBillingAddressTemplate={async (args) => {
								await deleteBillingAddressTemplate(args).updates(billingAddressTemplatesQuery);
							}}
						/>
					{/each}
				</Item.Group>
				<div class=" flex justify-between items-center my-6 pb-6">
					<AddBillingAddressTemplate organizationId={orgQuery?.current?.id || ''} />
				</div>
			</section>
		{:else if billingAddressTemplatesQuery.error}
			<div class="text-red-500">{billingAddressTemplatesQuery.error}</div>
		{/if}
	</div>
</div>
