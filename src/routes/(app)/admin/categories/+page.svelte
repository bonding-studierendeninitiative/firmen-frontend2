<script lang="ts">
	import { GradientButton, Link, Table } from '$lib/@svelte/components';
	import { _ } from '@services';
	import { AddCategory } from '$lib/@svelte/modules';

	const columns = ['name', ''];
	let isDrawerOpen = false;
	const categoriesList = [
		{
			name: 'Messe Aachen'
		},
		{
			name: 'Dresden'
		},
		{
			name: 'Tech'
		}
	];
</script>

<section>
	<div class=" flex justify-between items-center">
		<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('common.categories')}</h1>
		<div>
			<GradientButton onClick={() => (isDrawerOpen = true)}
				>{$_('admin-pages.categories.addCategory')}</GradientButton
			>
		</div>
	</div>
</section>

<section class=" mt-10">
	<Table totalRecords={9} {columns}>
		{#each categoriesList as { name }, index}
			<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
				<td class=" px-6 py-4 text-grey-900 text-sm">{name}</td>
				<td class=" px-6 py-4 text-grey-500 text-sm text-end"><Link>{$_('common.edit')}</Link></td>
			</tr>
		{/each}
	</Table>
</section>
<AddCategory bind:isOpen={isDrawerOpen} />
