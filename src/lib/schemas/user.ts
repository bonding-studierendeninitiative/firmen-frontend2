import { object, string } from 'valibot';

export const UpdateUserDetailsRequest = object({
	phone: string(),
	title: string(),
	position: string()
});

export type UpdateUserDetails = typeof UpdateUserDetailsRequest;
