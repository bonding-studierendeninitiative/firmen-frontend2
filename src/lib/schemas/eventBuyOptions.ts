import * as v from 'valibot';

export enum ValueType {
	String = 'STRING',
	Integer = 'INTEGER',
	Boolean = 'BOOLEAN'
}

export const GetBuyOptionsResponseSchema = v.object({
	eventId: v.string(),
	buyOptions: v.array(
		v.object({
			name: v.string(),
			packages: v.array(
				v.object({
					name: v.string(),
					price: v.nullable(v.number()),
					order: v.number(),
					benefits: v.array(
						v.object({
							numericValue: v.nullable(v.number()),
							stringValue: v.nullable(v.string()),
							booleanValue: v.nullable(v.boolean()),
						})
					)
				})
			),
			services: v.array(
				v.object({
					name: v.string(),
					description: v.nullable(v.string()),
					order: v.number(),
					valueType: v.enum(ValueType),
				})
			)
		})
	),
	pageNumber: v.number(),
	pageSize: v.number(),
	totalElements: v.number(),
	totalPages: v.number()
});

export const UpdateBuyOptionsResponseSchema = v.object({
	eventId: v.string(),
	buyOptions: v.array(
		v.object({
			name: v.string(),
			packages: v.array(
				v.object({
					name: v.string(),
					price: v.nullable(v.number()),
					order: v.number(),
					benefits: v.array(
						v.object({
							numericValue: v.nullable(v.number()),
							stringValue: v.nullable(v.string()),
							booleanValue: v.nullable(v.boolean()),
						})
					)
				})
			),
			services: v.array(
				v.object({
					name: v.string(),
					order: v.number(),
					description: v.nullable(v.string()),
					valueType: v.enum(ValueType),
				})
			)
		})
	)
});

export type GetBuyOptionsResponse = v.InferInput<typeof GetBuyOptionsResponseSchema>;

export type UpdateBuyOptionsResponse = v.InferInput<typeof UpdateBuyOptionsResponseSchema>;

export const UpdateBuyOptionsRequestSchema = v.object({
	buyOptions: v.array(
		v.object({
			name: v.string(),
			packages: v.array(
				v.object({
					name: v.string(),
					price: v.nullable(v.number()),
					order: v.number(),
					benefits: v.array(
						v.object({
							numericValue: v.nullable(v.number()),
							stringValue: v.nullable(v.string()),
							booleanValue: v.nullable(v.boolean()),
						})
					)
				})
			),
			services: v.array(
				v.object({
					name: v.string(),
					description: v.nullable(v.string(), ""),
					order: v.number(),
					valueType: v.enum(ValueType)
				})
			)
		})
	)
});

export type UpdateBuyOptionsRequest = v.InferInput<typeof UpdateBuyOptionsRequestSchema>;