<script>
	import { Sidebar } from '$lib/@svelte/modules';
	import LanguageSelect from '$lib/@svelte/components/LanguageSelect/LanguageSelect.svelte';
</script>

<div class=" lg:flex w-full">
	<Sidebar />
	<div class=" px-22 py-16 bg-white w-full h-[100vh] overflow-y-scroll relative">
		<div class=" right-4 top-2 absolute"><LanguageSelect /></div>
		<slot />
	</div>
</div>
