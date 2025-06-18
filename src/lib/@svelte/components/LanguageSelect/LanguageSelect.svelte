<script lang="ts">
	import * as Select from "@/components/ui/select"
	import { locale } from '@services';
	import { Globe } from 'lucide-svelte';
</script>

<div class=" w-18">
	<Select.Root type="single" bind:value={$locale}>
		<Select.Trigger><Globe class="w-4 h-4 mr-2" />{$locale}</Select.Trigger>
		<Select.Content>
			<Select.Item value="de">de</Select.Item>
			<Select.Item value="en">en</Select.Item>
		</Select.Content>
	</Select.Root>
</div>
