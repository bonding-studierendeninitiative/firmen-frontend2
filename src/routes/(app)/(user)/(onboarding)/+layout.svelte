<script lang="ts">

	import { ColorLogoIcon } from '@/@svelte/icons';
	import { LanguageSelect } from '@/@svelte/components';
	import { _ } from '@services';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>
	<div class=" flex w-full h-screen @container">
			<div class="flex w-full @xl:w-3/4 flex-col">
				<nav class=" px-10 py-4 border-b border-solid border-stone-200 relative">
					<ColorLogoIcon />
					<div class=" right-4 top-4 absolute">
						<LanguageSelect />
					</div>
				</nav>
				<div class=" flex justify-center items-center grow">
					{@render children?.()}
				</div>
				<footer class=" px-10 py-4 border-t border-solid border-border bottom-0 w-full @container">
					<div class=" flex flex-col @xl:flex-row gap-4 justify-between font-semi-light text-stone-500 @container">
						<p>©2025 bonding-studierendeninitiative e.&nbsp;V.</p>
						<div class="flex flex-col @sm:flex-row justify-between gap-2">
							<p><a href="https://bonding.de/impressum" target="_blank">{$_('auth.footer.imprint')}</a></p>
							<p><a href="https://bonding.de/datenschutz" target="_blank">{$_('auth.footer.privacyPolicy')}</a></p>
						</div>
					</div>
				</footer>
			</div>
			<div
				class=" bg-cover bg-center h-screen w-0 @xl:w-1/4 rounded-none border-none"
				style="background-image: url('/sidebar_background.png');"
			></div>
		</div>
