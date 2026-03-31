<script lang="ts">
	import { AdminJobs } from '@/@svelte/modules';
	import { SidebarProvider } from '@/components/ui/sidebar';
	import AdminUserSidebar from './admin-user-sidebar.svelte';

	let { children, data } = $props();
</script>

<div class=" lg:flex w-full">
	<SidebarProvider>
		<AdminUserSidebar
			user={data.user ?? {
				name: '',
				email: '',
				id: ''
			}}
		/>

		<div class="h-dvh w-full grow overflow-y-scroll bg-white">
			<AdminJobs />
			<div class="w-full px-16 py-22">
				{@render children?.()}
			</div>
		</div>
	</SidebarProvider>
</div>
