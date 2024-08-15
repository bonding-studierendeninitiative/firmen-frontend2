import * as v from 'valibot';

const AddonPackageTemplateSchema = v.object({
	purchasable: v.nullable(v.boolean(), false),
	title: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
	price: v.nullable(v.number()),
	description: v.nullable(v.pipe(v.string(), v.maxLength(255)), ''),
	label: v.string(),
	addons: v.array(
		v.object({
			title: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
			label: v.string(),
			description: v.optional(v.pipe(v.string(), v.maxLength(255))),
			price: v.optional(v.number())
		})
	)
});
export const CreateAddonPackageTemplateSchema = v.pipe(
	AddonPackageTemplateSchema,
	v.transform((data) => {
		return {
			...data,
			price: data.purchasable ? data.price : null
		};
	})
);

export type CreateAddonPackageTemplateFormSchema = typeof CreateAddonPackageTemplateSchema;

export type CreateAddonPackageTemplateRequest = typeof CreateAddonPackageTemplateSchema;
export type CreateAddonPackageTemplateResponse = typeof CreateAddonPackageTemplateResponseSchema;

export const CreateAddonPackageTemplateResponseSchema = v.object({
	savedAddonPackage: AddonPackageTemplateSchema
});

export const GetAddonPackageTemplateResponseSchema = AddonPackageTemplateSchema;

export type GetAddonPackageTemplateResponse = typeof GetAddonPackageTemplateResponseSchema;

export const GetAddonPackageTemplatesResponseSchema = v.object({
	addonPackageTemplates: v.array(AddonPackageTemplateSchema),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export type GetAddonPackageTemplatesResponse = typeof GetAddonPackageTemplatesResponseSchema;
