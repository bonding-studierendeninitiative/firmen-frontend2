// import {
// 	DashboardIcon,
// 	EventsIcon,
// 	PortraitIcon,
// 	NotificationIcon,
// 	AccountIcon
// } from '$lib/@svelte';
export interface SidebarLinkTypes {
	label: string;
	route: string;
	Icon:
		| 'DashboardIcon'
		| 'EventsIcon'
		| 'PortraitIcon'
		| 'NotificationIcon'
		| 'AccountIcon'
		| 'CategoriesIcon'
		| 'PackagesIcon'
		| 'AddonIcon'
		| 'CompanyIcon'
		| 'SettingsIcon';
}
export const USER_SIDEBAR_LINKS: SidebarLinkTypes[] = [
	{
		label: 'dashboard',
		route: '/dashboard',
		Icon: 'DashboardIcon'
	},
	{
		label: 'events',
		route: '/events',
		Icon: 'EventsIcon'
	},
	{
		label: 'catalogue-data',
		route: '/catalogue-data',
		Icon: 'PortraitIcon'
	},
	{
		label: 'notifications',
		route: '/notifications',
		Icon: 'NotificationIcon'
	},
	{
		label: 'settings',
		route: '/settings',
		Icon: 'SettingsIcon'
	}
];

export const ADMIN_SIDEBAR_LINKS: SidebarLinkTypes[] = [
	{
		label: 'dashboard',
		route: '/admin/dashboard',
		Icon: 'DashboardIcon'
	},
	{
		label: 'events',
		route: '/admin/events',
		Icon: 'EventsIcon'
	},
	{
		label: 'company',
		route: '/admin/organizations',
		Icon: 'CompanyIcon'
	}
];
