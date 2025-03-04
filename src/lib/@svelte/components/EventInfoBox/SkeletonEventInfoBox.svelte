<script lang="ts">
	import { _ } from '@services';
	import { CalenderIcon } from '$lib/@svelte/icons';
	import { Link } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Skeleton } from '@/components/ui/skeleton';

</script>

<div class=" p-6 shadow-custom rounded-md border border-solid border-stone-200">
	<Skeleton class=" w-2/3 h-5 mb-2" />
	<Skeleton class=" w-1/3 h-3" />
	<div class=" flex justify-between items-center mt-5">
		<div class=" flex items-center">
			<CalenderIcon />
			<Skeleton class=" w-20 h-4 ml-2" />
		</div>
		<Skeleton class=" w-24 h-8" />
	</div>
</div>
