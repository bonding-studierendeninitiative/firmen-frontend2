<script>
	import { ColorLogoIcon } from '$lib/@svelte/icons';
	import { _ } from './../../services/i18n';
</script>

<div class=" flex w-full h-screen">
	<div class=" w-3/4 flex-row">
		<nav class=" px-10 py-4 border-b border-solid border-stone-200">
			<ColorLogoIcon />
		</nav>
		<div class=" flex justify-center items-center h-5/6">
			<slot />
		</div>

		<footer class=" px-10 py-4 border-t border-solid border-stone-200 bottom-0 fixed w-3/4">
			<div class=" flex justify-between font-semi-light text-stone-500">
				<p>©2024 Bonding</p>
				<p>{$_('auth.footer.privacyPolicy')}</p>
			</div>
		</footer>
	</div>
	<div
		class=" bg-cover bg-center h-screen w-1/4 rounded-none border-none"
		style="background-image: url('../sidebar_background.png');"
	></div>
</div>
