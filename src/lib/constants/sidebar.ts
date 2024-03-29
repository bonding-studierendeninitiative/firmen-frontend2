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
		| 'CompanyIcon';
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

export const ADMIN_SIDEBAR_LINKS: SidebarLinkTypes[] = [
	{
		label: 'Dashboard',
		route: '/admin/dashboard',
		Icon: 'DashboardIcon'
	},
	{
		label: 'Events',
		route: '/admin/events',
		Icon: 'EventsIcon'
	},
	{
		label: 'Categories',
		route: '/admin/categories',
		Icon: 'CategoriesIcon'
	},
	{
		label: 'Packages',
		route: '/admin/packages',
		Icon: 'PackagesIcon'
	},
	{
		label: 'Add-ons',
		route: '/admin/add-ons',
		Icon: 'AddonIcon'
	},
	{
		label: 'Company',
		route: '/admin/company',
		Icon: 'CompanyIcon'
	}
];
