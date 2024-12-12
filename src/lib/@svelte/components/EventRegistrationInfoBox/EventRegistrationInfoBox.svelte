<script lang="ts">
	import { _ } from '@services';
	import { CalenderIcon, LocationIcon } from '$lib/@svelte/icons';
	import { Link } from '@/@svelte/components';
	import type { OrgEventRegistration } from '@schema';
	import type { InferOutput } from 'valibot';

	export let date: string;
	export let buttonText: string = 'register';
	export let href: string;
	export let eventRegistration: InferOutput<OrgEventRegistration>;
</script>

<div class=" p-6 shadow-custom rounded-md border border-solid border-stone-200">
	<h4 class=" text-lg font-extrabold text-stone-800">{eventRegistration.event.name}</h4>
	<h6 class=" text-sm text-stone-800 font-normal">{eventRegistration.status?.text}</h6>
	<div class=" flex justify-between items-center mt-5">
		<div class=" flex items-center">
			<CalenderIcon />
			<p class=" ml-2 text-sm text-stone-800 font-medium">{date}</p>
		</div>
		<div class=" flex items-center">
			<LocationIcon />
			<p class=" ml-2 text-sm text-stone-800 font-medium">{eventRegistration.event?.location}</p>
		</div>
		<Link variant="gradient" {href}>{$_(`common.${buttonText}`)}</Link>
	</div>
</div>
