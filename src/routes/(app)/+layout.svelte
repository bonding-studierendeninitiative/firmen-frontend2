<script lang="ts">
	import { LanguageSelect } from '@/@svelte/components';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="relative">
	<div class=" right-4 top-2 absolute">
		<LanguageSelect />
	</div>
	{@render children?.()}
</div>