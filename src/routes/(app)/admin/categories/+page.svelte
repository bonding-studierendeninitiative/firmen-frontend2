<script lang="ts">
	import { GradientButton, Link, Table } from '$lib';

	const columns = ['Name', ''];

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
		<h1 class=" text-stone-950 text-3xl font-extrabold">Categories</h1>
		<div>
			<GradientButton onClick={() => undefined}>Add Category</GradientButton>
		</div>
	</div>
</section>

<section class=" mt-10">
	<Table totalRecords={9} {columns}>
		{#each categoriesList as { name }, index}
			<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
				<td class=" px-6 py-4 text-grey-900 text-sm">{name}</td>
				<td class=" px-6 py-4 text-grey-500 text-sm text-end"><Link>Edit</Link></td>
			</tr>
		{/each}
	</Table>
</section>
