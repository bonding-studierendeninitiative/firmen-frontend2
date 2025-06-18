<script lang="ts">

	import { LucideMail, LucidePhone } from 'lucide-svelte';
	import { _ } from '@services';

	interface Props {
		contactPerson: {
		fullName?: string | null | undefined;
		email?: string | null | undefined;
		phone?: string | null | undefined;
	};
	}

	let { contactPerson }: Props = $props();
</script>
<div class="border p-4 rounded-xl flex flex-col gap-2">
	<p class="text-sm">{$_("modules.contact-person.full-name")}</p>
	<span class="font-bold">{contactPerson.fullName}</span>
	<div class="flex gap-4">
		<div class="flex gap-2 text-sm items-center">
			<LucidePhone class="w-4" />
			<span>{contactPerson.phone}</span>
		</div>
		<div class="flex gap-2 text-sm items-center">
			<LucideMail class="w-4" />
			<span>{contactPerson.email}</span>
		</div>
	</div>
</div>