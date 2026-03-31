<script lang="ts">
	import { _, dayjs } from '@services';
	import { FilledCheckIcon, MessageIcon } from '$lib/@svelte/icons';
	import { Button } from '@/components/ui/button';

	const onActionButtonClick = () => {};

	export const notificationDate: Date | null = null;
	interface Props {
		notificationType: 'registrationSuccess' | 'registrationRejected' | 'simpleNotification';
		notificationContent?: string;
		handleUpdatePortrait?: (() => void) | undefined;
	}

	let {
		notificationType,
		notificationContent = '',
		handleUpdatePortrait = undefined
	}: Props = $props();

	const getNotificationIcon = (notificationType: string) => {
		switch (notificationType) {
			case 'registrationSuccess':
				return FilledCheckIcon;
			case 'registrationRejected':
			case 'simpleNotification':
			default:
				return MessageIcon;
		}
	};
	let IconComponent = $derived(getNotificationIcon(notificationType));
</script>

<div
	class="p-4 mb-3 flex justify-between items-center shadow-custom rounded-md border border-solid border-stone-200"
>
	<div class=" flex">
		<div class={`rounded-lg inline-flex justify-center items-start mt-1 `}>
			<IconComponent />
		</div>
		<div class=" flex flex-col ml-4">
			<h3 class=" text-base text-stone-500">
				{@html notificationContent}
			</h3>
			<div class=" py-2">
				{#if notificationType === 'registrationSuccess'}
					<Button variant="gradient" onclick={() => handleUpdatePortrait?.()}>
						{$_('user-pages.notifications.updatePortrait')}
					</Button>
				{:else if notificationType === 'registrationRejected'}
					<Button onclick={onActionButtonClick} class="  shadow-custom  text-stone-800">
						{$_('user-pages.notifications.contactSupport')}
					</Button>
				{/if}
			</div>
			<p class="mt-2 text-sm text-stone-400 font-medium">
				{dayjs(notificationDate).fromNow(true) ?? '40 minutes ago'}
			</p>
		</div>
	</div>
</div>
