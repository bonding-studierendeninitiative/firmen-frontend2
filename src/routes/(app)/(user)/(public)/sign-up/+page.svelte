<script lang="ts">

	import type { PageData } from './$types';
	import { RegisterContactPerson } from '@/@svelte/modules';

	export let data: PageData;
</script>


<main class="container mt-8">
	<section class="border rounded-xl p-8">
		<h1>Sign Up</h1>
		<RegisterContactPerson validated={data.form} />
	</section>
</main>

