<script lang="ts">
	export let classes: string = '';
	export let onClick: () => void = () => {};
</script>

<button on:click={onClick} class={' text-brand no-underline font-normal text-sm '.concat(classes)}
	><slot /></button
>
