<script lang="ts">
	import { ColorLogoIcon } from '@/@svelte/icons';
	import { LanguageSelect } from '@/@svelte/components';
	import { _ } from '@services';
	import type { Snippet } from 'svelte';
	import * as Card from '@/components/ui/card';
	import * as Tabs from '@/components/ui/tabs';
	import { page } from '$app/state';
	import { cn } from '@/utils';
	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let activeTab = $derived.by(() => {
		if (page.url.pathname === '/sign-in') return 'SIGN_IN';
		if (page.url.pathname === '/sign-up') return 'SIGN_UP';
		return 'SIGN_IN';
	});
</script>

<div class=" flex w-full h-screen @container">
	<div class="flex w-full @xl:w-3/4 flex-col">
		<nav class=" px-10 py-4 border-b border-solid border-stone-200 relative">
			<ColorLogoIcon />
			<div class=" right-4 top-4 absolute">
				<LanguageSelect />
			</div>
		</nav>
		<div class=" flex justify-center items-center flex-col grow">
			<Tabs.Root value={activeTab} class=" mb-2">
				<Tabs.List class="w-full">
					<a href="/sign-in" class="grow">
						<Tabs.Trigger
							value="SIGN_IN"
							class={cn({
								'font-bold': page.url.pathname === '/sign-in'
							})}
						>
							{$_('auth.sign-in.title')}
						</Tabs.Trigger>
					</a>
					<a href="/sign-up" class="grow">
						<Tabs.Trigger
							value="SIGN_UP"
							class={cn({
								'font-bold': page.url.pathname === '/sign-up'
							})}
						>
							{$_('auth.sign-up.title')}
						</Tabs.Trigger>
					</a>
				</Tabs.List>
			</Tabs.Root>
			<Card.Root class={`w-full max-w-sm`}>
				{@render children?.()}
			</Card.Root>
		</div>
		<footer class=" px-10 py-4 border-t border-solid border-border bottom-0 w-full @container">
			<div
				class=" flex flex-col @xl:flex-row gap-4 justify-between font-semi-light text-stone-500 @container"
			>
				<p>©2025 bonding-studierendeninitiative e.&nbsp;V.</p>
				<div class="flex flex-col @sm:flex-row justify-between gap-2">
					<p>
						<a href="https://bonding.de/impressum" target="_blank">{$_('auth.footer.imprint')}</a>
					</p>
					<p>
						<a href="https://bonding.de/datenschutz" target="_blank"
							>{$_('auth.footer.privacyPolicy')}</a
						>
					</p>
				</div>
			</div>
		</footer>
	</div>
	<div
		class=" bg-cover bg-center h-screen w-0 @xl:w-1/4 rounded-none border-none"
		style="background-image: url('/sidebar_background.png');"
	></div>
</div>
