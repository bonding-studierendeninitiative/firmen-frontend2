<script lang="ts">
	import Input from '../Input/Input.svelte';
	export let placeholder: string = '';
	export let label: string = '';
	export let iconType: '' | 'startIcon' | 'endIcon' = '';
</script>

<div>
	{#if label}
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for={label}>{label}</label
		>
	{/if}
	<div class=" w-full">
		<div class="relative">
			{#if iconType === 'startIcon'}
				<div
					class="absolute inset-y-0 z-10 start-0 my-2 flex items-center ps-3 pointer-events-none text-slate-400 border-r border-slate-200 w-20"
				>
					<slot name="icon-start" />
				</div>
			{:else}
				<div
					class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-slate-400"
				>
					<slot name="icon" />
				</div>
			{/if}

			<Input {placeholder} classes={`${iconType === 'startIcon' ? '!pl-22' : 'pr-8'}`} />
		</div>
	</div>
</div>
