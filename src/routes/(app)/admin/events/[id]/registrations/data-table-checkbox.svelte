<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import { Checkbox } from '@/components/ui/checkbox';
	import type { OnChangeFn } from '@tanstack/svelte-table';

	interface Props {
		checked: boolean | "indeterminate";
		onCheckedChange: OnChangeFn<boolean | "indeterminate">
	}

	let { checked, onCheckedChange }: Props = $props();
</script>

<Checkbox {checked} {onCheckedChange} />
