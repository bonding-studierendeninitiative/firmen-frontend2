<script lang="ts">
	import { _ } from '@services';
	interface Props {
		message?: string;
	}

	let { message = '' }: Props = $props();
</script>

{#if message}
	<p class=" text-red-500 font-normal text-sm">
		{$_(`validation-messages.${message}`)}
	</p>
{/if}
