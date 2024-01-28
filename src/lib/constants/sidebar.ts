// import {
// 	DashboardIcon,
// 	EventsIcon,
// 	PortraitIcon,
// 	NotificationIcon,
// 	AccountIcon
// } from '$lib/@svelte';
interface SidebarLinkTypes {
	label: string;
	route: string;
	Icon: 'DashboardIcon' | 'EventsIcon' | 'PortraitIcon' | 'NotificationIcon' | 'AccountIcon';
}
export const USER_SIDEBAR_LINKS: SidebarLinkTypes[] = [
	{
		label: 'Dashboard',
		route: '/dashboard',
		Icon: 'DashboardIcon'
	},
	{
		label: 'Events',
		route: '/events',
		Icon: 'EventsIcon'
	},
	{
		label: 'Portraits',
		route: '/portraits',
		Icon: 'PortraitIcon'
	},
	{
		label: 'Notifications',
		route: '/notifications',
		Icon: 'NotificationIcon'
	},
	{
		label: 'Account',
		route: '/account',
		Icon: 'AccountIcon'
	}
];

export const ADMIN_SIDEBAR_LINKS = [
	{
		label: 'Dashboard',
		route: '/dashboard',
		Icon: 'DashboardIcon'
	},
	{
		label: 'Kategorien',
		route: '/categories',
		Icon: 'EventsIcon'
	},
	{
		label: 'Packages',
		route: '/packages',
		Icon: 'EventsIcon'
	},
	{
		label: 'Add-ons',
		route: 'add-ons',
		Icon: 'EventsIcon'
	}
];
