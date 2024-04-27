<script lang="ts">
	import { _ } from '@services';
	import { FilledCheckIcon, MessageIcon } from '$lib/@svelte/icons';
	import { GradientButton, Button } from '$lib/@svelte/components';

	const onActionButtonClick = () => {};

	export let notificationType:
		| 'registrationSuccess'
		| 'registrationRejected'
		| 'simpleNotification';

	export let notificationContent: string = '';
	export const notificationDate: Date | null = null;
	export let handleUpdatePortrait: (() => void) | undefined = undefined;

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
	$: IconComponent = getNotificationIcon(notificationType);
</script>

<div
	class="p-4 mb-3 flex justify-between items-center shadow-custom rounded-md border border-solid border-stone-200"
>
	<div class=" flex">
		<div class={`rounded-lg inline-flex justify-center items-start mt-1 `}>
			<svelte:component this={IconComponent} />
		</div>
		<div class=" flex flex-col ml-4">
			<h3 class=" text-base text-stone-500">
				{@html notificationContent}
			</h3>
			<div class=" py-2">
				{#if notificationType === 'registrationSuccess'}
					<GradientButton onClick={() => handleUpdatePortrait?.()}
						>{$_('user-pages.notifications.updatePortrait')}</GradientButton
					>{:else if notificationType === 'registrationRejected'}
					<Button onClick={onActionButtonClick} classes="  shadow-custom  text-stone-800"
						>{$_('user-pages.notifications.contactSupport')}</Button
					>
				{/if}
			</div>
			<p class="mt-2 text-sm text-stone-400 font-medium">40 mins ago</p>
		</div>
	</div>
</div>
