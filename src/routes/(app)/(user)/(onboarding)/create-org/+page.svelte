<script lang="ts">
	import { CreateOrganization } from 'svelte-clerk';
</script>


<main class="container mt-8">
	<CreateOrganization appearance={{
		elements: {
			rootBox: "mx-auto"
		}
	}} hideSlug={true} />
</main>

