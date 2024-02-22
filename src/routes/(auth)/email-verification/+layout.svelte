<script>
	import { LoginWrapper } from '$lib/@svelte';
</script>

<LoginWrapper
	heading="E-Mail verifizieren"
	subHeading="Ein Verifizierungscode wurde Ihnen zugesandt.<br> Geben Sie den Code unten ein."
>
	<slot />
</LoginWrapper>
