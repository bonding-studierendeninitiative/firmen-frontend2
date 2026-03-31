<script lang="ts">
	import * as Card from '@/components/ui/card';
	import * as Tabs from '@/components/ui/tabs';
	import { Button, Root } from '../ui/button';
	import AuthForm from './AuthForm.svelte';
	import { cn } from '@/utils';

	interface Props {
		// Props
		className?: string;
		classNames?: any;
		callbackURL?: string;
		cardHeader?: any;
		localization?: any;
		pathname?: string;
		redirectTo?: string;
		socialLayout?: 'auto' | 'horizontal' | 'grid' | 'vertical';
		view?: string;
		otpSeparators?: number;
		showTabs?: boolean;
	}

	let {
		className = '',
		classNames = {},
		callbackURL = '',
		cardHeader = null,
		localization = {},
		pathname = '',
		redirectTo = '',
		socialLayout = 'auto',
		view = 'SIGN_IN',
		otpSeparators = 0,
		showTabs = true
	}: Props = $props();

	// Context, stores, and logic would be imported from your app's auth context
	// For now, use placeholders for context values
	let isSubmitting = false;
	let description = localization?.[view + '_DESCRIPTION'] ?? '';
</script>

<Card.Root class={`w-full max-w-sm ${className} ${classNames?.base ?? ''}`}>
	<Card.Header class={classNames?.header}>
		{#if showTabs}
			<Tabs.Root bind:value={view} class={`w-full mb-6 ${classNames?.tabs ?? ''}`}>
				<Tabs.List class="w-full">
					<Tabs.Trigger
						value="SIGN_IN"
						class={cn(`px-4 py-2 grow ${classNames?.tab ?? ''}`, {
							'font-bold': view === 'SIGN_IN'
						})}
					>
						{localization?.SIGN_IN ?? 'Sign In'}
					</Tabs.Trigger>
					<Tabs.Trigger
						value="SIGN_UP"
						class={cn(`px-4 py-2 grow ${classNames?.tab ?? ''}`, {
							'font-bold': view === 'SIGN_UP'
						})}
					>
						{localization?.SIGN_UP ?? 'Sign Up'}
					</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
		{/if}
		{#if cardHeader}
			{@html cardHeader}
		{:else}
			<Card.Title class={`text-lg md:text-xl ${classNames?.title ?? ''}`}
				>{localization?.[view] ?? ''}</Card.Title
			>
			{#if description}
				<Card.Description class={`text-xs md:text-sm ${classNames?.description ?? ''}`}
					>{description}</Card.Description
				>
			{/if}
		{/if}
	</Card.Header>

	<Card.Content class={`grid gap-6 ${classNames?.content ?? ''}`}>
		<!-- AuthForm goes here -->
		<AuthForm
			classNames={classNames?.form}
			{callbackURL}
			{isSubmitting}
			{localization}
			{otpSeparators}
			{pathname}
			{redirectTo}
			{view}
		/>
	</Card.Content>
</Card.Root>
