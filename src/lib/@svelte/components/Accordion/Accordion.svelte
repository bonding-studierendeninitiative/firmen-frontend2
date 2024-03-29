<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<!-- component -->
<div>
	<details class="group">
		<summary class="flex items-center cursor-pointer list-none">
			<slot name="header" />
		</summary>
		<slot name="details" />
	</details>
</div>
