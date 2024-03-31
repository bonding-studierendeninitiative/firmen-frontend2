<script>
	import { Sidebar } from '$lib/@svelte/modules';
</script>

<div class=" lg:flex w-full">
	<Sidebar />
	<div class=" px-22 py-16 bg-white w-full h-[100vh] overflow-y-scroll">
		<slot />
	</div>
</div>
