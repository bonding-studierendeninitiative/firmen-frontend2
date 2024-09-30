import { Building, Network, Star } from 'lucide-svelte';

export const orgTypes = [
	{ label: 'Gemeinnützig', value: 'nonprofit', icon: Star },
	{ label: 'Unternehmen', value: 'company', icon: Building },
	{ label: 'Organisation', value: 'other', icon: Network }
];
