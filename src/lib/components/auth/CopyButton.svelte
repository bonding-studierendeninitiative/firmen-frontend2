<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Copy, Check } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		text: string;
		size?: 'sm' | 'icon' | 'lg';
		variant?: 'default' | 'outline' | 'ghost';
		showText?: boolean;
		successMessage?: string;
		class?: string;
	}

	let {
		text,
		size = 'sm',
		variant = 'outline',
		showText = false,
		successMessage = 'Copied to clipboard',
		class: className
	}: Props = $props();

	let copied = $state(false);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			toast.success(successMessage);

			// Reset the copied state after 2 seconds
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (error) {
			toast.error('Failed to copy to clipboard');
		}
	}
</script>

<Button {variant} {size} onclick={copyToClipboard} class={className}>
	{#if copied}
		<Check class="h-4 w-4 {showText ? 'mr-2' : ''}" />
	{:else}
		<Copy class="h-4 w-4 {showText ? 'mr-2' : ''}" />
	{/if}
	{#if showText}
		{copied ? 'Copied!' : 'Copy'}
	{/if}
</Button>
