<script lang="ts">
	import { cn } from '@/utils';
	import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
	import { Skeleton } from '@/components/ui/skeleton';

	interface User {
		id: string;
		name: string;
		email: string;
		image?: string;
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			fallback?: string;
			skeleton?: string;
		};
		user?: User | null;
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

	// Mock user data if none provided
	let displayUser = $derived(
		user || {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			image: undefined
		}
	);

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
		<AvatarImage src={displayUser.image} alt={displayUser.name} />
		<AvatarFallback class={classNames?.fallback}>
			{getInitials(displayUser.name)}
		</AvatarFallback>
	</Avatar>
{/if}
