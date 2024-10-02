import * as v from 'valibot';

const EventAddonPackageSchema = v.object({
	purchasable: v.nullable(v.boolean(), false),
	title: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
	price: v.nullable(v.number()),
	description: v.nullable(v.pipe(v.string(), v.maxLength(255)), ''),
	label: v.string(),
	addons: v.array(
		v.object({
			id: v.nullish(v.string()),
			title: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
			label: v.string(),
			description: v.optional(v.pipe(v.string(), v.maxLength(255))),
			price: v.optional(v.number())
		})
	)
});
export const CreateEventAddonPackageSchema = v.pipe(
	v.object({
		addonPackage: EventAddonPackageSchema
	}),
	v.transform((data) => {
		return {
			...data,
			price: data.addonPackage.purchasable ? data.addonPackage.price : null
		};
	})
);

export type CreateEventAddonPackageFormSchema = typeof CreateEventAddonPackageSchema;

export type CreateEventAddonPackageRequest = typeof CreateEventAddonPackageSchema;
export type CreateEventAddonPackageResponse = typeof CreateEventAddonPackageResponseSchema;

export const CreateEventAddonPackageResponseSchema = v.object({
	savedAddonPackage: EventAddonPackageSchema
});

export const GetEventAddonPackageResponseSchema = EventAddonPackageSchema;

export type GetEventAddonPackageResponse = typeof GetEventAddonPackageResponseSchema;

export const GetEventAddonPackagesResponseSchema = v.object({
	addonPackages: v.array(
		v.object({
			...EventAddonPackageSchema.entries,
			...v.object({ id: v.string() }).entries
		})
	),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export type GetEventAddonPackagesResponse = typeof GetEventAddonPackagesResponseSchema;

export const deleteEventAddonPackage = v.object({
	addonPackageId: v.string()
});

export type DeleteEventAddonPackage = typeof deleteEventAddonPackage;
