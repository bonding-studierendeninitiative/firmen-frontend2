<script lang="ts">
	import * as Avatar from '@/components/ui/avatar';

	interface Props {
		organization: {
			name: string | null | undefined;
			logo: string | null | undefined;
		};
	}

	let { organization }: Props = $props();
</script>

{#if organization.name}
	<div class="flex flex-row items-center gap-2">
		<Avatar.Root class="size-6">
			<Avatar.Image src={organization.logo} />
			<Avatar.Fallback
				>{organization.name
					.split(' ')
					.slice(0, 2)
					.map((c) => c.toUpperCase().charAt(0))
					.join('')}</Avatar.Fallback
			>
		</Avatar.Root>
		<span class="text-nowrap">{organization.name}</span>
	</div>
{/if}
