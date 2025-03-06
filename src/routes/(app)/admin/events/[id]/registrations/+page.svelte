<script lang="ts">
	import type { PageServerData } from './$types';
	import { _ } from '@services';
	import { NoDataFound, Modal, Select } from '@/@svelte/components';
	import toast from 'svelte-french-toast';
	import DataTable from './data-table.svelte';
	import { Button } from '@/components/ui/button';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data: PageServerData;

	$: ({ rejectForm, confirmForm, reviewCatalogueDataForm, exportCatalogueDataForm, createRegistrationForm } = data);

	let confirmFormStore = writable(confirmForm);
	let rejectFormStore = writable(rejectForm);
	let reviewCatalogueDataFormStore = writable(reviewCatalogueDataForm);
	let exportCatalogueDataFormStore = writable(exportCatalogueDataForm);
	let createRegistrationFormStore = writable(createRegistrationForm);
	$: {
		confirmFormStore.set(confirmForm);
		rejectFormStore.set(rejectForm);
		reviewCatalogueDataFormStore.set(reviewCatalogueDataForm);
		exportCatalogueDataFormStore.set(exportCatalogueDataForm);
		createRegistrationFormStore.set(createRegistrationForm);
	}

	setContext('confirmForm', confirmFormStore);
	setContext('rejectForm', rejectFormStore);
	setContext('reviewCatalogueDataForm', reviewCatalogueDataFormStore);
	setContext('exportCatalogueDataForm', exportCatalogueDataFormStore);
	setContext('createRegistrationForm', createRegistrationFormStore);

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

	{#await data.tableData}
		<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
	{:then data}
<section in:fade class=" mt-6">
		{#if !data?.eventRegistrations}
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
					addons={data?.addons}
					data={data?.eventRegistrations}
					addonPackages={data?.addonPackages}
					status={data?.status}
					packages={data?.packages}
				/>
			</section>
		{/if}
</section>
	{:catch error}
		<p>{error.message}</p>
	{/await}
<!--<SuperDebug data={page} />-->
