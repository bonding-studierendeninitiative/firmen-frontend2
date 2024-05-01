import { ERROR_MESSAGE_KEYS } from '@constant';
import { z } from 'zod';

const { required } = ERROR_MESSAGE_KEYS;

const selectSchema = z.object({
	value: z.string(),
	label: z.string()
});
export const addCategorySchema = z.object({
	categoryName: z.string().min(1, required),
	categoryInformation: z.string().min(1, required),
	addons: z.array(selectSchema).min(1, required),
	packages: z.array(selectSchema).min(1, required)
});
export type categoryFieldTypes = z.infer<typeof addCategorySchema>;
