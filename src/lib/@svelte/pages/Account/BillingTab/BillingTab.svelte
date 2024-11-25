<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { BillingAddressCard, Input, Modal } from '$lib/@svelte/components';
	import { FilledCheckIcon } from '$lib/@svelte/icons';
	import CrossIcon from '$lib/@svelte/icons/CrossIcon.svelte';
	import { Button } from '@/components/ui/button';

	const billingAddresses = [{ isDefault: true }, { isDefault: false }, { isDefault: true }];
	let isAddAddressModalOpen = false;

	const handleAddBillingAddress = () => {
		isAddAddressModalOpen = false;
		toast.success($_('user-pages.accounts.billingAddressAddedSuccessfully'));
	};
</script>

<div>
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">{$_('user-pages.accounts.billings')}</h2>
		<h4 class=" text-stone-500 text-sm">{$_('user-pages.accounts.billingsSubHeading')}</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-y-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.companyName')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.companyName')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.streetHouseNo')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.streetHouseNo')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.postalCodeCity')}
			</div>
			<div class="col-span-3">
				<div class="col-span-3 grid grid-cols-2 gap-4">
					<Input placeholder={$_('user-pages.accounts.postalCode')} />
					<Input placeholder={$_('user-pages.accounts.city')} />
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.buildingOptional')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.building')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.salesTaxIDOptional')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.saleTaxID')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.orderIDReferenceID')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.orderIDReferenceID')} />
			</div>
		</div>
	</section>
	<section class=" w-full mt-10">
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.accounts.billingAddress')}
		</h2>
		<h4 class=" text-stone-500 text-sm">{$_('user-pages.accounts.billingsSubHeading')}</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.billingAddress')}
			</div>
			<div class="col-span-3 flex flex-col">
				{#each billingAddresses as { isDefault }, index (index)}
					<BillingAddressCard {isDefault} />
				{/each}
			</div>
		</div>
	</section>
	<footer>
		<div class=" flex justify-between items-center my-6 pb-6">
			<Button variant="gradient" on:click={() => (isAddAddressModalOpen = true)}
				>{$_('user-pages.accounts.addBillingAddress')}</Button
			>
			<div class=" flex justify-between items-center">
				<Button variant="secondary" on:click={() => goto('/dashboard')} class=" mr-8"
					>{$_('common.cancel')}</Button
				>
				<Button variant="gradient" on:click={() => goto('/dashboard')}>{$_('common.save')}</Button>
			</div>
		</div>
	</footer>
</div>
<Modal bind:isOpen={isAddAddressModalOpen}>
	<div class=" flex flex-col justify-center items-center w-full">
		<div class="mb-6 w-full">
			<div class="mb-6 flex justify-between items-center">
				<h2 class=" text-stone-800 font-extrabold text-xl">
					{$_('user-pages.accounts.newAddress')}
				</h2>
				<button on:click={() => (isAddAddressModalOpen = false)}><CrossIcon /></button>
			</div>
			<div class=" grid grid-cols-1 gap-6">
				<Input label={$_('user-pages.accounts.companyName')} />
				<Input label={$_('user-pages.accounts.streetHouseNo')} />
				<div class=" grid grid-cols-2 gap-x-4">
					<Input label={$_('user-pages.accounts.state')} />
					<Input label={$_('user-pages.accounts.postalCode')} />
				</div>
				<Input label={$_('user-pages.accounts.buildingOptional')} />
				<Input label={$_('user-pages.accounts.salesTaxIDOptional')} />
			</div>
		</div>
	</div>
	<footer class=" flex items-center justify-end">
		<Button variant="secondary" class="mr-2" on:click={() => (isAddAddressModalOpen = false)}
			>{$_('common.cancel')}</Button
		>
		<Button variant="gradient" on:click={handleAddBillingAddress}
			>{$_('user-pages.accounts.addAddress')}</Button
		>
	</footer>
</Modal>
