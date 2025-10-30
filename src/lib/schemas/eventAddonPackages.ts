import * as v from 'valibot';

const EventAddonPackageSchema = v.object({
	purchasable: v.boolean(),
	title: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
	price: v.number(),
	description: v.optional(v.pipe(v.string(), v.maxLength(255))),
	label: v.string(),
	addons: v.optional(
		v.array(
			v.object({
				id: v.optional(v.string(), ''),
				title: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
				label: v.string(),
				description: v.optional(v.pipe(v.string(), v.maxLength(255)), ''),
				price: v.pipe(
					v.optional(v.string(), '0'),
					v.transform((val) => Number(val)),
					v.number()
				)
			})
		),
		[]
	)
});
export const CreateEventAddonPackageSchema = v.pipe(
	v.object({
		addonPackage: EventAddonPackageSchema,
		eventId: v.string(),
		buyOptionId: v.string()
	}),
	v.transform((data) => {
		return {
			...data,
			addonPackage: {
				...data.addonPackage,
				price: data.addonPackage.purchasable ? Number(data.addonPackage.price) : 0
			}
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
	totalElements: v.number()
});

export type GetEventAddonPackagesResponse = typeof GetEventAddonPackagesResponseSchema;

export const deleteEventAddonPackage = v.object({
	addonPackageId: v.string()
});

export type DeleteEventAddonPackage = typeof deleteEventAddonPackage;
