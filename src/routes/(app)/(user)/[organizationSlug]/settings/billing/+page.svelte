<script lang="ts">
	import { _ } from '@services';
	import { BillingAddressCard } from '@/@svelte/components';
	import { AddBillingAddressTemplate } from '@/@svelte/modules';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import {
		deleteBillingAddressTemplate,
		getBillingAddressTemplates,
		getDetails,
		makeBillingAddressTemplateDefault
	} from '@/remote/functions';
	import { page } from '$app/state';

	let billingAddressTemplatesQuery = getBillingAddressTemplates({
		page: '0',
		limit: '10'
	});

	let orgQuery = getDetails({
		slug: page.params.organizationSlug!
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
				{#each (billingAddressTemplatesQuery.current.billingAddressTemplates ?? []).filter(Boolean) as billingAddress, index (index)}
					<BillingAddressCard
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
				<div class=" flex justify-between items-center my-6 pb-6">
					<AddBillingAddressTemplate organizationId={orgQuery?.current?.id || ''} />
				</div>
			</section>
		{:else if billingAddressTemplatesQuery.error}
			<div class="text-red-500">{billingAddressTemplatesQuery.error}</div>
		{/if}
	</div>
</div>
