<script lang="ts">
	import type { PageServerData } from './$types';
	import { _ } from '@services';
	import { NoDataFound, Modal } from '$lib/@svelte/components';
	import Select from '$lib/@svelte/components/Select/Select.svelte';
	import toast from 'svelte-french-toast';
	import DataTable from './data-table.svelte';
	import { Button } from '@/components/ui/button';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';


	export let data: PageServerData;

	$: ({ addons, addonPackages, eventRegistrations, status: someStatus, rejectForm, confirmForm, packages, reviewCatalogueDataForm } = data);

	let tableData = writable(eventRegistrations);
	let confirmFormStore = writable(confirmForm);
	let rejectFormStore = writable(rejectForm);
	let reviewCatalogueDataFormStore = writable(reviewCatalogueDataForm);
	$: {
		tableData.set(eventRegistrations ?? [])
		confirmFormStore.set(confirmForm)
		rejectFormStore.set(rejectForm)
		reviewCatalogueDataFormStore.set(reviewCatalogueDataForm)
	}

	setContext('confirmForm', confirmFormStore);
	setContext('rejectForm', rejectFormStore);
	setContext('reviewCatalogueDataForm', reviewCatalogueDataFormStore);

	let isOpen = false;

	const handleUpdateStatus = () => {
		isOpen = false;
		toast.success('status updated successfully');
	};
</script>

<Modal bind:isOpen>
	<div class=" flex flex-col justify-center items-center">
		<div class=" text-start">
			<h2 class=" text-stone-950 font-extrabold text-base">
				{$_('admin-pages.events.statusUpdate')}
			</h2>
			<p class="mt-2 text-stone-500 text-base">
				{$_('admin-pages.events.statusUpdateText')}
			</p>
		</div>
		<div class="my-6 w-full">
			<Select placeholder={$_('admin-pages.events.updateStatus')}></Select>
		</div>
	</div>
	<footer class=" flex items-center justify-end">
		<Button variant="gradient" class="!py-1.5" on:click={handleUpdateStatus}
		>{$_('common.update')}</Button
		>
	</footer>
</Modal>

<section class=" mt-6">
	{#if !eventRegistrations}
		<section class=" mt-10">
			<NoDataFound
				heading={$_('admin-pages.events.noRegistrationsFound')}
				subHeading={$_('admin-pages.events.noDataToDisplay')}
				buttonText={$_('admin-pages.events.backToEvents')}
			/>
		</section>
	{:else}
		<section class=" mt-10">
			<DataTable
				addons={addons}
				data={tableData}
				addonPackages={addonPackages}
				status={someStatus}
				packages={packages}
			/>
		</section>
	{/if}
</section>
<!--<SuperDebug data={page} />-->
