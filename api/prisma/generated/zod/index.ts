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

export const BouyScalarFieldEnumSchema = z.enum(['id','name','lat','lng','mapId']);

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
// BOUY SCHEMA
/////////////////////////////////////////

export const BouySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  lat: z.instanceof(Prisma.Decimal, { message: "Field 'lat' must be a Decimal. Location: ['Models', 'Bouy']"}),
  lng: z.instanceof(Prisma.Decimal, { message: "Field 'lng' must be a Decimal. Location: ['Models', 'Bouy']"}),
  mapId: z.number().int(),
})

export type Bouy = z.infer<typeof BouySchema>

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
  Bouy: z.union([z.boolean(),z.lazy(() => BouyFindManyArgsSchema)]).optional(),
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
  Bouy: z.boolean().optional(),
}).strict();

export const MapSelectSchema: z.ZodType<Prisma.MapSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  Bouy: z.union([z.boolean(),z.lazy(() => BouyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MapCountOutputTypeArgsSchema)]).optional(),
}).strict()

// BOUY
//------------------------------------------------------

export const BouyIncludeSchema: z.ZodType<Prisma.BouyInclude> = z.object({
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
}).strict()

export const BouyArgsSchema: z.ZodType<Prisma.BouyDefaultArgs> = z.object({
  select: z.lazy(() => BouySelectSchema).optional(),
  include: z.lazy(() => BouyIncludeSchema).optional(),
}).strict();

export const BouySelectSchema: z.ZodType<Prisma.BouySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  lat: z.boolean().optional(),
  lng: z.boolean().optional(),
  mapId: z.boolean().optional(),
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
  Bouy: z.lazy(() => BouyListRelationFilterSchema).optional()
}).strict();

export const MapOrderByWithRelationInputSchema: z.ZodType<Prisma.MapOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  Bouy: z.lazy(() => BouyOrderByRelationAggregateInputSchema).optional()
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
  Bouy: z.lazy(() => BouyListRelationFilterSchema).optional()
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

export const BouyWhereInputSchema: z.ZodType<Prisma.BouyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BouyWhereInputSchema),z.lazy(() => BouyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BouyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BouyWhereInputSchema),z.lazy(() => BouyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
}).strict();

export const BouyOrderByWithRelationInputSchema: z.ZodType<Prisma.BouyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional()
}).strict();

export const BouyWhereUniqueInputSchema: z.ZodType<Prisma.BouyWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => BouyWhereInputSchema),z.lazy(() => BouyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BouyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BouyWhereInputSchema),z.lazy(() => BouyWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
}).strict());

export const BouyOrderByWithAggregationInputSchema: z.ZodType<Prisma.BouyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BouyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => BouyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BouyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BouyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => BouySumOrderByAggregateInputSchema).optional()
}).strict();

export const BouyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BouyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BouyScalarWhereWithAggregatesInputSchema),z.lazy(() => BouyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BouyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BouyScalarWhereWithAggregatesInputSchema),z.lazy(() => BouyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  mapId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
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
  Bouy: z.lazy(() => BouyCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateInputSchema: z.ZodType<Prisma.MapUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  Bouy: z.lazy(() => BouyUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUpdateInputSchema: z.ZodType<Prisma.MapUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Bouy: z.lazy(() => BouyUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateInputSchema: z.ZodType<Prisma.MapUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Bouy: z.lazy(() => BouyUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
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

export const BouyCreateInputSchema: z.ZodType<Prisma.BouyCreateInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBouyInputSchema)
}).strict();

export const BouyUncheckedCreateInputSchema: z.ZodType<Prisma.BouyUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int()
}).strict();

export const BouyUpdateInputSchema: z.ZodType<Prisma.BouyUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBouyNestedInputSchema).optional()
}).strict();

export const BouyUncheckedUpdateInputSchema: z.ZodType<Prisma.BouyUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BouyCreateManyInputSchema: z.ZodType<Prisma.BouyCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int()
}).strict();

export const BouyUpdateManyMutationInputSchema: z.ZodType<Prisma.BouyUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BouyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BouyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const BouyListRelationFilterSchema: z.ZodType<Prisma.BouyListRelationFilter> = z.object({
  every: z.lazy(() => BouyWhereInputSchema).optional(),
  some: z.lazy(() => BouyWhereInputSchema).optional(),
  none: z.lazy(() => BouyWhereInputSchema).optional()
}).strict();

export const BouyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BouyOrderByRelationAggregateInput> = z.object({
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

export const BouyCountOrderByAggregateInputSchema: z.ZodType<Prisma.BouyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BouyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.BouyAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BouyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BouyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BouyMinOrderByAggregateInputSchema: z.ZodType<Prisma.BouyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BouySumOrderByAggregateInputSchema: z.ZodType<Prisma.BouySumOrderByAggregateInput> = z.object({
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

export const BouyCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.BouyCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => BouyCreateWithoutMapInputSchema),z.lazy(() => BouyCreateWithoutMapInputSchema).array(),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BouyCreateOrConnectWithoutMapInputSchema),z.lazy(() => BouyCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BouyCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BouyUncheckedCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.BouyUncheckedCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => BouyCreateWithoutMapInputSchema),z.lazy(() => BouyCreateWithoutMapInputSchema).array(),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BouyCreateOrConnectWithoutMapInputSchema),z.lazy(() => BouyCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BouyCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BouyUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.BouyUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => BouyCreateWithoutMapInputSchema),z.lazy(() => BouyCreateWithoutMapInputSchema).array(),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BouyCreateOrConnectWithoutMapInputSchema),z.lazy(() => BouyCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BouyUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => BouyUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BouyCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BouyUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => BouyUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BouyUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => BouyUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BouyScalarWhereInputSchema),z.lazy(() => BouyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BouyUncheckedUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.BouyUncheckedUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => BouyCreateWithoutMapInputSchema),z.lazy(() => BouyCreateWithoutMapInputSchema).array(),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BouyCreateOrConnectWithoutMapInputSchema),z.lazy(() => BouyCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BouyUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => BouyUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BouyCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BouyWhereUniqueInputSchema),z.lazy(() => BouyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BouyUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => BouyUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BouyUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => BouyUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BouyScalarWhereInputSchema),z.lazy(() => BouyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MapCreateNestedOneWithoutBouyInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutBouyInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutBouyInputSchema),z.lazy(() => MapUncheckedCreateWithoutBouyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutBouyInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const MapUpdateOneRequiredWithoutBouyNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutBouyNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutBouyInputSchema),z.lazy(() => MapUncheckedCreateWithoutBouyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutBouyInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutBouyInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutBouyInputSchema),z.lazy(() => MapUpdateWithoutBouyInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBouyInputSchema) ]).optional(),
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

export const BouyCreateWithoutMapInputSchema: z.ZodType<Prisma.BouyCreateWithoutMapInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const BouyUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.BouyUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const BouyCreateOrConnectWithoutMapInputSchema: z.ZodType<Prisma.BouyCreateOrConnectWithoutMapInput> = z.object({
  where: z.lazy(() => BouyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BouyCreateWithoutMapInputSchema),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const BouyCreateManyMapInputEnvelopeSchema: z.ZodType<Prisma.BouyCreateManyMapInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BouyCreateManyMapInputSchema),z.lazy(() => BouyCreateManyMapInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BouyUpsertWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.BouyUpsertWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => BouyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BouyUpdateWithoutMapInputSchema),z.lazy(() => BouyUncheckedUpdateWithoutMapInputSchema) ]),
  create: z.union([ z.lazy(() => BouyCreateWithoutMapInputSchema),z.lazy(() => BouyUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const BouyUpdateWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.BouyUpdateWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => BouyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BouyUpdateWithoutMapInputSchema),z.lazy(() => BouyUncheckedUpdateWithoutMapInputSchema) ]),
}).strict();

export const BouyUpdateManyWithWhereWithoutMapInputSchema: z.ZodType<Prisma.BouyUpdateManyWithWhereWithoutMapInput> = z.object({
  where: z.lazy(() => BouyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BouyUpdateManyMutationInputSchema),z.lazy(() => BouyUncheckedUpdateManyWithoutMapInputSchema) ]),
}).strict();

export const BouyScalarWhereInputSchema: z.ZodType<Prisma.BouyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BouyScalarWhereInputSchema),z.lazy(() => BouyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BouyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BouyScalarWhereInputSchema),z.lazy(() => BouyScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const MapCreateWithoutBouyInputSchema: z.ZodType<Prisma.MapCreateWithoutBouyInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const MapUncheckedCreateWithoutBouyInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutBouyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const MapCreateOrConnectWithoutBouyInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutBouyInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutBouyInputSchema),z.lazy(() => MapUncheckedCreateWithoutBouyInputSchema) ]),
}).strict();

export const MapUpsertWithoutBouyInputSchema: z.ZodType<Prisma.MapUpsertWithoutBouyInput> = z.object({
  update: z.union([ z.lazy(() => MapUpdateWithoutBouyInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBouyInputSchema) ]),
  create: z.union([ z.lazy(() => MapCreateWithoutBouyInputSchema),z.lazy(() => MapUncheckedCreateWithoutBouyInputSchema) ]),
  where: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const MapUpdateToOneWithWhereWithoutBouyInputSchema: z.ZodType<Prisma.MapUpdateToOneWithWhereWithoutBouyInput> = z.object({
  where: z.lazy(() => MapWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MapUpdateWithoutBouyInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBouyInputSchema) ]),
}).strict();

export const MapUpdateWithoutBouyInputSchema: z.ZodType<Prisma.MapUpdateWithoutBouyInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MapUncheckedUpdateWithoutBouyInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutBouyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const BouyCreateManyMapInputSchema: z.ZodType<Prisma.BouyCreateManyMapInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const BouyUpdateWithoutMapInputSchema: z.ZodType<Prisma.BouyUpdateWithoutMapInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BouyUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.BouyUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BouyUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.BouyUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
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

export const BouyFindFirstArgsSchema: z.ZodType<Prisma.BouyFindFirstArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  where: BouyWhereInputSchema.optional(),
  orderBy: z.union([ BouyOrderByWithRelationInputSchema.array(),BouyOrderByWithRelationInputSchema ]).optional(),
  cursor: BouyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BouyScalarFieldEnumSchema,BouyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BouyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BouyFindFirstOrThrowArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  where: BouyWhereInputSchema.optional(),
  orderBy: z.union([ BouyOrderByWithRelationInputSchema.array(),BouyOrderByWithRelationInputSchema ]).optional(),
  cursor: BouyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BouyScalarFieldEnumSchema,BouyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BouyFindManyArgsSchema: z.ZodType<Prisma.BouyFindManyArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  where: BouyWhereInputSchema.optional(),
  orderBy: z.union([ BouyOrderByWithRelationInputSchema.array(),BouyOrderByWithRelationInputSchema ]).optional(),
  cursor: BouyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BouyScalarFieldEnumSchema,BouyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BouyAggregateArgsSchema: z.ZodType<Prisma.BouyAggregateArgs> = z.object({
  where: BouyWhereInputSchema.optional(),
  orderBy: z.union([ BouyOrderByWithRelationInputSchema.array(),BouyOrderByWithRelationInputSchema ]).optional(),
  cursor: BouyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BouyGroupByArgsSchema: z.ZodType<Prisma.BouyGroupByArgs> = z.object({
  where: BouyWhereInputSchema.optional(),
  orderBy: z.union([ BouyOrderByWithAggregationInputSchema.array(),BouyOrderByWithAggregationInputSchema ]).optional(),
  by: BouyScalarFieldEnumSchema.array(),
  having: BouyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BouyFindUniqueArgsSchema: z.ZodType<Prisma.BouyFindUniqueArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  where: BouyWhereUniqueInputSchema,
}).strict() ;

export const BouyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BouyFindUniqueOrThrowArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  where: BouyWhereUniqueInputSchema,
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

export const BouyCreateArgsSchema: z.ZodType<Prisma.BouyCreateArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  data: z.union([ BouyCreateInputSchema,BouyUncheckedCreateInputSchema ]),
}).strict() ;

export const BouyUpsertArgsSchema: z.ZodType<Prisma.BouyUpsertArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  where: BouyWhereUniqueInputSchema,
  create: z.union([ BouyCreateInputSchema,BouyUncheckedCreateInputSchema ]),
  update: z.union([ BouyUpdateInputSchema,BouyUncheckedUpdateInputSchema ]),
}).strict() ;

export const BouyCreateManyArgsSchema: z.ZodType<Prisma.BouyCreateManyArgs> = z.object({
  data: z.union([ BouyCreateManyInputSchema,BouyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BouyDeleteArgsSchema: z.ZodType<Prisma.BouyDeleteArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  where: BouyWhereUniqueInputSchema,
}).strict() ;

export const BouyUpdateArgsSchema: z.ZodType<Prisma.BouyUpdateArgs> = z.object({
  select: BouySelectSchema.optional(),
  include: BouyIncludeSchema.optional(),
  data: z.union([ BouyUpdateInputSchema,BouyUncheckedUpdateInputSchema ]),
  where: BouyWhereUniqueInputSchema,
}).strict() ;

export const BouyUpdateManyArgsSchema: z.ZodType<Prisma.BouyUpdateManyArgs> = z.object({
  data: z.union([ BouyUpdateManyMutationInputSchema,BouyUncheckedUpdateManyInputSchema ]),
  where: BouyWhereInputSchema.optional(),
}).strict() ;

export const BouyDeleteManyArgsSchema: z.ZodType<Prisma.BouyDeleteManyArgs> = z.object({
  where: BouyWhereInputSchema.optional(),
}).strict() ;