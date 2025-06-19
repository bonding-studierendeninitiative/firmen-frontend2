<script lang="ts">
	import { _ } from '@services';

	interface Props {
		columns: any[];
		totalRecords: number | undefined;
		classes?: string;
		children?: import('svelte').Snippet;
	}

	let {
		columns,
		totalRecords,
		classes = '',
		children
	}: Props = $props();
</script>

<div class={'w-full overflow-hidden rounded-lg shadow-2xs border border-stone-200 '.concat(classes)}>
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
				{@render children?.()}
			</tbody>
		</table>
	</div>
</div>
{#if !totalRecords}
	<div class=" w-full h-20 flex justify-center items-center">
		{$_("components.table.no-records")}
	</div>
{/if}
