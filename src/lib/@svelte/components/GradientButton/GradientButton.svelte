<script lang="ts">
	export let classes = '';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let onClick: (() => void) | undefined = undefined;
	export let form: string | undefined = undefined;
</script>

<button
	on:click={onClick}
	type={type}
	form={form}
	class={'flex text-nowrap justify-center bg-gradient-to-b from-white/30 to-transparent bg-brand items-center relative px-4 py-2.5 space-x-4 rounded-lg text-white text-sm font-extrabold '.concat(
		classes
	)}
>
	<span><slot /></span>
</button>
