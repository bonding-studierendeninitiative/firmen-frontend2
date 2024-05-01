import { ERROR_MESSAGE_KEYS } from '@constant';
import { z } from 'zod';

const { required } = ERROR_MESSAGE_KEYS;

const selectSchema = z.object({
	value: z.string(),
	label: z.string()
});

const addNewServiceSchema = z.object({
	serviceTitle: z.string().min(1, required),
	digit: z.string().min(1, required),
	included: selectSchema
		.nullable()
		.refine((included) => included !== null, {
			message: required,
			path: ['included']
		})
		.refine((included) => included !== undefined, {
			message: required,
			path: ['included']
		})
});
export const addPackageSchema = z.object({
	packageName: z.string().min(1, required),
	price: z.string().min(1, required),
	taxes: z.string().min(1, required),
	serviceTitle: z.string().min(1, required),
	included: selectSchema
		.nullable()
		.refine((included) => included !== null && included !== undefined, {
			message: required,
			path: ['included']
		}),
	services: z.array(addNewServiceSchema)
});
export type PackageFieldTypes = z.infer<typeof addPackageSchema>;
