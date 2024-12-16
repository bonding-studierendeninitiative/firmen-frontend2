import * as v from 'valibot';
import type { GenericSchema, ObjectSchema } from 'valibot';

export enum ValueType {
	String = 'STRING',
	Integer = 'INTEGER',
	Boolean = 'BOOLEAN'
}

export const GetBuyOptionsResponseSchema = v.object({
	eventId: v.string(),
	buyOptions: v.array(
		v.object({
			id: v.string(),
			name: v.string(),
			packagesCount: v.number(),
			servicesCount: v.number(),
			active: v.boolean()
		})
	),
	pageNumber: v.number(),
	pageSize: v.number(),
	totalElements: v.number(),
	totalPages: v.number()
});
export type GetBuyOptionsResponse = typeof GetBuyOptionsResponseSchema;

export const GetBuyOptionResponseSchema = v.object({
	id: v.string(),
	name: v.string(),
	packages: v.array(
		v.object({
			id: v.string(),
			name: v.string(),
			price: v.nullish(v.number()),
			benefits: v.array(
				v.object({
					numericValue: v.nullable(v.number()),
					stringValue: v.nullable(v.string()),
					booleanValue: v.nullable(v.boolean())
				})
			)
		})
	),
	services: v.array(
		v.object({
			name: v.string(),
			description: v.nullable(v.string()),
			valueType: v.enum(ValueType)
		})
	),
	active: v.boolean()
});
export type GetBuyOptionResponse = typeof GetBuyOptionResponseSchema;

export const UpdateBuyOptionsResponseSchema = v.object({
	eventId: v.string(),
	buyOptions: v.array(
		v.object({
			name: v.string(),
			packages: v.array(
				v.object({
					name: v.string(),
					price: v.nullish(v.number(), 0),
					benefits: v.array(
						v.object({
							numericValue: v.nullable(v.number()),
							stringValue: v.nullable(v.string()),
							booleanValue: v.nullable(v.boolean())
						})
					)
				})
			),
			services: v.array(
				v.object({
					name: v.string(),
					description: v.nullable(v.string()),
					valueType: v.enum(ValueType)
				})
			)
		})
	)
});

export type UpdateBuyOptionsResponse = typeof UpdateBuyOptionsResponseSchema;

export const UpdateBuyOptionsRequestSchema = v.object({
	buyOptions: v.array(
		v.object({
			name: v.string(),
			packages: v.array(
				v.object({
					name: v.string(),
					price: v.nullable(v.number()),
					benefits: v.array(
						v.object({
							numericValue: v.nullable(v.number()),
							stringValue: v.nullable(v.string()),
							booleanValue: v.nullable(v.boolean())
						})
					)
				})
			),
			services: v.array(
				v.object({
					name: v.string(),
					description: v.nullable(v.string(), ''),
					valueType: v.enum(ValueType)
				})
			)
		})
	)
});

export type UpdateBuyOptionsRequest = typeof UpdateBuyOptionsRequestSchema;

export const CreateBuyOptionRequestSchema = v.object({
	name: v.pipe(
		v.string('Name is required'),
		v.minLength(3, 'Mindestens 3 Zeichen'),
		v.maxLength(30, 'Maximal 30 Zeichen')
	),
	packageCount: v.optional(v.pipe(v.number(), v.maxValue(10), v.minValue(0)), 0),
	serviceCount: v.optional(v.number(), 0)
});

export const SimpleCreateBuyOptionRequestSchema = v.object({
	name: v.string('Name is required'),
	packageCount: v.optional(v.number(), 0),
	serviceCount: v.optional(v.number(), 0)
});

export type CreateBuyOptionRequest = typeof CreateBuyOptionRequestSchema;

export const UpdateBuyOptionRequestSchema = v.object({
	name: v.string(),
	packages: v.array(
		v.object({
			name: v.string(),
			price: v.nullable(v.number()),
			benefits: v.array(
				v.object({
					numericValue: v.nullable(v.number()),
					stringValue: v.nullable(v.string()),
					booleanValue: v.nullable(v.boolean())
				})
			)
		})
	),
	services: v.array(
		v.object({
			name: v.string(),
			description: v.nullable(v.string(), ''),
			valueType: v.enum(ValueType)
		})
	)
});

export type UpdateBuyOptionRequest = typeof UpdateBuyOptionRequestSchema;
