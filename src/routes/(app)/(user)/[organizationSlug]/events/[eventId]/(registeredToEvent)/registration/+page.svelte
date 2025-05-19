<script lang="ts">
	import SuperDebug from "sveltekit-superforms";

    let {data} = $props()
</script>

<SuperDebug data={data.eventRegistration} />