<script lang="ts">
	import { _ } from '@services';

	export let columns: any[];
	export let totalRecords: number | undefined;
	export let classes: string = '';
</script>

<div class={'w-full overflow-hidden rounded-lg shadow-xs border border-stone-200 '.concat(classes)}>
	<div class="w-full overflow-x-auto">
		<table class="w-full whitespace-no-wrap">
			<thead>
				<tr class=" tracking-wide text-left text-gray-500 border-b bg-gray-50">
					{#each columns as head}
						<th class="px-6 py-3 text-sm font-normal">{head ? $_(`table-headings.${head}`) : ''}</th
						>
					{/each}
				</tr>
			</thead>
			<tbody class="bg-white divide-y">
				<slot />
			</tbody>
		</table>
	</div>
</div>
{#if !totalRecords}
	<div class=" w-full h-20 flex justify-center items-center">
		Leider wurden keine Datensätze gefunden
	</div>
{/if}
