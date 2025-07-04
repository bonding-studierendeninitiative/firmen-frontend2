<script lang="ts">
	import { LanguageSelect } from '@/@svelte/components';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="relative">
	{@render children?.()}
</div>