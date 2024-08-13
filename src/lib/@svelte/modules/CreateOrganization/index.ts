import { z } from 'zod';

export {
	default
		as CreateOrganization
} from './CreateOrganization.svelte';

export const formSchema = z.object({
	name: z.string().min(3, { message: 'At least 3 characters' }).max(30, { message: 'Max 30 characters' }),
	phone: z.string(),
	size: z.string(),
	email: z.string().email({ message: 'Invalid email' }),
	streetAddress: z.string().min(3, { message: 'At least 3 characters' }).max(30, { message: 'Max 40 characters' }),
	extendedAddress: z.string().max(150, { message: 'Max 150 characters' }).optional(),
	zipCode: z.string().min(3, { message: 'At least 3 characters' }).max(10, { message: 'Max 10 characters' }),
	locality: z.string().min(3, { message: 'At least 3 characters' }).max(40, { message: 'Max 40 characters' }),
	type: z.string()
});