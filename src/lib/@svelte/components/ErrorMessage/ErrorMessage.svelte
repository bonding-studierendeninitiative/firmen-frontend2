<script lang="ts">
	import { _ } from '@services';
	export let message: string = '';
</script>

{#if message}
	<p class=" text-red-500 font-normal text-sm">
		{$_(`validation-messages.${message}`)}
	</p>
{/if}
