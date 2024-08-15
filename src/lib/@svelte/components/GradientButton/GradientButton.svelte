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
	style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 100%), #007EC7;"
	class={'flex text-nowrap justify-center items-center relative px-4 py-2.5 space-x-4 rounded-lg text-white text-sm font-extrabold '.concat(
		classes
	)}
>
	<span><slot /></span>
</button>
