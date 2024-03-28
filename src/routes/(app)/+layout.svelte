<script>
	import { Sidebar } from '$lib/@svelte';
</script>

<div class=" lg:flex w-full">
	<Sidebar />
	<div class=" px-22 py-20 bg-white w-full h-[100vh] overflow-y-scroll">
		<slot />
	</div>
</div>
