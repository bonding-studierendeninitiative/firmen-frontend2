<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

	export let className: string = '';
	export let classNames: any = {};
	export let localization: any = {};
	export let src: string = '';
	export let organization: any = null;
	export let size: 'sm' | 'default' | 'lg' = 'default';
	export let isPending: boolean = false;

	// Determine logo source from organization or direct src prop
	$: logoSrc = organization?.logo || src;

	// Generate fallback initials from organization name
	$: initials = organization?.name
		? organization.name
				.split(' ')
				.map((word: string) => word[0])
				.join('')
				.substring(0, 2)
				.toUpperCase()
		: 'ORG';

	// Size classes
	$: sizeClass = {
		sm: 'size-6',
		default: 'size-8',
		lg: 'size-16'
	}[size];
</script>

<Avatar class={`${sizeClass} ${className} ${classNames?.base ?? ''}`}>
	{#if isPending}
		<div class="animate-pulse bg-muted rounded-full size-full"></div>
	{:else if logoSrc}
		<AvatarImage
			src={logoSrc}
			alt={organization?.name || localization?.ORGANIZATION_LOGO || 'Organization Logo'}
		/>
		<AvatarFallback class={classNames?.fallback}>{initials}</AvatarFallback>
	{:else}
		<AvatarFallback class={classNames?.fallback}>{initials}</AvatarFallback>
	{/if}
</Avatar>

<style>
	/* Add any scoped styles here if needed */
</style>
