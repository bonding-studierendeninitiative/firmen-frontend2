<script lang="ts">
	import * as Avatar from '@/components/ui/avatar';

	interface Props {
		organization: {
		name: string;
		logo: string;
	};
	}

	let { organization }: Props = $props();
</script>

<div class="flex flex-row items-center gap-2">
	<Avatar.Root class="size-6" >
		<Avatar.Image src={organization.logo} />
		<Avatar.Fallback>{organization.name[0]}</Avatar.Fallback>
	</Avatar.Root>
	<span class="text-nowrap">{organization.name}</span>
</div>