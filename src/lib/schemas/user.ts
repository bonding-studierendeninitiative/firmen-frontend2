import { minLength, object, pipe, string } from 'valibot';

export const UpdateUserDetailsRequest = object({
	phone: pipe(string(), minLength(3)),
	title: pipe(string(), minLength(3)),
	position: pipe(string(), minLength(3))
});

export type UpdateUserDetails = typeof UpdateUserDetailsRequest;
