<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';

	export let breadcrumbPaths: { text: string; path: string }[] = [];
</script>

<nav class="flex" aria-label="Breadcrumb">
	<ol class="inline-flex items-center">
		{#each breadcrumbPaths as breadcrumbPath, index (breadcrumbPath)}
			<li>
				<div class="flex items-center">
					<button
						on:click={() => {
							if (breadcrumbPath.path) {
								goto(breadcrumbPath.path);
							}
						}}
						class={`text-sm hover:text-brand capitalize  ${index !== breadcrumbPaths.length - 1 ? 'text-stone-500' : 'text-brand'}`}
						>{$_(`breadcrumbs.${breadcrumbPath.text}`, {
							default: breadcrumbPath.text
						})}</button
					>
					{#if index !== breadcrumbPaths.length - 1}
						<svg
							class=" w-3 h-3 text-gray-400 mx-1"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 6 10"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 9 4-4-4-4"
							/>
						</svg>{/if}
				</div>
			</li>
		{/each}
	</ol>
</nav>
