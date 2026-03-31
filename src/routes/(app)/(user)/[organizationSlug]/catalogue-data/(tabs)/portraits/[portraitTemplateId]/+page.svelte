<script lang="ts">
	import { PortraitForm } from '@/@svelte/modules';
	import { goto } from '$app/navigation';

	let { params } = $props();
</script>

<PortraitForm
	isOpen={true}
	onDialogChange={() => {
		console.log('Portrait closed in Page');
		goto('..');
	}}
/>
