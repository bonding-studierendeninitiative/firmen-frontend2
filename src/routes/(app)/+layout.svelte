<script lang="ts">
	import { LanguageSelect } from '@/@svelte/components';
</script>

<div class="relative">
	<div class=" right-4 top-2 absolute">
		<LanguageSelect />
	</div>
	<slot />
</div>