import { ERROR_MESSAGE_KEYS } from '@constant';
import { z } from 'zod';

const { required, invalidEmail } = ERROR_MESSAGE_KEYS;
export const adminLoginSchema = z.object({
	email: z.string().email(invalidEmail).min(1, required),
	password: z.string().min(1, required)
});