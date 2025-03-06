<script lang="ts">

	import { ColorLogoIcon } from '@/@svelte/icons';
	import { LanguageSelect } from '@/@svelte/components';
	import { _ } from '@services';
</script>
	<div class=" flex w-full h-screen">
			<div class=" w-3/4 flex-row">
				<nav class=" px-10 py-4 border-b border-solid border-stone-200 relative">
					<ColorLogoIcon />
					<div class=" right-4 top-4 absolute">
						<LanguageSelect />
					</div>
				</nav>
				<div class=" flex justify-center items-center h-5/6">
					<slot />
				</div>
				<footer class=" px-10 py-4 border-t border-solid border-stone-200 bottom-0 fixed w-3/4">
					<div class=" flex justify-between font-semi-light text-stone-500">
						<p>©2024 bonding-studierendeninitiative e.V.</p>
						<div class="flex justify-between">
							<p class="mr-1"><a href="https://bonding.de/impressum" target="_blank">{$_('auth.footer.imprint')}</a></p>
							<p><a href="https://bonding.de/datenschutz" target="_blank">{$_('auth.footer.privacyPolicy')}</a></p>
						</div>
					</div>
				</footer>
			</div>
			<div
				class=" bg-cover bg-center h-screen w-1/4 rounded-none border-none"
				style="background-image: url('/sidebar_background.png');"
			></div>
		</div>
