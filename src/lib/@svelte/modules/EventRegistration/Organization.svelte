<script lang="ts">

	import { LucideMail, LucidePhone } from 'lucide-svelte';

	export let organization: {
		name?: string | null | undefined;
		email?: string | null | undefined;
		phone?: string | null | undefined;
	};
</script>
<div class="border p-4 rounded-xl flex flex-col gap-2">
	<p class="text-sm">Organization:</p>
	<span class="font-bold">{organization.name}</span>
	<div class="flex gap-4">
		<div class="flex gap-2 text-sm items-center">
			<LucidePhone class="w-4" />
			<span>{organization.phone}</span>
		</div>
		<div class="flex gap-2 text-sm items-center">
			<LucideMail class="w-4" />
			<span>{organization.email}</span>
		</div>
	</div>
</div>