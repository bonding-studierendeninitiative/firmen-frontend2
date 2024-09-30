<script lang="ts">
	import { _ } from '@services';
	import { onMount } from 'svelte';
	import { SelectDown, SelectUp } from '$lib/@svelte/icons';
	import Checkbox from '../Checkbox/Checkbox.svelte';
	import { Button } from '@/components/ui/button';
	interface menuItemTypes {
		value: string;
		label: string;
		count: number;
	}
	export let placeholder: string = '';
	export let width = '';
	export let mainItems: menuItemTypes[] = [];
	export let otherItems: menuItemTypes[] = [];
	let isMenuOpen = false;

	function toggleMenu(e: any) {
		e.stopPropagation();
		e.preventDefault();
		isMenuOpen = !isMenuOpen;
	}
	function handleClick(event: any) {
		const menu: any = document.getElementById('menu');
		if (isMenuOpen && !menu.contains(event.target)) {
			isMenuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	});

	const handleCancel = () => {
		isMenuOpen = false;
	};
	const handleShowResults = () => {
		isMenuOpen = false;
	};
</script>

<div class="relative inline-block text-left">
	<div>
		<button
			on:click={toggleMenu}
			type="button"
			class="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			style={`min-width: ${width};`}
			id="menu-button"
			aria-expanded={isMenuOpen}
			aria-haspopup="true"
		>
			<span>
				{placeholder}
			</span>
			<span>
				{#if isMenuOpen}
					<SelectUp />
				{:else}
					<SelectDown />
				{/if}
			</span>
		</button>
	</div>

	{#if isMenuOpen}
		<div
			id="menu"
			class="absolute right-0 z-10 mb-8 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			role="menu"
			style={`min-width: ${width};`}
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div class="py-1" role="none">
				{#each mainItems as mainItem}
					<div class=" py-2.5 px-3.5">
						<Checkbox
							label={$_(`common.${mainItem.label}`, { default: mainItem.label })}
							labelClasses="!font-extrabold"
						/>
					</div>
				{/each}
				{#if mainItems.length}
					<hr class=" border-t border-stone-200 w-full" />
				{/if}
				{#each otherItems as otherItem}
					<div class=" py-2.5 px-3.5">
						<Checkbox label={otherItem.label} />
					</div>
				{/each}
				{#if otherItems.length}
					<hr class=" border-t border-stone-200 w-full" />
				{/if}
			</div>
			<footer class=" px-3.5 py-2.5 flex justify-between items-center w-full">
				<Button variant="outline" class="!py-1 !px-3 !text-xs" on:click={handleCancel}>{$_('common.cancel')}</Button>
				<Button variant="gradient" class="!py-1 !px-3 !text-xs" on:click={handleShowResults}
					>{$_('common.showResults')}</Button
				>
			</footer>
		</div>
	{/if}
</div>
