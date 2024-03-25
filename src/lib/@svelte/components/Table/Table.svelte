<script lang="ts">
	export let columns: string[];
	export let totalRecords: number | undefined;
</script>

<div class="w-full overflow-hidden rounded-lg shadow-xs">
	<div class="w-full overflow-x-auto">
		<table class="w-full whitespace-no-wrap">
			<thead>
				<tr
					class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50"
				>
					{#each columns as head}
						<th class="px-6 py-3">{head}</th>
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
