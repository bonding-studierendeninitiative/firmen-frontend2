<script lang="ts">
	import { _ } from '@services';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import BanUserForm from './ban-user-form.svelte';
	import { cn } from '@/utils';
	import { CircleOff } from '@lucide/svelte';

	let { user } = $props();

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		title={$_('admin-pages.users.overview.banUser')}
		class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), '[&_svg]:size-6')}
	>
		<CircleOff />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('admin-pages.users.overview.banUser')}</Dialog.Title>
			<Dialog.Description>
				{$_('admin-pages.users.overview.banUserDescription')}
			</Dialog.Description>
		</Dialog.Header>
		<BanUserForm {user} />
	</Dialog.Content>
</Dialog.Root>
