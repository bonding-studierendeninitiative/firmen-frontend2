<script lang="ts">
	export let classes: string = '';
</script>

<button class={' '.concat(classes)}>
	<slot />
</button>
