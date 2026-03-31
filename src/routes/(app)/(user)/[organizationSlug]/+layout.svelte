<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import AppUserSidebar from './app-user-sidebar.svelte';

	let { data, children } = $props();
</script>

<div class=" lg:flex w-full">
	<Sidebar.Provider>
		<AppUserSidebar user={data.user ?? {
			name: '',
			email: '',
			id: ''
		}} organization={{
			slug: data.organization?.slug ?? ''
		}} />

		<div class="h-dvh w-full overflow-y-scroll @container">
			<Sidebar.Trigger>
				<span class="sr-only">Toggle Sidebar</span>
			</Sidebar.Trigger>
			<div class="w-full p-6 @xl:px-16 @xl:py-22 bg-white">
				{@render children?.()}
			</div>
		</div>
	</Sidebar.Provider>
</div>
