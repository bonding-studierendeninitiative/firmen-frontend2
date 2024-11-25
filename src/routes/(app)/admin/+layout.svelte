<script lang="ts">
	import { Sidebar } from '$lib/@svelte/modules';
</script>

<div class=" lg:flex w-full">
	<Sidebar />

	<div class="h-[100dvh] w-full flex-grow overflow-y-scroll">
		<div class="w-full px-16 py-22 bg-white">
			<slot />
		</div>
	</div>
</div>
