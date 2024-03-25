<script lang="ts">
	import { ActionNotificationItem } from '$lib/@svelte';
</script>

<section>
	<h1 class=" text-stone-950 text-3xl font-extrabold">Notifications</h1>
</section>
<section class="mt-10 mb-12">
	<div class="mb-6 flex justify-center items-center">
		<hr class=" border-stone-200 w-full" />
		<p class=" whitespace-nowrap mx-8 text-sm text-stone-400 font-medium">22 December 2023</p>
		<hr class=" border-stone-200 w-full" />
	</div>
	<ActionNotificationItem />
</section>
