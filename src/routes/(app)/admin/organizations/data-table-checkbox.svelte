<script lang="ts">
	import { Checkbox } from '@/components/ui/checkbox';

	export let checked: boolean | "indeterminate";
</script>

<Checkbox bind:checked={checked} />
