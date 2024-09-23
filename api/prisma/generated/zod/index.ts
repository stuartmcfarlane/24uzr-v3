import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','name','password','salt','isAdmin']);

export const ShipScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','ownerId']);

export const MapScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name']);

export const BuoyScalarFieldEnumSchema = z.enum(['id','name','lat','lng','mapId']);

export const LegScalarFieldEnumSchema = z.enum(['id','mapId','startBuoyId','endBuoyId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  email: z.string(),
  name: z.string().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SHIP SCHEMA
/////////////////////////////////////////

export const ShipSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  ownerId: z.number().int(),
})

export type Ship = z.infer<typeof ShipSchema>

/////////////////////////////////////////
// MAP SCHEMA
/////////////////////////////////////////

export const MapSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
})

export type Map = z.infer<typeof MapSchema>

/////////////////////////////////////////
// BUOY SCHEMA
/////////////////////////////////////////

export const BuoySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  lat: z.instanceof(Prisma.Decimal, { message: "Field 'lat' must be a Decimal. Location: ['Models', 'Buoy']"}),
  lng: z.instanceof(Prisma.Decimal, { message: "Field 'lng' must be a Decimal. Location: ['Models', 'Buoy']"}),
  mapId: z.number().int(),
})

export type Buoy = z.infer<typeof BuoySchema>

/////////////////////////////////////////
// LEG SCHEMA
/////////////////////////////////////////

export const LegSchema = z.object({
  id: z.number().int(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
})

export type Leg = z.infer<typeof LegSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  ships: z.union([z.boolean(),z.lazy(() => ShipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  ships: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  password: z.boolean().optional(),
  salt: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  ships: z.union([z.boolean(),z.lazy(() => ShipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SHIP
//------------------------------------------------------

export const ShipIncludeSchema: z.ZodType<Prisma.ShipInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ShipArgsSchema: z.ZodType<Prisma.ShipDefaultArgs> = z.object({
  select: z.lazy(() => ShipSelectSchema).optional(),
  include: z.lazy(() => ShipIncludeSchema).optional(),
}).strict();

export const ShipSelectSchema: z.ZodType<Prisma.ShipSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// MAP
//------------------------------------------------------

export const MapIncludeSchema: z.ZodType<Prisma.MapInclude> = z.object({
  Buoy: z.union([z.boolean(),z.lazy(() => BuoyFindManyArgsSchema)]).optional(),
  Leg: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MapCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const MapArgsSchema: z.ZodType<Prisma.MapDefaultArgs> = z.object({
  select: z.lazy(() => MapSelectSchema).optional(),
  include: z.lazy(() => MapIncludeSchema).optional(),
}).strict();

export const MapCountOutputTypeArgsSchema: z.ZodType<Prisma.MapCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MapCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MapCountOutputTypeSelectSchema: z.ZodType<Prisma.MapCountOutputTypeSelect> = z.object({
  Buoy: z.boolean().optional(),
  Leg: z.boolean().optional(),
}).strict();

export const MapSelectSchema: z.ZodType<Prisma.MapSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  Buoy: z.union([z.boolean(),z.lazy(() => BuoyFindManyArgsSchema)]).optional(),
  Leg: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MapCountOutputTypeArgsSchema)]).optional(),
}).strict()

// BUOY
//------------------------------------------------------

export const BuoyIncludeSchema: z.ZodType<Prisma.BuoyInclude> = z.object({
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
}).strict()

export const BuoyArgsSchema: z.ZodType<Prisma.BuoyDefaultArgs> = z.object({
  select: z.lazy(() => BuoySelectSchema).optional(),
  include: z.lazy(() => BuoyIncludeSchema).optional(),
}).strict();

export const BuoySelectSchema: z.ZodType<Prisma.BuoySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  lat: z.boolean().optional(),
  lng: z.boolean().optional(),
  mapId: z.boolean().optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
}).strict()

// LEG
//------------------------------------------------------

export const LegIncludeSchema: z.ZodType<Prisma.LegInclude> = z.object({
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
}).strict()

export const LegArgsSchema: z.ZodType<Prisma.LegDefaultArgs> = z.object({
  select: z.lazy(() => LegSelectSchema).optional(),
  include: z.lazy(() => LegIncludeSchema).optional(),
}).strict();

export const LegSelectSchema: z.ZodType<Prisma.LegSelect> = z.object({
  id: z.boolean().optional(),
  mapId: z.boolean().optional(),
  startBuoyId: z.boolean().optional(),
  endBuoyId: z.boolean().optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  salt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isAdmin: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  ships: z.lazy(() => ShipListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  salt: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  ships: z.lazy(() => ShipOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    email: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  salt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isAdmin: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  ships: z.lazy(() => ShipListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  salt: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  salt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isAdmin: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const ShipWhereInputSchema: z.ZodType<Prisma.ShipWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShipWhereInputSchema),z.lazy(() => ShipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShipWhereInputSchema),z.lazy(() => ShipWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ShipOrderByWithRelationInputSchema: z.ZodType<Prisma.ShipOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ShipWhereUniqueInputSchema: z.ZodType<Prisma.ShipWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ShipWhereInputSchema),z.lazy(() => ShipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShipWhereInputSchema),z.lazy(() => ShipWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ShipOrderByWithAggregationInputSchema: z.ZodType<Prisma.ShipOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ShipCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ShipAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ShipMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ShipMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ShipSumOrderByAggregateInputSchema).optional()
}).strict();

export const ShipScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ShipScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ShipScalarWhereWithAggregatesInputSchema),z.lazy(() => ShipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShipScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShipScalarWhereWithAggregatesInputSchema),z.lazy(() => ShipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const MapWhereInputSchema: z.ZodType<Prisma.MapWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MapWhereInputSchema),z.lazy(() => MapWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MapWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MapWhereInputSchema),z.lazy(() => MapWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Buoy: z.lazy(() => BuoyListRelationFilterSchema).optional(),
  Leg: z.lazy(() => LegListRelationFilterSchema).optional()
}).strict();

export const MapOrderByWithRelationInputSchema: z.ZodType<Prisma.MapOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  Buoy: z.lazy(() => BuoyOrderByRelationAggregateInputSchema).optional(),
  Leg: z.lazy(() => LegOrderByRelationAggregateInputSchema).optional()
}).strict();

export const MapWhereUniqueInputSchema: z.ZodType<Prisma.MapWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => MapWhereInputSchema),z.lazy(() => MapWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MapWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MapWhereInputSchema),z.lazy(() => MapWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Buoy: z.lazy(() => BuoyListRelationFilterSchema).optional(),
  Leg: z.lazy(() => LegListRelationFilterSchema).optional()
}).strict());

export const MapOrderByWithAggregationInputSchema: z.ZodType<Prisma.MapOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MapCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MapAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MapMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MapMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MapSumOrderByAggregateInputSchema).optional()
}).strict();

export const MapScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MapScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MapScalarWhereWithAggregatesInputSchema),z.lazy(() => MapScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MapScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MapScalarWhereWithAggregatesInputSchema),z.lazy(() => MapScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const BuoyWhereInputSchema: z.ZodType<Prisma.BuoyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BuoyWhereInputSchema),z.lazy(() => BuoyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BuoyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BuoyWhereInputSchema),z.lazy(() => BuoyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
}).strict();

export const BuoyOrderByWithRelationInputSchema: z.ZodType<Prisma.BuoyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional()
}).strict();

export const BuoyWhereUniqueInputSchema: z.ZodType<Prisma.BuoyWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => BuoyWhereInputSchema),z.lazy(() => BuoyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BuoyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BuoyWhereInputSchema),z.lazy(() => BuoyWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
}).strict());

export const BuoyOrderByWithAggregationInputSchema: z.ZodType<Prisma.BuoyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BuoyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => BuoyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BuoyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BuoyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => BuoySumOrderByAggregateInputSchema).optional()
}).strict();

export const BuoyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BuoyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BuoyScalarWhereWithAggregatesInputSchema),z.lazy(() => BuoyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BuoyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BuoyScalarWhereWithAggregatesInputSchema),z.lazy(() => BuoyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  mapId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const LegWhereInputSchema: z.ZodType<Prisma.LegWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LegWhereInputSchema),z.lazy(() => LegWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegWhereInputSchema),z.lazy(() => LegWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
}).strict();

export const LegOrderByWithRelationInputSchema: z.ZodType<Prisma.LegOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional()
}).strict();

export const LegWhereUniqueInputSchema: z.ZodType<Prisma.LegWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => LegWhereInputSchema),z.lazy(() => LegWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegWhereInputSchema),z.lazy(() => LegWhereInputSchema).array() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
}).strict());

export const LegOrderByWithAggregationInputSchema: z.ZodType<Prisma.LegOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LegCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LegAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LegMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LegMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LegSumOrderByAggregateInputSchema).optional()
}).strict();

export const LegScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LegScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LegScalarWhereWithAggregatesInputSchema),z.lazy(() => LegScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegScalarWhereWithAggregatesInputSchema),z.lazy(() => LegScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  mapId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  ships: z.lazy(() => ShipCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  ships: z.lazy(() => ShipUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ships: z.lazy(() => ShipUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ships: z.lazy(() => ShipUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipCreateInputSchema: z.ZodType<Prisma.ShipCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutShipsInputSchema)
}).strict();

export const ShipUncheckedCreateInputSchema: z.ZodType<Prisma.ShipUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int()
}).strict();

export const ShipUpdateInputSchema: z.ZodType<Prisma.ShipUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutShipsNestedInputSchema).optional()
}).strict();

export const ShipUncheckedUpdateInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipCreateManyInputSchema: z.ZodType<Prisma.ShipCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int()
}).strict();

export const ShipUpdateManyMutationInputSchema: z.ZodType<Prisma.ShipUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MapCreateInputSchema: z.ZodType<Prisma.MapCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  Buoy: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Leg: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateInputSchema: z.ZodType<Prisma.MapUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  Buoy: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Leg: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUpdateInputSchema: z.ZodType<Prisma.MapUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoy: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Leg: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateInputSchema: z.ZodType<Prisma.MapUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoy: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Leg: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapCreateManyInputSchema: z.ZodType<Prisma.MapCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const MapUpdateManyMutationInputSchema: z.ZodType<Prisma.MapUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MapUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MapUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyCreateInputSchema: z.ZodType<Prisma.BuoyCreateInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoyInputSchema)
}).strict();

export const BuoyUncheckedCreateInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int()
}).strict();

export const BuoyUpdateInputSchema: z.ZodType<Prisma.BuoyUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyCreateManyInputSchema: z.ZodType<Prisma.BuoyCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int()
}).strict();

export const BuoyUpdateManyMutationInputSchema: z.ZodType<Prisma.BuoyUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegCreateInputSchema: z.ZodType<Prisma.LegCreateInput> = z.object({
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  map: z.lazy(() => MapCreateNestedOneWithoutLegInputSchema)
}).strict();

export const LegUncheckedCreateInputSchema: z.ZodType<Prisma.LegUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int()
}).strict();

export const LegUpdateInputSchema: z.ZodType<Prisma.LegUpdateInput> = z.object({
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutLegNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateInputSchema: z.ZodType<Prisma.LegUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegCreateManyInputSchema: z.ZodType<Prisma.LegCreateManyInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int()
}).strict();

export const LegUpdateManyMutationInputSchema: z.ZodType<Prisma.LegUpdateManyMutationInput> = z.object({
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LegUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const ShipListRelationFilterSchema: z.ZodType<Prisma.ShipListRelationFilter> = z.object({
  every: z.lazy(() => ShipWhereInputSchema).optional(),
  some: z.lazy(() => ShipWhereInputSchema).optional(),
  none: z.lazy(() => ShipWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ShipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ShipOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  salt: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  salt: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  salt: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ShipCountOrderByAggregateInputSchema: z.ZodType<Prisma.ShipCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShipAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ShipAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShipMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ShipMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShipMinOrderByAggregateInputSchema: z.ZodType<Prisma.ShipMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShipSumOrderByAggregateInputSchema: z.ZodType<Prisma.ShipSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const BuoyListRelationFilterSchema: z.ZodType<Prisma.BuoyListRelationFilter> = z.object({
  every: z.lazy(() => BuoyWhereInputSchema).optional(),
  some: z.lazy(() => BuoyWhereInputSchema).optional(),
  none: z.lazy(() => BuoyWhereInputSchema).optional()
}).strict();

export const LegListRelationFilterSchema: z.ZodType<Prisma.LegListRelationFilter> = z.object({
  every: z.lazy(() => LegWhereInputSchema).optional(),
  some: z.lazy(() => LegWhereInputSchema).optional(),
  none: z.lazy(() => LegWhereInputSchema).optional()
}).strict();

export const BuoyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BuoyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LegOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapCountOrderByAggregateInputSchema: z.ZodType<Prisma.MapCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MapAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MapMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapMinOrderByAggregateInputSchema: z.ZodType<Prisma.MapMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapSumOrderByAggregateInputSchema: z.ZodType<Prisma.MapSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const MapRelationFilterSchema: z.ZodType<Prisma.MapRelationFilter> = z.object({
  is: z.lazy(() => MapWhereInputSchema).optional(),
  isNot: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const BuoyCountOrderByAggregateInputSchema: z.ZodType<Prisma.BuoyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BuoyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.BuoyAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BuoyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BuoyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BuoyMinOrderByAggregateInputSchema: z.ZodType<Prisma.BuoyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BuoySumOrderByAggregateInputSchema: z.ZodType<Prisma.BuoySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const LegCountOrderByAggregateInputSchema: z.ZodType<Prisma.LegCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LegAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LegMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegMinOrderByAggregateInputSchema: z.ZodType<Prisma.LegMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegSumOrderByAggregateInputSchema: z.ZodType<Prisma.LegSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShipCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.ShipCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => ShipCreateWithoutOwnerInputSchema),z.lazy(() => ShipCreateWithoutOwnerInputSchema).array(),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShipCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShipUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => ShipCreateWithoutOwnerInputSchema),z.lazy(() => ShipCreateWithoutOwnerInputSchema).array(),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShipCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const ShipUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.ShipUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShipCreateWithoutOwnerInputSchema),z.lazy(() => ShipCreateWithoutOwnerInputSchema).array(),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShipUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ShipUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShipCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShipUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ShipUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShipUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => ShipUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShipScalarWhereInputSchema),z.lazy(() => ShipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ShipUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShipCreateWithoutOwnerInputSchema),z.lazy(() => ShipCreateWithoutOwnerInputSchema).array(),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShipUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ShipUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShipCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShipUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ShipUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShipUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => ShipUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShipScalarWhereInputSchema),z.lazy(() => ShipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutShipsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutShipsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutShipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutShipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const UserUpdateOneRequiredWithoutShipsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutShipsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutShipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutShipsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutShipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutShipsInputSchema),z.lazy(() => UserUpdateWithoutShipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShipsInputSchema) ]).optional(),
}).strict();

export const BuoyCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.BuoyCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutMapInputSchema),z.lazy(() => BuoyCreateWithoutMapInputSchema).array(),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BuoyCreateOrConnectWithoutMapInputSchema),z.lazy(() => BuoyCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BuoyCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LegCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.LegCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutMapInputSchema),z.lazy(() => LegCreateWithoutMapInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutMapInputSchema),z.lazy(() => LegCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BuoyUncheckedCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutMapInputSchema),z.lazy(() => BuoyCreateWithoutMapInputSchema).array(),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BuoyCreateOrConnectWithoutMapInputSchema),z.lazy(() => BuoyCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BuoyCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LegUncheckedCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.LegUncheckedCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutMapInputSchema),z.lazy(() => LegCreateWithoutMapInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutMapInputSchema),z.lazy(() => LegCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BuoyUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.BuoyUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutMapInputSchema),z.lazy(() => BuoyCreateWithoutMapInputSchema).array(),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BuoyCreateOrConnectWithoutMapInputSchema),z.lazy(() => BuoyCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BuoyUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => BuoyUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BuoyCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BuoyUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => BuoyUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BuoyUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => BuoyUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BuoyScalarWhereInputSchema),z.lazy(() => BuoyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LegUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.LegUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutMapInputSchema),z.lazy(() => LegCreateWithoutMapInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutMapInputSchema),z.lazy(() => LegCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => LegUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => LegUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => LegUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegScalarWhereInputSchema),z.lazy(() => LegScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BuoyUncheckedUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutMapInputSchema),z.lazy(() => BuoyCreateWithoutMapInputSchema).array(),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BuoyCreateOrConnectWithoutMapInputSchema),z.lazy(() => BuoyCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BuoyUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => BuoyUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BuoyCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BuoyWhereUniqueInputSchema),z.lazy(() => BuoyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BuoyUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => BuoyUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BuoyUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => BuoyUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BuoyScalarWhereInputSchema),z.lazy(() => BuoyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LegUncheckedUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.LegUncheckedUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutMapInputSchema),z.lazy(() => LegCreateWithoutMapInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutMapInputSchema),z.lazy(() => LegCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => LegUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => LegUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => LegUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegScalarWhereInputSchema),z.lazy(() => LegScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MapCreateNestedOneWithoutBuoyInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutBuoyInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutBuoyInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutBuoyInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const MapUpdateOneRequiredWithoutBuoyNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutBuoyInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutBuoyInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutBuoyInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutBuoyInputSchema),z.lazy(() => MapUpdateWithoutBuoyInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBuoyInputSchema) ]).optional(),
}).strict();

export const MapCreateNestedOneWithoutLegInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutLegInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutLegInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutLegInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const MapUpdateOneRequiredWithoutLegNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutLegNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutLegInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutLegInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutLegInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutLegInputSchema),z.lazy(() => MapUpdateWithoutLegInputSchema),z.lazy(() => MapUncheckedUpdateWithoutLegInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const ShipCreateWithoutOwnerInputSchema: z.ZodType<Prisma.ShipCreateWithoutOwnerInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const ShipUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const ShipCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.ShipCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => ShipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShipCreateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const ShipCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.ShipCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShipCreateManyOwnerInputSchema),z.lazy(() => ShipCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ShipUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => ShipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShipUpdateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => ShipCreateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const ShipUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => ShipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShipUpdateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const ShipUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => ShipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShipUpdateManyMutationInputSchema),z.lazy(() => ShipUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const ShipScalarWhereInputSchema: z.ZodType<Prisma.ShipScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShipScalarWhereInputSchema),z.lazy(() => ShipScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShipScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShipScalarWhereInputSchema),z.lazy(() => ShipScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const UserCreateWithoutShipsInputSchema: z.ZodType<Prisma.UserCreateWithoutShipsInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional()
}).strict();

export const UserUncheckedCreateWithoutShipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutShipsInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional()
}).strict();

export const UserCreateOrConnectWithoutShipsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutShipsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutShipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShipsInputSchema) ]),
}).strict();

export const UserUpsertWithoutShipsInputSchema: z.ZodType<Prisma.UserUpsertWithoutShipsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutShipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShipsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutShipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShipsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutShipsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutShipsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutShipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShipsInputSchema) ]),
}).strict();

export const UserUpdateWithoutShipsInputSchema: z.ZodType<Prisma.UserUpdateWithoutShipsInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateWithoutShipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutShipsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyCreateWithoutMapInputSchema: z.ZodType<Prisma.BuoyCreateWithoutMapInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const BuoyUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const BuoyCreateOrConnectWithoutMapInputSchema: z.ZodType<Prisma.BuoyCreateOrConnectWithoutMapInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BuoyCreateWithoutMapInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const BuoyCreateManyMapInputEnvelopeSchema: z.ZodType<Prisma.BuoyCreateManyMapInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BuoyCreateManyMapInputSchema),z.lazy(() => BuoyCreateManyMapInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const LegCreateWithoutMapInputSchema: z.ZodType<Prisma.LegCreateWithoutMapInput> = z.object({
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int()
}).strict();

export const LegUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.LegUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int()
}).strict();

export const LegCreateOrConnectWithoutMapInputSchema: z.ZodType<Prisma.LegCreateOrConnectWithoutMapInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LegCreateWithoutMapInputSchema),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const LegCreateManyMapInputEnvelopeSchema: z.ZodType<Prisma.LegCreateManyMapInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LegCreateManyMapInputSchema),z.lazy(() => LegCreateManyMapInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BuoyUpsertWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.BuoyUpsertWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BuoyUpdateWithoutMapInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutMapInputSchema) ]),
  create: z.union([ z.lazy(() => BuoyCreateWithoutMapInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const BuoyUpdateWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.BuoyUpdateWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BuoyUpdateWithoutMapInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutMapInputSchema) ]),
}).strict();

export const BuoyUpdateManyWithWhereWithoutMapInputSchema: z.ZodType<Prisma.BuoyUpdateManyWithWhereWithoutMapInput> = z.object({
  where: z.lazy(() => BuoyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BuoyUpdateManyMutationInputSchema),z.lazy(() => BuoyUncheckedUpdateManyWithoutMapInputSchema) ]),
}).strict();

export const BuoyScalarWhereInputSchema: z.ZodType<Prisma.BuoyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BuoyScalarWhereInputSchema),z.lazy(() => BuoyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BuoyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BuoyScalarWhereInputSchema),z.lazy(() => BuoyScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const LegUpsertWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.LegUpsertWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LegUpdateWithoutMapInputSchema),z.lazy(() => LegUncheckedUpdateWithoutMapInputSchema) ]),
  create: z.union([ z.lazy(() => LegCreateWithoutMapInputSchema),z.lazy(() => LegUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const LegUpdateWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.LegUpdateWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LegUpdateWithoutMapInputSchema),z.lazy(() => LegUncheckedUpdateWithoutMapInputSchema) ]),
}).strict();

export const LegUpdateManyWithWhereWithoutMapInputSchema: z.ZodType<Prisma.LegUpdateManyWithWhereWithoutMapInput> = z.object({
  where: z.lazy(() => LegScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LegUpdateManyMutationInputSchema),z.lazy(() => LegUncheckedUpdateManyWithoutMapInputSchema) ]),
}).strict();

export const LegScalarWhereInputSchema: z.ZodType<Prisma.LegScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LegScalarWhereInputSchema),z.lazy(() => LegScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegScalarWhereInputSchema),z.lazy(() => LegScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const MapCreateWithoutBuoyInputSchema: z.ZodType<Prisma.MapCreateWithoutBuoyInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  Leg: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutBuoyInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  Leg: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutBuoyInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutBuoyInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutBuoyInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoyInputSchema) ]),
}).strict();

export const MapUpsertWithoutBuoyInputSchema: z.ZodType<Prisma.MapUpsertWithoutBuoyInput> = z.object({
  update: z.union([ z.lazy(() => MapUpdateWithoutBuoyInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBuoyInputSchema) ]),
  create: z.union([ z.lazy(() => MapCreateWithoutBuoyInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoyInputSchema) ]),
  where: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const MapUpdateToOneWithWhereWithoutBuoyInputSchema: z.ZodType<Prisma.MapUpdateToOneWithWhereWithoutBuoyInput> = z.object({
  where: z.lazy(() => MapWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MapUpdateWithoutBuoyInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBuoyInputSchema) ]),
}).strict();

export const MapUpdateWithoutBuoyInputSchema: z.ZodType<Prisma.MapUpdateWithoutBuoyInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Leg: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutBuoyInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Leg: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapCreateWithoutLegInputSchema: z.ZodType<Prisma.MapCreateWithoutLegInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  Buoy: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutLegInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutLegInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  Buoy: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutLegInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutLegInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutLegInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegInputSchema) ]),
}).strict();

export const MapUpsertWithoutLegInputSchema: z.ZodType<Prisma.MapUpsertWithoutLegInput> = z.object({
  update: z.union([ z.lazy(() => MapUpdateWithoutLegInputSchema),z.lazy(() => MapUncheckedUpdateWithoutLegInputSchema) ]),
  create: z.union([ z.lazy(() => MapCreateWithoutLegInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegInputSchema) ]),
  where: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const MapUpdateToOneWithWhereWithoutLegInputSchema: z.ZodType<Prisma.MapUpdateToOneWithWhereWithoutLegInput> = z.object({
  where: z.lazy(() => MapWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MapUpdateWithoutLegInputSchema),z.lazy(() => MapUncheckedUpdateWithoutLegInputSchema) ]),
}).strict();

export const MapUpdateWithoutLegInputSchema: z.ZodType<Prisma.MapUpdateWithoutLegInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoy: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutLegInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutLegInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoy: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const ShipCreateManyOwnerInputSchema: z.ZodType<Prisma.ShipCreateManyOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const ShipUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUpdateWithoutOwnerInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyCreateManyMapInputSchema: z.ZodType<Prisma.BuoyCreateManyMapInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const LegCreateManyMapInputSchema: z.ZodType<Prisma.LegCreateManyMapInput> = z.object({
  id: z.number().int().optional(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int()
}).strict();

export const BuoyUpdateWithoutMapInputSchema: z.ZodType<Prisma.BuoyUpdateWithoutMapInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegUpdateWithoutMapInputSchema: z.ZodType<Prisma.LegUpdateWithoutMapInput> = z.object({
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.LegUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.LegUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const ShipFindFirstArgsSchema: z.ZodType<Prisma.ShipFindFirstArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereInputSchema.optional(),
  orderBy: z.union([ ShipOrderByWithRelationInputSchema.array(),ShipOrderByWithRelationInputSchema ]).optional(),
  cursor: ShipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShipScalarFieldEnumSchema,ShipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShipFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ShipFindFirstOrThrowArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereInputSchema.optional(),
  orderBy: z.union([ ShipOrderByWithRelationInputSchema.array(),ShipOrderByWithRelationInputSchema ]).optional(),
  cursor: ShipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShipScalarFieldEnumSchema,ShipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShipFindManyArgsSchema: z.ZodType<Prisma.ShipFindManyArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereInputSchema.optional(),
  orderBy: z.union([ ShipOrderByWithRelationInputSchema.array(),ShipOrderByWithRelationInputSchema ]).optional(),
  cursor: ShipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShipScalarFieldEnumSchema,ShipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShipAggregateArgsSchema: z.ZodType<Prisma.ShipAggregateArgs> = z.object({
  where: ShipWhereInputSchema.optional(),
  orderBy: z.union([ ShipOrderByWithRelationInputSchema.array(),ShipOrderByWithRelationInputSchema ]).optional(),
  cursor: ShipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShipGroupByArgsSchema: z.ZodType<Prisma.ShipGroupByArgs> = z.object({
  where: ShipWhereInputSchema.optional(),
  orderBy: z.union([ ShipOrderByWithAggregationInputSchema.array(),ShipOrderByWithAggregationInputSchema ]).optional(),
  by: ShipScalarFieldEnumSchema.array(),
  having: ShipScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShipFindUniqueArgsSchema: z.ZodType<Prisma.ShipFindUniqueArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereUniqueInputSchema,
}).strict() ;

export const ShipFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ShipFindUniqueOrThrowArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereUniqueInputSchema,
}).strict() ;

export const MapFindFirstArgsSchema: z.ZodType<Prisma.MapFindFirstArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereInputSchema.optional(),
  orderBy: z.union([ MapOrderByWithRelationInputSchema.array(),MapOrderByWithRelationInputSchema ]).optional(),
  cursor: MapWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MapScalarFieldEnumSchema,MapScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MapFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MapFindFirstOrThrowArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereInputSchema.optional(),
  orderBy: z.union([ MapOrderByWithRelationInputSchema.array(),MapOrderByWithRelationInputSchema ]).optional(),
  cursor: MapWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MapScalarFieldEnumSchema,MapScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MapFindManyArgsSchema: z.ZodType<Prisma.MapFindManyArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereInputSchema.optional(),
  orderBy: z.union([ MapOrderByWithRelationInputSchema.array(),MapOrderByWithRelationInputSchema ]).optional(),
  cursor: MapWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MapScalarFieldEnumSchema,MapScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MapAggregateArgsSchema: z.ZodType<Prisma.MapAggregateArgs> = z.object({
  where: MapWhereInputSchema.optional(),
  orderBy: z.union([ MapOrderByWithRelationInputSchema.array(),MapOrderByWithRelationInputSchema ]).optional(),
  cursor: MapWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MapGroupByArgsSchema: z.ZodType<Prisma.MapGroupByArgs> = z.object({
  where: MapWhereInputSchema.optional(),
  orderBy: z.union([ MapOrderByWithAggregationInputSchema.array(),MapOrderByWithAggregationInputSchema ]).optional(),
  by: MapScalarFieldEnumSchema.array(),
  having: MapScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MapFindUniqueArgsSchema: z.ZodType<Prisma.MapFindUniqueArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereUniqueInputSchema,
}).strict() ;

export const MapFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MapFindUniqueOrThrowArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereUniqueInputSchema,
}).strict() ;

export const BuoyFindFirstArgsSchema: z.ZodType<Prisma.BuoyFindFirstArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereInputSchema.optional(),
  orderBy: z.union([ BuoyOrderByWithRelationInputSchema.array(),BuoyOrderByWithRelationInputSchema ]).optional(),
  cursor: BuoyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BuoyScalarFieldEnumSchema,BuoyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BuoyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BuoyFindFirstOrThrowArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereInputSchema.optional(),
  orderBy: z.union([ BuoyOrderByWithRelationInputSchema.array(),BuoyOrderByWithRelationInputSchema ]).optional(),
  cursor: BuoyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BuoyScalarFieldEnumSchema,BuoyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BuoyFindManyArgsSchema: z.ZodType<Prisma.BuoyFindManyArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereInputSchema.optional(),
  orderBy: z.union([ BuoyOrderByWithRelationInputSchema.array(),BuoyOrderByWithRelationInputSchema ]).optional(),
  cursor: BuoyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BuoyScalarFieldEnumSchema,BuoyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BuoyAggregateArgsSchema: z.ZodType<Prisma.BuoyAggregateArgs> = z.object({
  where: BuoyWhereInputSchema.optional(),
  orderBy: z.union([ BuoyOrderByWithRelationInputSchema.array(),BuoyOrderByWithRelationInputSchema ]).optional(),
  cursor: BuoyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BuoyGroupByArgsSchema: z.ZodType<Prisma.BuoyGroupByArgs> = z.object({
  where: BuoyWhereInputSchema.optional(),
  orderBy: z.union([ BuoyOrderByWithAggregationInputSchema.array(),BuoyOrderByWithAggregationInputSchema ]).optional(),
  by: BuoyScalarFieldEnumSchema.array(),
  having: BuoyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BuoyFindUniqueArgsSchema: z.ZodType<Prisma.BuoyFindUniqueArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereUniqueInputSchema,
}).strict() ;

export const BuoyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BuoyFindUniqueOrThrowArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereUniqueInputSchema,
}).strict() ;

export const LegFindFirstArgsSchema: z.ZodType<Prisma.LegFindFirstArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereInputSchema.optional(),
  orderBy: z.union([ LegOrderByWithRelationInputSchema.array(),LegOrderByWithRelationInputSchema ]).optional(),
  cursor: LegWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LegScalarFieldEnumSchema,LegScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LegFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LegFindFirstOrThrowArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereInputSchema.optional(),
  orderBy: z.union([ LegOrderByWithRelationInputSchema.array(),LegOrderByWithRelationInputSchema ]).optional(),
  cursor: LegWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LegScalarFieldEnumSchema,LegScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LegFindManyArgsSchema: z.ZodType<Prisma.LegFindManyArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereInputSchema.optional(),
  orderBy: z.union([ LegOrderByWithRelationInputSchema.array(),LegOrderByWithRelationInputSchema ]).optional(),
  cursor: LegWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LegScalarFieldEnumSchema,LegScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LegAggregateArgsSchema: z.ZodType<Prisma.LegAggregateArgs> = z.object({
  where: LegWhereInputSchema.optional(),
  orderBy: z.union([ LegOrderByWithRelationInputSchema.array(),LegOrderByWithRelationInputSchema ]).optional(),
  cursor: LegWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LegGroupByArgsSchema: z.ZodType<Prisma.LegGroupByArgs> = z.object({
  where: LegWhereInputSchema.optional(),
  orderBy: z.union([ LegOrderByWithAggregationInputSchema.array(),LegOrderByWithAggregationInputSchema ]).optional(),
  by: LegScalarFieldEnumSchema.array(),
  having: LegScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LegFindUniqueArgsSchema: z.ZodType<Prisma.LegFindUniqueArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereUniqueInputSchema,
}).strict() ;

export const LegFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LegFindUniqueOrThrowArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const ShipCreateArgsSchema: z.ZodType<Prisma.ShipCreateArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  data: z.union([ ShipCreateInputSchema,ShipUncheckedCreateInputSchema ]),
}).strict() ;

export const ShipUpsertArgsSchema: z.ZodType<Prisma.ShipUpsertArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereUniqueInputSchema,
  create: z.union([ ShipCreateInputSchema,ShipUncheckedCreateInputSchema ]),
  update: z.union([ ShipUpdateInputSchema,ShipUncheckedUpdateInputSchema ]),
}).strict() ;

export const ShipCreateManyArgsSchema: z.ZodType<Prisma.ShipCreateManyArgs> = z.object({
  data: z.union([ ShipCreateManyInputSchema,ShipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ShipDeleteArgsSchema: z.ZodType<Prisma.ShipDeleteArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereUniqueInputSchema,
}).strict() ;

export const ShipUpdateArgsSchema: z.ZodType<Prisma.ShipUpdateArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  data: z.union([ ShipUpdateInputSchema,ShipUncheckedUpdateInputSchema ]),
  where: ShipWhereUniqueInputSchema,
}).strict() ;

export const ShipUpdateManyArgsSchema: z.ZodType<Prisma.ShipUpdateManyArgs> = z.object({
  data: z.union([ ShipUpdateManyMutationInputSchema,ShipUncheckedUpdateManyInputSchema ]),
  where: ShipWhereInputSchema.optional(),
}).strict() ;

export const ShipDeleteManyArgsSchema: z.ZodType<Prisma.ShipDeleteManyArgs> = z.object({
  where: ShipWhereInputSchema.optional(),
}).strict() ;

export const MapCreateArgsSchema: z.ZodType<Prisma.MapCreateArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  data: z.union([ MapCreateInputSchema,MapUncheckedCreateInputSchema ]),
}).strict() ;

export const MapUpsertArgsSchema: z.ZodType<Prisma.MapUpsertArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereUniqueInputSchema,
  create: z.union([ MapCreateInputSchema,MapUncheckedCreateInputSchema ]),
  update: z.union([ MapUpdateInputSchema,MapUncheckedUpdateInputSchema ]),
}).strict() ;

export const MapCreateManyArgsSchema: z.ZodType<Prisma.MapCreateManyArgs> = z.object({
  data: z.union([ MapCreateManyInputSchema,MapCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MapDeleteArgsSchema: z.ZodType<Prisma.MapDeleteArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereUniqueInputSchema,
}).strict() ;

export const MapUpdateArgsSchema: z.ZodType<Prisma.MapUpdateArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  data: z.union([ MapUpdateInputSchema,MapUncheckedUpdateInputSchema ]),
  where: MapWhereUniqueInputSchema,
}).strict() ;

export const MapUpdateManyArgsSchema: z.ZodType<Prisma.MapUpdateManyArgs> = z.object({
  data: z.union([ MapUpdateManyMutationInputSchema,MapUncheckedUpdateManyInputSchema ]),
  where: MapWhereInputSchema.optional(),
}).strict() ;

export const MapDeleteManyArgsSchema: z.ZodType<Prisma.MapDeleteManyArgs> = z.object({
  where: MapWhereInputSchema.optional(),
}).strict() ;

export const BuoyCreateArgsSchema: z.ZodType<Prisma.BuoyCreateArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  data: z.union([ BuoyCreateInputSchema,BuoyUncheckedCreateInputSchema ]),
}).strict() ;

export const BuoyUpsertArgsSchema: z.ZodType<Prisma.BuoyUpsertArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereUniqueInputSchema,
  create: z.union([ BuoyCreateInputSchema,BuoyUncheckedCreateInputSchema ]),
  update: z.union([ BuoyUpdateInputSchema,BuoyUncheckedUpdateInputSchema ]),
}).strict() ;

export const BuoyCreateManyArgsSchema: z.ZodType<Prisma.BuoyCreateManyArgs> = z.object({
  data: z.union([ BuoyCreateManyInputSchema,BuoyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BuoyDeleteArgsSchema: z.ZodType<Prisma.BuoyDeleteArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereUniqueInputSchema,
}).strict() ;

export const BuoyUpdateArgsSchema: z.ZodType<Prisma.BuoyUpdateArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  data: z.union([ BuoyUpdateInputSchema,BuoyUncheckedUpdateInputSchema ]),
  where: BuoyWhereUniqueInputSchema,
}).strict() ;

export const BuoyUpdateManyArgsSchema: z.ZodType<Prisma.BuoyUpdateManyArgs> = z.object({
  data: z.union([ BuoyUpdateManyMutationInputSchema,BuoyUncheckedUpdateManyInputSchema ]),
  where: BuoyWhereInputSchema.optional(),
}).strict() ;

export const BuoyDeleteManyArgsSchema: z.ZodType<Prisma.BuoyDeleteManyArgs> = z.object({
  where: BuoyWhereInputSchema.optional(),
}).strict() ;

export const LegCreateArgsSchema: z.ZodType<Prisma.LegCreateArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  data: z.union([ LegCreateInputSchema,LegUncheckedCreateInputSchema ]),
}).strict() ;

export const LegUpsertArgsSchema: z.ZodType<Prisma.LegUpsertArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereUniqueInputSchema,
  create: z.union([ LegCreateInputSchema,LegUncheckedCreateInputSchema ]),
  update: z.union([ LegUpdateInputSchema,LegUncheckedUpdateInputSchema ]),
}).strict() ;

export const LegCreateManyArgsSchema: z.ZodType<Prisma.LegCreateManyArgs> = z.object({
  data: z.union([ LegCreateManyInputSchema,LegCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LegDeleteArgsSchema: z.ZodType<Prisma.LegDeleteArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereUniqueInputSchema,
}).strict() ;

export const LegUpdateArgsSchema: z.ZodType<Prisma.LegUpdateArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  data: z.union([ LegUpdateInputSchema,LegUncheckedUpdateInputSchema ]),
  where: LegWhereUniqueInputSchema,
}).strict() ;

export const LegUpdateManyArgsSchema: z.ZodType<Prisma.LegUpdateManyArgs> = z.object({
  data: z.union([ LegUpdateManyMutationInputSchema,LegUncheckedUpdateManyInputSchema ]),
  where: LegWhereInputSchema.optional(),
}).strict() ;

export const LegDeleteManyArgsSchema: z.ZodType<Prisma.LegDeleteManyArgs> = z.object({
  where: LegWhereInputSchema.optional(),
}).strict() ;