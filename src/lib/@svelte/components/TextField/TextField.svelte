<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import { Input } from '$lib/@svelte/components';
	import { Label } from 'flowbite-svelte';

	export let superform: SuperForm<T>;
	export let field: FormPathLeaves<T>;
	export let label: string = '';

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<Label for={field}>
	{label || field}
	{#if $constraints?.required} <span class="text-pink-500">*</span>{/if}
	<br />
	<Input
		name={field}
		type="text"
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...$$restProps} />
</Label>
{#if $errors}<span class="invalid">{$errors}</span>{/if}