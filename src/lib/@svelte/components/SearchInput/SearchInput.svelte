<script lang="ts">
	import { SearchIcon } from '$lib/@svelte/icons';
	import * as InputGroup from '@/components/ui/input-group';
	import { _ } from '@services';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { value = $bindable(''), ...rest }: HTMLInputAttributes = $props();
</script>

<InputGroup.Root class=" max-w-[246px] w-full">
	<InputGroup.Input bind:value {...rest} />
	<InputGroup.Addon align="inline-end"><SearchIcon /></InputGroup.Addon>
</InputGroup.Root>
