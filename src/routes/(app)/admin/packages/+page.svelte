<script lang="ts">
	import { _ } from '@services';
	import { GradientButton, Link, Table } from '$lib/@svelte/components';
	import { AddNewPackage } from '$lib/@svelte/modules';

	const columns = ['packageName', 'price', ''];

	const packagesList = [
		{
			name: 'Light Package',
			price: '€850'
		},
		{
			name: 'Standard Package',
			price: '€850'
		},
		{
			name: 'Premium Package',
			price: '€850'
		}
	];
	let isDrawerOpen: boolean = false;
</script>

<section>
	<div class=" flex justify-between items-center">
		<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('common.packages')}</h1>
		<div>
			<GradientButton onClick={() => (isDrawerOpen = true)}
				>{$_('admin-pages.packages.addPackage')}</GradientButton
			>
		</div>
	</div>
</section>

<section class=" mt-10">
	<Table totalRecords={9} {columns}>
		{#each packagesList as { name, price }, index}
			<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
				<td class=" px-6 py-4 text-grey-900 text-sm">{name}</td>
				<td class=" px-6 py-4 text-grey-900 text-sm font-extrabold">{price}</td>
				<td class=" px-6 py-4 text-grey-500 text-sm text-end"><Link>{$_('common.edit')}</Link></td>
			</tr>
		{/each}
	</Table>
</section>
<AddNewPackage bind:isOpen={isDrawerOpen} />
