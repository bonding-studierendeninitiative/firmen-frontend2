<script lang="ts">
	import * as Avatar from '@/components/ui/avatar';

	export let organization: {
		name: string;
		logo: string;
	};
</script>

<div class="flex flex-row items-center gap-2">
	<Avatar.Root class="w-6 h-6" >
		<Avatar.Image src={organization.logo} />
		<Avatar.Fallback>{organization.name[0]}</Avatar.Fallback>
	</Avatar.Root>
	<span class="text-nowrap">{organization.name}</span>
</div>