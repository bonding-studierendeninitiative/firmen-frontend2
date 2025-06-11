<script lang="ts">
	import { PickAdvertisementDialog } from "@/@svelte/modules";
	import { Button } from "@/components/ui/button";
	import type { GetEventRegistrationForOrganizationOutput } from "@api/client";
	import { _ } from "@services";

    let {registration}: {registration: GetEventRegistrationForOrganizationOutput} = $props();

    let pickAdvertisementOpen = $state(false)

</script>
<PickAdvertisementDialog
    bind:open={pickAdvertisementOpen}
    id={registration.id}
    orgId={registration.organizationId}
/>
<div class="rounded-xl border border-dashed border-red-400 p-4 flex flex-col items-center gap-4">
    <span>
    {$_('components.registration-card.advertisement-missing.description')}
</span>
    <Button variant="default" on:click={() => pickAdvertisementOpen = true} >{$_('components.registration-card.advertisement-missing.action')}</Button>
</div>