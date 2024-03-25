<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';

	const handleSubmit = () => {
		goto('/access-preference');
	};
</script>

<GradientButton classes=" mt-5 w-full" onClick={handleSubmit}
	>{$_('common.continue')}</GradientButton
>
