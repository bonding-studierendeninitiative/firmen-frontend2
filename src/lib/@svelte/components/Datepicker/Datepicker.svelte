<script lang="ts">
	import SveltyPicker from 'svelty-picker';
	import { ErrorMessage } from '../ErrorMessage';
	import CalenderIcon from '$lib/@svelte/icons/CalenderIcon.svelte';
	import { ClockIcon } from '$lib/@svelte/icons';
	export let label: string = '';
	export let value: string = '';
	export let errorMessage: string = '';
	export let type: 'date' | 'time' = 'date';
</script>

<div>
	{#if label}
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for={label}>{label}</label
		>
	{/if}
	<div class="relative">
		<SveltyPicker
			name="time"
			inputId="time"
			format="yyyy-mm-dd hh:ii"
			displayFormat={type === 'date' ? 'yyyy-mm-dd' : 'hh:ii'}
			inputClasses="w-full border border-gray-300 text-gray-900 text-sm rounded-lg block p-2"
			mode={type}
			bind:value
		/>
		{#if type === 'date'}
			<div
				class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-slate-400"
			>
				<CalenderIcon />
			</div>
		{:else}
			<div
				class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-slate-400"
			>
				<ClockIcon />
			</div>
		{/if}
	</div>

	<ErrorMessage message={errorMessage} />
</div>
