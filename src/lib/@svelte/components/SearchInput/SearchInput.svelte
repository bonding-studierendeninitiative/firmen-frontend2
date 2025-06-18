<script lang="ts">
	import { SearchIcon } from '$lib/@svelte/icons';
	import { Input } from '@/components/ui/input';
	import { _ } from '@services';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type $$Props = HTMLInputAttributes;
	interface Props {
		value?: $$Props['value'];
		[key: string]: any
	}

	let { value = $bindable(''), ...rest }: $$Props = $props();
</script>

<div class=" max-w-[246px] w-full">
	<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">{$_("common.search")}</label>
	<div class="relative">
		<Input bind:value {...rest} />
		<div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
			<SearchIcon />
		</div>
	</div>
</div>
