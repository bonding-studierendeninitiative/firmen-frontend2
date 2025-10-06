<script lang="ts">
	import { _ } from '@services';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from '@/components/ui/button';
	import { Link } from '@/@svelte/components';

	interface Props {
		slug: string;
	}

	let { slug }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" {...props} size="icon" class="relative size-6 p-0">
				<span class="sr-only">{$_('common.open-menu')}</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<Link
			href={`/admin/organizations/${slug}`}
			class="hover:no-underline text-secondary-foreground hover:text-primary-foreground"
		>
			<DropdownMenu.Item>
				{$_('admin-pages.organizations.data-table.actions.view-details')}
			</DropdownMenu.Item>
		</Link>
	</DropdownMenu.Content>
</DropdownMenu.Root>
