<script lang="ts">
	import { _ } from '@services';
	import { Drawer, Input, Select, Textarea } from '$lib/@svelte/components';
	export let isOpen: boolean = false;
</script>

<Drawer
	bind:isOpen
	heading={$_('admin-pages.categories.newCategory')}
	handleSubmit={() => {
		isOpen = false;
	}}
>
	<div class="grid grid-cols-1 gap-4 w-full">
		<Input label={$_('admin-pages.categories.categoryName')} />
		<Textarea label={$_('admin-pages.categories.categoryInformation')} />
		<Select
			placeholder={$_('admin-pages.categories.selectPackages')}
			label={$_('common.packages')}
		/>
		<Select placeholder={$_('admin-pages.categories.selectAddons')} label={$_('common.addons')} />
	</div>
</Drawer>
