<script lang="ts">
	import { GradientButton, Link, Table } from '$lib';

	const columns = ['Package Name', 'Price', ''];

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
</script>

<section>
	<div class=" flex justify-between items-center">
		<h1 class=" text-stone-950 text-3xl font-extrabold">Packages</h1>
		<div>
			<GradientButton onClick={() => undefined}>Add Package</GradientButton>
		</div>
	</div>
</section>

<section class=" mt-10">
	<Table totalRecords={9} {columns}>
		{#each packagesList as { name, price }, index}
			<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
				<td class=" px-6 py-4 text-grey-900 text-sm">{name}</td>
				<td class=" px-6 py-4 text-grey-900 text-sm font-extrabold">{price}</td>
				<td class=" px-6 py-4 text-grey-500 text-sm text-end"><Link>Edit</Link></td>
			</tr>
		{/each}
	</Table>
</section>
