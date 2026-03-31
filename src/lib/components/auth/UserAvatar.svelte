<script lang="ts">
	import { cn } from '@/utils';
	import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
	import { Skeleton } from '@/components/ui/skeleton';
	import type { User } from 'better-auth';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			fallback?: string;
			skeleton?: string;
		};
		user?: Pick<User, 'id' | 'name'> | null;
		size?: 'sm' | 'default' | 'lg';
		showSkeleton?: boolean;
	}

	let {
		className = '',
		classNames = {},
		user = null,
		size = 'default',
		showSkeleton = false
	}: Props = $props();

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function getSizeClass(size: string) {
		switch (size) {
			case 'sm':
				return 'size-6';
			case 'lg':
				return 'size-16';
			case 'default':
			default:
				return 'size-8';
		}
	}
</script>

{#if showSkeleton}
	<Skeleton class={cn(getSizeClass(size), 'rounded-full', className, classNames?.skeleton)} />
{:else}
	<Avatar class={cn(getSizeClass(size), className, classNames?.base)}>
		<AvatarImage src={`/api/avatar/${user?.id}.svg`} alt={user?.name} />
		<AvatarFallback class={classNames?.fallback}>
			{getInitials(user?.name || '')}
		</AvatarFallback>
	</Avatar>
{/if}
