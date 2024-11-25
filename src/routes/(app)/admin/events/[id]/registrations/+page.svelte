<script lang="ts">
	import type { PageServerData } from './$types';
	import { _ } from '@services';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { NoDataFound, Modal } from '$lib/@svelte/components';
	import Select from '$lib/@svelte/components/Select/Select.svelte';
	import toast from 'svelte-french-toast';
	import dayjs from 'dayjs';
	import DataTable from './data-table.svelte';
	import { Button } from '@/components/ui/button';
	import SuperDebug from 'sveltekit-superforms';

	dayjs.extend(relativeTime);

	export let data: PageServerData;

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
	{#if !data.eventRegistrations}
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
				addons={data.addons}
				addonPackages={data.addonPackages}
				status={data.status}
				packages={data.packages}
				data={data.eventRegistrations}
				confirmForm={data.confirmForm}
				rejectForm={data.rejectForm}
			/>
		</section>
	{/if}
</section>
<SuperDebug {data} />
