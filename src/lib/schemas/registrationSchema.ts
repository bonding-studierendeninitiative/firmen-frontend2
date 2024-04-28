import { ERROR_MESSAGE_KEYS } from '@constant';
import { z } from 'zod';

const { required, passwordNotMatched } = ERROR_MESSAGE_KEYS;
export const registrationSchema = z
	.object({
		firstName: z.string().min(1, required),
		lastName: z.string().min(1, required),
		companyName: z.string().min(1, required),
		phoneNumber: z.string().min(1, required),
		email: z.string().email('invalidEmail').min(1, required),
		password: z.string().min(1, required),
		cPassword: z.string().min(1, required)
	})
	.refine(({ cPassword, password }) => password === cPassword, {
		message: passwordNotMatched,
		path: ['cPassword'] // path of error
	});
