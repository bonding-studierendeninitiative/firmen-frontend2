<script>
	export let heading = '';
	export let subHeading = '';
</script>

<div class=" w-4/6 lg:w-3/6 xl:w-98 m-10 pb-24">
	<div class="mb-10">
		<p class=" text-stone-950 text-3xl font-bold">{heading}</p>
		<p class=" text-stone-500 font-semi-light mt-2">{@html subHeading}</p>
	</div>
	<slot />
</div>
