<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton } from '$lib/@svelte';
	const handleSubmit = () => {
		goto('/access-preference');
	};
</script>

<GradientButton classes=" mt-5" onClick={handleSubmit}>Continue</GradientButton>
