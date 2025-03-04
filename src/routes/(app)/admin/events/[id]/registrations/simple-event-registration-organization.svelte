<script lang="ts">
	export let organization: {
		name: string;
		logo: string;
	};
</script>

<div class="flex flex-row items-center gap-2">
	<img alt={organization.name} src={organization.logo} class="w-6 h-6 rounded-full" />
	<span class="text-nowrap">{organization.name}</span>
</div>