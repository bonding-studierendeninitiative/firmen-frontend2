<script lang="ts">

	import { Button } from '@/components/ui/button';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { ExportCatalogueDataRequest } from '@schema';

	export let exportCatalogueDataForm: SuperValidated<Infer<ExportCatalogueDataRequest>>;
	export let selectedEventRegistrations: string[];
	export let disabled: boolean;

	const form = superForm(exportCatalogueDataForm, {
		dataType: 'json',
		onSubmit: async ({ jsonData }) => {
			jsonData({
				eventRegistrationIds: selectedEventRegistrations,
				documentType: 'advert'
			});
		}
	});
	const { enhance } = form;
</script>

<form action="?/exportCatalogueData" method="post" use:enhance>
	<input type="hidden" name="documentType" value="advert" />
	<Button type="submit" {disabled} variant="gradient" size="sm">Export
	</Button>
</form>