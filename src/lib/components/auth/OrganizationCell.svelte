<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { Badge } from '@/components/ui/badge';
	import { Building2, Users, MoreHorizontal, ExternalLink } from '@lucide/svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';

	interface Organization {
		id: string;
		name: string;
		slug: string;
		role: string;
		membersCount: number;
		logo?: string;
		isPersonal?: boolean;
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			content?: string;
			actions?: string;
		};
		localization?: any;
		organization: Organization;
		isSelected?: boolean;
		onSelect?: (org: Organization) => void;
		onView?: (org: Organization) => void;
		onManage?: (org: Organization) => void;
		onLeave?: (org: Organization) => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		organization,
		isSelected = false,
		onSelect,
		onView,
		onManage,
		onLeave
	}: Props = $props();

	function handleClick() {
		onSelect?.(organization);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}
</script>

<div
	class={cn(
		'flex items-center justify-between p-4 rounded-lg border transition-colors',
		'hover:bg-accent cursor-pointer',
		isSelected && 'border-primary bg-primary/5',
		className,
		classNames?.base
	)}
	onclick={handleClick}
	onkeydown={handleKeydown}
	role="button"
	tabindex="0"
>
	<div class={cn('flex items-center gap-3', classNames?.content)}>
		{#if organization.logo}
			<img
				src={organization.logo}
				alt={organization.name}
				class="size-10 rounded-lg object-cover"
			/>
		{:else}
			<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
				<Building2 class="size-5 text-primary" />
			</div>
		{/if}

		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<h4 class="font-medium">{organization.name}</h4>
				{#if isSelected}
					<Badge variant="secondary" class="text-xs">
						{localization.CURRENT || 'Current'}
					</Badge>
				{/if}
			</div>
			<div class="flex items-center gap-2 text-sm text-muted-foreground">
				<Badge variant="outline" class="text-xs">
					{organization.role}
				</Badge>
				<div class="flex items-center gap-1">
					<Users class="size-3" />
					{organization.membersCount}
					{organization.membersCount === 1
						? localization.MEMBER || 'member'
						: localization.MEMBERS || 'members'}
				</div>
			</div>
		</div>
	</div>

	<div class={cn('flex items-center gap-2', classNames?.actions)}>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} size="sm" variant="ghost" onclick={(e) => e.stopPropagation()}>
					<MoreHorizontal class="size-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#if onView}
					<DropdownMenu.Item onclick={() => onView?.(organization)}>
						<ExternalLink class="mr-2 size-4" />
						{localization.VIEW_ORGANIZATION || 'View organization'}
					</DropdownMenu.Item>
				{/if}

				{#if onManage && (organization.role === 'owner' || organization.role === 'admin')}
					<DropdownMenu.Item onclick={() => onManage?.(organization)}>
						<Building2 class="mr-2 size-4" />
						{localization.MANAGE_ORGANIZATION || 'Manage organization'}
					</DropdownMenu.Item>
				{/if}

				{#if onLeave && organization.role !== 'owner'}
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						onclick={() => onLeave?.(organization)}
						class="text-destructive focus:text-destructive"
					>
						{localization.LEAVE_ORGANIZATION || 'Leave organization'}
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
