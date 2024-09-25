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

export const MapScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','isLocked','name']);

export const BuoyScalarFieldEnumSchema = z.enum(['id','name','lat','lng','mapId']);

export const LegScalarFieldEnumSchema = z.enum(['id','mapId','startBuoyId','endBuoyId']);

export const RouteScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','mapId','startBuoyId','endBuoyId','ownerId']);

export const LegsOnRouteScalarFieldEnumSchema = z.enum(['routeId','legId','index']);

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
  isLocked: z.boolean(),
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
// ROUTE SCHEMA
/////////////////////////////////////////

export const RouteSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
})

export type Route = z.infer<typeof RouteSchema>

/////////////////////////////////////////
// LEGS ON ROUTE SCHEMA
/////////////////////////////////////////

export const LegsOnRouteSchema = z.object({
  routeId: z.number().int(),
  legId: z.number().int(),
  index: z.number().int(),
})

export type LegsOnRoute = z.infer<typeof LegsOnRouteSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  Ships: z.union([z.boolean(),z.lazy(() => ShipFindManyArgsSchema)]).optional(),
  Routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
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
  Ships: z.boolean().optional(),
  Routes: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  password: z.boolean().optional(),
  salt: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  Ships: z.union([z.boolean(),z.lazy(() => ShipFindManyArgsSchema)]).optional(),
  Routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
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
  Buoys: z.union([z.boolean(),z.lazy(() => BuoyFindManyArgsSchema)]).optional(),
  Legs: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  Routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
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
  Buoys: z.boolean().optional(),
  Legs: z.boolean().optional(),
  Routes: z.boolean().optional(),
}).strict();

export const MapSelectSchema: z.ZodType<Prisma.MapSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isLocked: z.boolean().optional(),
  name: z.boolean().optional(),
  Buoys: z.union([z.boolean(),z.lazy(() => BuoyFindManyArgsSchema)]).optional(),
  Legs: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  Routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
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

// ROUTE
//------------------------------------------------------

export const RouteIncludeSchema: z.ZodType<Prisma.RouteInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  legs: z.union([z.boolean(),z.lazy(() => LegsOnRouteFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RouteCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RouteArgsSchema: z.ZodType<Prisma.RouteDefaultArgs> = z.object({
  select: z.lazy(() => RouteSelectSchema).optional(),
  include: z.lazy(() => RouteIncludeSchema).optional(),
}).strict();

export const RouteCountOutputTypeArgsSchema: z.ZodType<Prisma.RouteCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RouteCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RouteCountOutputTypeSelectSchema: z.ZodType<Prisma.RouteCountOutputTypeSelect> = z.object({
  legs: z.boolean().optional(),
}).strict();

export const RouteSelectSchema: z.ZodType<Prisma.RouteSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  mapId: z.boolean().optional(),
  startBuoyId: z.boolean().optional(),
  endBuoyId: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  legs: z.union([z.boolean(),z.lazy(() => LegsOnRouteFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RouteCountOutputTypeArgsSchema)]).optional(),
}).strict()

// LEGS ON ROUTE
//------------------------------------------------------

export const LegsOnRouteIncludeSchema: z.ZodType<Prisma.LegsOnRouteInclude> = z.object({
  route: z.union([z.boolean(),z.lazy(() => RouteArgsSchema)]).optional(),
}).strict()

export const LegsOnRouteArgsSchema: z.ZodType<Prisma.LegsOnRouteDefaultArgs> = z.object({
  select: z.lazy(() => LegsOnRouteSelectSchema).optional(),
  include: z.lazy(() => LegsOnRouteIncludeSchema).optional(),
}).strict();

export const LegsOnRouteSelectSchema: z.ZodType<Prisma.LegsOnRouteSelect> = z.object({
  routeId: z.boolean().optional(),
  legId: z.boolean().optional(),
  index: z.boolean().optional(),
  route: z.union([z.boolean(),z.lazy(() => RouteArgsSchema)]).optional(),
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
  Ships: z.lazy(() => ShipListRelationFilterSchema).optional(),
  Routes: z.lazy(() => RouteListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  salt: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  Ships: z.lazy(() => ShipOrderByRelationAggregateInputSchema).optional(),
  Routes: z.lazy(() => RouteOrderByRelationAggregateInputSchema).optional()
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
  Ships: z.lazy(() => ShipListRelationFilterSchema).optional(),
  Routes: z.lazy(() => RouteListRelationFilterSchema).optional()
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
  isLocked: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Buoys: z.lazy(() => BuoyListRelationFilterSchema).optional(),
  Legs: z.lazy(() => LegListRelationFilterSchema).optional(),
  Routes: z.lazy(() => RouteListRelationFilterSchema).optional()
}).strict();

export const MapOrderByWithRelationInputSchema: z.ZodType<Prisma.MapOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  Buoys: z.lazy(() => BuoyOrderByRelationAggregateInputSchema).optional(),
  Legs: z.lazy(() => LegOrderByRelationAggregateInputSchema).optional(),
  Routes: z.lazy(() => RouteOrderByRelationAggregateInputSchema).optional()
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
  isLocked: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Buoys: z.lazy(() => BuoyListRelationFilterSchema).optional(),
  Legs: z.lazy(() => LegListRelationFilterSchema).optional(),
  Routes: z.lazy(() => RouteListRelationFilterSchema).optional()
}).strict());

export const MapOrderByWithAggregationInputSchema: z.ZodType<Prisma.MapOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
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
  isLocked: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
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

export const RouteWhereInputSchema: z.ZodType<Prisma.RouteWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RouteWhereInputSchema),z.lazy(() => RouteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RouteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RouteWhereInputSchema),z.lazy(() => RouteWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteListRelationFilterSchema).optional()
}).strict();

export const RouteOrderByWithRelationInputSchema: z.ZodType<Prisma.RouteOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RouteWhereUniqueInputSchema: z.ZodType<Prisma.RouteWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => RouteWhereInputSchema),z.lazy(() => RouteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RouteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RouteWhereInputSchema),z.lazy(() => RouteWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteListRelationFilterSchema).optional()
}).strict());

export const RouteOrderByWithAggregationInputSchema: z.ZodType<Prisma.RouteOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RouteCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RouteAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RouteMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RouteMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RouteSumOrderByAggregateInputSchema).optional()
}).strict();

export const RouteScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RouteScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RouteScalarWhereWithAggregatesInputSchema),z.lazy(() => RouteScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RouteScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RouteScalarWhereWithAggregatesInputSchema),z.lazy(() => RouteScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  mapId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const LegsOnRouteWhereInputSchema: z.ZodType<Prisma.LegsOnRouteWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LegsOnRouteWhereInputSchema),z.lazy(() => LegsOnRouteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegsOnRouteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegsOnRouteWhereInputSchema),z.lazy(() => LegsOnRouteWhereInputSchema).array() ]).optional(),
  routeId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  legId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  index: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  route: z.union([ z.lazy(() => RouteRelationFilterSchema),z.lazy(() => RouteWhereInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteOrderByWithRelationInputSchema: z.ZodType<Prisma.LegsOnRouteOrderByWithRelationInput> = z.object({
  routeId: z.lazy(() => SortOrderSchema).optional(),
  legId: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional(),
  route: z.lazy(() => RouteOrderByWithRelationInputSchema).optional()
}).strict();

export const LegsOnRouteWhereUniqueInputSchema: z.ZodType<Prisma.LegsOnRouteWhereUniqueInput> = z.object({
  routeId_legId: z.lazy(() => LegsOnRouteRouteIdLegIdCompoundUniqueInputSchema)
})
.and(z.object({
  routeId_legId: z.lazy(() => LegsOnRouteRouteIdLegIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => LegsOnRouteWhereInputSchema),z.lazy(() => LegsOnRouteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegsOnRouteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegsOnRouteWhereInputSchema),z.lazy(() => LegsOnRouteWhereInputSchema).array() ]).optional(),
  routeId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  legId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  index: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  route: z.union([ z.lazy(() => RouteRelationFilterSchema),z.lazy(() => RouteWhereInputSchema) ]).optional(),
}).strict());

export const LegsOnRouteOrderByWithAggregationInputSchema: z.ZodType<Prisma.LegsOnRouteOrderByWithAggregationInput> = z.object({
  routeId: z.lazy(() => SortOrderSchema).optional(),
  legId: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LegsOnRouteCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LegsOnRouteAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LegsOnRouteMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LegsOnRouteMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LegsOnRouteSumOrderByAggregateInputSchema).optional()
}).strict();

export const LegsOnRouteScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LegsOnRouteScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LegsOnRouteScalarWhereWithAggregatesInputSchema),z.lazy(() => LegsOnRouteScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegsOnRouteScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegsOnRouteScalarWhereWithAggregatesInputSchema),z.lazy(() => LegsOnRouteScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  routeId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  legId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  index: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipCreateNestedManyWithoutOwnerInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  isLocked: z.boolean().optional(),
  name: z.string(),
  Buoys: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateInputSchema: z.ZodType<Prisma.MapUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  Buoys: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUpdateInputSchema: z.ZodType<Prisma.MapUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateInputSchema: z.ZodType<Prisma.MapUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapCreateManyInputSchema: z.ZodType<Prisma.MapCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string()
}).strict();

export const MapUpdateManyMutationInputSchema: z.ZodType<Prisma.MapUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MapUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MapUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyCreateInputSchema: z.ZodType<Prisma.BuoyCreateInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoysInputSchema)
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
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoysNestedInputSchema).optional()
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
  map: z.lazy(() => MapCreateNestedOneWithoutLegsInputSchema)
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
  map: z.lazy(() => MapUpdateOneRequiredWithoutLegsNestedInputSchema).optional()
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

export const RouteCreateInputSchema: z.ZodType<Prisma.RouteCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteUncheckedCreateInputSchema: z.ZodType<Prisma.RouteUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  legs: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteUpdateInputSchema: z.ZodType<Prisma.RouteUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteCreateManyInputSchema: z.ZodType<Prisma.RouteCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int()
}).strict();

export const RouteUpdateManyMutationInputSchema: z.ZodType<Prisma.RouteUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RouteUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteCreateInputSchema: z.ZodType<Prisma.LegsOnRouteCreateInput> = z.object({
  legId: z.number().int(),
  index: z.number().int(),
  route: z.lazy(() => RouteCreateNestedOneWithoutLegsInputSchema)
}).strict();

export const LegsOnRouteUncheckedCreateInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedCreateInput> = z.object({
  routeId: z.number().int(),
  legId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteUpdateInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateInput> = z.object({
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  route: z.lazy(() => RouteUpdateOneRequiredWithoutLegsNestedInputSchema).optional()
}).strict();

export const LegsOnRouteUncheckedUpdateInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateInput> = z.object({
  routeId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteCreateManyInputSchema: z.ZodType<Prisma.LegsOnRouteCreateManyInput> = z.object({
  routeId: z.number().int(),
  legId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteUpdateManyMutationInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateManyMutationInput> = z.object({
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateManyInput> = z.object({
  routeId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const RouteListRelationFilterSchema: z.ZodType<Prisma.RouteListRelationFilter> = z.object({
  every: z.lazy(() => RouteWhereInputSchema).optional(),
  some: z.lazy(() => RouteWhereInputSchema).optional(),
  none: z.lazy(() => RouteWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ShipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ShipOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RouteOrderByRelationAggregateInput> = z.object({
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
  isLocked: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MapAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MapMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapMinOrderByAggregateInputSchema: z.ZodType<Prisma.MapMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
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

export const LegsOnRouteListRelationFilterSchema: z.ZodType<Prisma.LegsOnRouteListRelationFilter> = z.object({
  every: z.lazy(() => LegsOnRouteWhereInputSchema).optional(),
  some: z.lazy(() => LegsOnRouteWhereInputSchema).optional(),
  none: z.lazy(() => LegsOnRouteWhereInputSchema).optional()
}).strict();

export const LegsOnRouteOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LegsOnRouteOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteCountOrderByAggregateInputSchema: z.ZodType<Prisma.RouteCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RouteAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RouteMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteMinOrderByAggregateInputSchema: z.ZodType<Prisma.RouteMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteSumOrderByAggregateInputSchema: z.ZodType<Prisma.RouteSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteRelationFilterSchema: z.ZodType<Prisma.RouteRelationFilter> = z.object({
  is: z.lazy(() => RouteWhereInputSchema).optional(),
  isNot: z.lazy(() => RouteWhereInputSchema).optional()
}).strict();

export const LegsOnRouteRouteIdLegIdCompoundUniqueInputSchema: z.ZodType<Prisma.LegsOnRouteRouteIdLegIdCompoundUniqueInput> = z.object({
  routeId: z.number(),
  legId: z.number()
}).strict();

export const LegsOnRouteCountOrderByAggregateInputSchema: z.ZodType<Prisma.LegsOnRouteCountOrderByAggregateInput> = z.object({
  routeId: z.lazy(() => SortOrderSchema).optional(),
  legId: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegsOnRouteAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LegsOnRouteAvgOrderByAggregateInput> = z.object({
  routeId: z.lazy(() => SortOrderSchema).optional(),
  legId: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegsOnRouteMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LegsOnRouteMaxOrderByAggregateInput> = z.object({
  routeId: z.lazy(() => SortOrderSchema).optional(),
  legId: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegsOnRouteMinOrderByAggregateInputSchema: z.ZodType<Prisma.LegsOnRouteMinOrderByAggregateInput> = z.object({
  routeId: z.lazy(() => SortOrderSchema).optional(),
  legId: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegsOnRouteSumOrderByAggregateInputSchema: z.ZodType<Prisma.LegsOnRouteSumOrderByAggregateInput> = z.object({
  routeId: z.lazy(() => SortOrderSchema).optional(),
  legId: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShipCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.ShipCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => ShipCreateWithoutOwnerInputSchema),z.lazy(() => ShipCreateWithoutOwnerInputSchema).array(),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShipCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RouteCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.RouteCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutOwnerInputSchema),z.lazy(() => RouteCreateWithoutOwnerInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => RouteCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShipUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => ShipCreateWithoutOwnerInputSchema),z.lazy(() => ShipCreateWithoutOwnerInputSchema).array(),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ShipUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ShipCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShipCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShipWhereUniqueInputSchema),z.lazy(() => ShipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RouteUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutOwnerInputSchema),z.lazy(() => RouteCreateWithoutOwnerInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => RouteCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
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

export const RouteUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.RouteUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutOwnerInputSchema),z.lazy(() => RouteCreateWithoutOwnerInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => RouteCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
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

export const RouteUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutOwnerInputSchema),z.lazy(() => RouteCreateWithoutOwnerInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => RouteCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
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

export const RouteCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.RouteCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutMapInputSchema),z.lazy(() => RouteCreateWithoutMapInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutMapInputSchema),z.lazy(() => RouteCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
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

export const RouteUncheckedCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.RouteUncheckedCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutMapInputSchema),z.lazy(() => RouteCreateWithoutMapInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutMapInputSchema),z.lazy(() => RouteCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
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

export const RouteUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.RouteUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutMapInputSchema),z.lazy(() => RouteCreateWithoutMapInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutMapInputSchema),z.lazy(() => RouteCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
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

export const RouteUncheckedUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutMapInputSchema),z.lazy(() => RouteCreateWithoutMapInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutMapInputSchema),z.lazy(() => RouteCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MapCreateNestedOneWithoutBuoysInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutBuoysInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutBuoysInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const MapUpdateOneRequiredWithoutBuoysNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutBuoysNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutBuoysInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutBuoysInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutBuoysInputSchema),z.lazy(() => MapUpdateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBuoysInputSchema) ]).optional(),
}).strict();

export const MapCreateNestedOneWithoutLegsInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutLegsInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutLegsInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutLegsInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const MapUpdateOneRequiredWithoutLegsNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutLegsNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutLegsInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutLegsInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutLegsInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutLegsInputSchema),z.lazy(() => MapUpdateWithoutLegsInputSchema),z.lazy(() => MapUncheckedUpdateWithoutLegsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutRoutesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutRoutesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRoutesInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoutesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRoutesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const MapCreateNestedOneWithoutRoutesInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutRoutesInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutRoutesInputSchema),z.lazy(() => MapUncheckedCreateWithoutRoutesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutRoutesInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const LegsOnRouteCreateNestedManyWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteCreateNestedManyWithoutRouteInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyRouteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedCreateNestedManyWithoutRouteInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyRouteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutRoutesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutRoutesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRoutesInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoutesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRoutesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutRoutesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutRoutesInputSchema),z.lazy(() => UserUpdateWithoutRoutesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRoutesInputSchema) ]).optional(),
}).strict();

export const MapUpdateOneRequiredWithoutRoutesNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutRoutesNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutRoutesInputSchema),z.lazy(() => MapUncheckedCreateWithoutRoutesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutRoutesInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutRoutesInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutRoutesInputSchema),z.lazy(() => MapUpdateWithoutRoutesInputSchema),z.lazy(() => MapUncheckedUpdateWithoutRoutesInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteUpdateManyWithoutRouteNestedInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateManyWithoutRouteNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegsOnRouteUpsertWithWhereUniqueWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUpsertWithWhereUniqueWithoutRouteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyRouteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegsOnRouteUpdateWithWhereUniqueWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUpdateWithWhereUniqueWithoutRouteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegsOnRouteUpdateManyWithWhereWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUpdateManyWithWhereWithoutRouteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegsOnRouteScalarWhereInputSchema),z.lazy(() => LegsOnRouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegsOnRouteUpsertWithWhereUniqueWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUpsertWithWhereUniqueWithoutRouteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyRouteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegsOnRouteUpdateWithWhereUniqueWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUpdateWithWhereUniqueWithoutRouteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegsOnRouteUpdateManyWithWhereWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUpdateManyWithWhereWithoutRouteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegsOnRouteScalarWhereInputSchema),z.lazy(() => LegsOnRouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RouteCreateNestedOneWithoutLegsInputSchema: z.ZodType<Prisma.RouteCreateNestedOneWithoutLegsInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedCreateWithoutLegsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RouteCreateOrConnectWithoutLegsInputSchema).optional(),
  connect: z.lazy(() => RouteWhereUniqueInputSchema).optional()
}).strict();

export const RouteUpdateOneRequiredWithoutLegsNestedInputSchema: z.ZodType<Prisma.RouteUpdateOneRequiredWithoutLegsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedCreateWithoutLegsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RouteCreateOrConnectWithoutLegsInputSchema).optional(),
  upsert: z.lazy(() => RouteUpsertWithoutLegsInputSchema).optional(),
  connect: z.lazy(() => RouteWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RouteUpdateToOneWithWhereWithoutLegsInputSchema),z.lazy(() => RouteUpdateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutLegsInputSchema) ]).optional(),
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

export const RouteCreateWithoutOwnerInputSchema: z.ZodType<Prisma.RouteCreateWithoutOwnerInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  legs: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.RouteCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RouteCreateWithoutOwnerInputSchema),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const RouteCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.RouteCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RouteCreateManyOwnerInputSchema),z.lazy(() => RouteCreateManyOwnerInputSchema).array() ]),
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

export const RouteUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RouteUpdateWithoutOwnerInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => RouteCreateWithoutOwnerInputSchema),z.lazy(() => RouteUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const RouteUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateWithoutOwnerInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const RouteUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => RouteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateManyMutationInputSchema),z.lazy(() => RouteUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const RouteScalarWhereInputSchema: z.ZodType<Prisma.RouteScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RouteScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const UserCreateWithoutShipsInputSchema: z.ZodType<Prisma.UserCreateWithoutShipsInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutShipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutShipsInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
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
  Routes: z.lazy(() => RouteUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutShipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutShipsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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

export const RouteCreateWithoutMapInputSchema: z.ZodType<Prisma.RouteCreateWithoutMapInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  legs: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteCreateOrConnectWithoutMapInputSchema: z.ZodType<Prisma.RouteCreateOrConnectWithoutMapInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RouteCreateWithoutMapInputSchema),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const RouteCreateManyMapInputEnvelopeSchema: z.ZodType<Prisma.RouteCreateManyMapInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RouteCreateManyMapInputSchema),z.lazy(() => RouteCreateManyMapInputSchema).array() ]),
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

export const RouteUpsertWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.RouteUpsertWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RouteUpdateWithoutMapInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutMapInputSchema) ]),
  create: z.union([ z.lazy(() => RouteCreateWithoutMapInputSchema),z.lazy(() => RouteUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const RouteUpdateWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.RouteUpdateWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateWithoutMapInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutMapInputSchema) ]),
}).strict();

export const RouteUpdateManyWithWhereWithoutMapInputSchema: z.ZodType<Prisma.RouteUpdateManyWithWhereWithoutMapInput> = z.object({
  where: z.lazy(() => RouteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateManyMutationInputSchema),z.lazy(() => RouteUncheckedUpdateManyWithoutMapInputSchema) ]),
}).strict();

export const MapCreateWithoutBuoysInputSchema: z.ZodType<Prisma.MapCreateWithoutBuoysInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  Legs: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutBuoysInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutBuoysInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  Legs: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutBuoysInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutBuoysInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoysInputSchema) ]),
}).strict();

export const MapUpsertWithoutBuoysInputSchema: z.ZodType<Prisma.MapUpsertWithoutBuoysInput> = z.object({
  update: z.union([ z.lazy(() => MapUpdateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBuoysInputSchema) ]),
  create: z.union([ z.lazy(() => MapCreateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoysInputSchema) ]),
  where: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const MapUpdateToOneWithWhereWithoutBuoysInputSchema: z.ZodType<Prisma.MapUpdateToOneWithWhereWithoutBuoysInput> = z.object({
  where: z.lazy(() => MapWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MapUpdateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBuoysInputSchema) ]),
}).strict();

export const MapUpdateWithoutBuoysInputSchema: z.ZodType<Prisma.MapUpdateWithoutBuoysInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Legs: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutBuoysInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutBuoysInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Legs: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapCreateWithoutLegsInputSchema: z.ZodType<Prisma.MapCreateWithoutLegsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  Buoys: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutLegsInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutLegsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  Buoys: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutLegsInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutLegsInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutLegsInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegsInputSchema) ]),
}).strict();

export const MapUpsertWithoutLegsInputSchema: z.ZodType<Prisma.MapUpsertWithoutLegsInput> = z.object({
  update: z.union([ z.lazy(() => MapUpdateWithoutLegsInputSchema),z.lazy(() => MapUncheckedUpdateWithoutLegsInputSchema) ]),
  create: z.union([ z.lazy(() => MapCreateWithoutLegsInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegsInputSchema) ]),
  where: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const MapUpdateToOneWithWhereWithoutLegsInputSchema: z.ZodType<Prisma.MapUpdateToOneWithWhereWithoutLegsInput> = z.object({
  where: z.lazy(() => MapWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MapUpdateWithoutLegsInputSchema),z.lazy(() => MapUncheckedUpdateWithoutLegsInputSchema) ]),
}).strict();

export const MapUpdateWithoutLegsInputSchema: z.ZodType<Prisma.MapUpdateWithoutLegsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutLegsInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutLegsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutRoutesInputSchema: z.ZodType<Prisma.UserCreateWithoutRoutesInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutRoutesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRoutesInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutRoutesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRoutesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutRoutesInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoutesInputSchema) ]),
}).strict();

export const MapCreateWithoutRoutesInputSchema: z.ZodType<Prisma.MapCreateWithoutRoutesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  Buoys: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutRoutesInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutRoutesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  Buoys: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutRoutesInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutRoutesInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutRoutesInputSchema),z.lazy(() => MapUncheckedCreateWithoutRoutesInputSchema) ]),
}).strict();

export const LegsOnRouteCreateWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteCreateWithoutRouteInput> = z.object({
  legId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteUncheckedCreateWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedCreateWithoutRouteInput> = z.object({
  legId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteCreateOrConnectWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteCreateOrConnectWithoutRouteInput> = z.object({
  where: z.lazy(() => LegsOnRouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema) ]),
}).strict();

export const LegsOnRouteCreateManyRouteInputEnvelopeSchema: z.ZodType<Prisma.LegsOnRouteCreateManyRouteInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LegsOnRouteCreateManyRouteInputSchema),z.lazy(() => LegsOnRouteCreateManyRouteInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutRoutesInputSchema: z.ZodType<Prisma.UserUpsertWithoutRoutesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutRoutesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRoutesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutRoutesInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoutesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutRoutesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutRoutesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutRoutesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRoutesInputSchema) ]),
}).strict();

export const UserUpdateWithoutRoutesInputSchema: z.ZodType<Prisma.UserUpdateWithoutRoutesInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutRoutesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRoutesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const MapUpsertWithoutRoutesInputSchema: z.ZodType<Prisma.MapUpsertWithoutRoutesInput> = z.object({
  update: z.union([ z.lazy(() => MapUpdateWithoutRoutesInputSchema),z.lazy(() => MapUncheckedUpdateWithoutRoutesInputSchema) ]),
  create: z.union([ z.lazy(() => MapCreateWithoutRoutesInputSchema),z.lazy(() => MapUncheckedCreateWithoutRoutesInputSchema) ]),
  where: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const MapUpdateToOneWithWhereWithoutRoutesInputSchema: z.ZodType<Prisma.MapUpdateToOneWithWhereWithoutRoutesInput> = z.object({
  where: z.lazy(() => MapWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MapUpdateWithoutRoutesInputSchema),z.lazy(() => MapUncheckedUpdateWithoutRoutesInputSchema) ]),
}).strict();

export const MapUpdateWithoutRoutesInputSchema: z.ZodType<Prisma.MapUpdateWithoutRoutesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutRoutesInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutRoutesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const LegsOnRouteUpsertWithWhereUniqueWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUpsertWithWhereUniqueWithoutRouteInput> = z.object({
  where: z.lazy(() => LegsOnRouteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LegsOnRouteUpdateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedUpdateWithoutRouteInputSchema) ]),
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema) ]),
}).strict();

export const LegsOnRouteUpdateWithWhereUniqueWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateWithWhereUniqueWithoutRouteInput> = z.object({
  where: z.lazy(() => LegsOnRouteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LegsOnRouteUpdateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedUpdateWithoutRouteInputSchema) ]),
}).strict();

export const LegsOnRouteUpdateManyWithWhereWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateManyWithWhereWithoutRouteInput> = z.object({
  where: z.lazy(() => LegsOnRouteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LegsOnRouteUpdateManyMutationInputSchema),z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteInputSchema) ]),
}).strict();

export const LegsOnRouteScalarWhereInputSchema: z.ZodType<Prisma.LegsOnRouteScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LegsOnRouteScalarWhereInputSchema),z.lazy(() => LegsOnRouteScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegsOnRouteScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegsOnRouteScalarWhereInputSchema),z.lazy(() => LegsOnRouteScalarWhereInputSchema).array() ]).optional(),
  routeId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  legId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  index: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const RouteCreateWithoutLegsInputSchema: z.ZodType<Prisma.RouteCreateWithoutLegsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema)
}).strict();

export const RouteUncheckedCreateWithoutLegsInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutLegsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int()
}).strict();

export const RouteCreateOrConnectWithoutLegsInputSchema: z.ZodType<Prisma.RouteCreateOrConnectWithoutLegsInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RouteCreateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedCreateWithoutLegsInputSchema) ]),
}).strict();

export const RouteUpsertWithoutLegsInputSchema: z.ZodType<Prisma.RouteUpsertWithoutLegsInput> = z.object({
  update: z.union([ z.lazy(() => RouteUpdateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutLegsInputSchema) ]),
  create: z.union([ z.lazy(() => RouteCreateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedCreateWithoutLegsInputSchema) ]),
  where: z.lazy(() => RouteWhereInputSchema).optional()
}).strict();

export const RouteUpdateToOneWithWhereWithoutLegsInputSchema: z.ZodType<Prisma.RouteUpdateToOneWithWhereWithoutLegsInput> = z.object({
  where: z.lazy(() => RouteWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RouteUpdateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutLegsInputSchema) ]),
}).strict();

export const RouteUpdateWithoutLegsInputSchema: z.ZodType<Prisma.RouteUpdateWithoutLegsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutLegsInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutLegsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipCreateManyOwnerInputSchema: z.ZodType<Prisma.ShipCreateManyOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const RouteCreateManyOwnerInputSchema: z.ZodType<Prisma.RouteCreateManyOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int()
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

export const RouteUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUpdateWithoutOwnerInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const RouteCreateManyMapInputSchema: z.ZodType<Prisma.RouteCreateManyMapInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int()
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

export const RouteUpdateWithoutMapInputSchema: z.ZodType<Prisma.RouteUpdateWithoutMapInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteCreateManyRouteInputSchema: z.ZodType<Prisma.LegsOnRouteCreateManyRouteInput> = z.object({
  legId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteUpdateWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateWithoutRouteInput> = z.object({
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteUncheckedUpdateWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateWithoutRouteInput> = z.object({
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteUncheckedUpdateManyWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateManyWithoutRouteInput> = z.object({
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const RouteFindFirstArgsSchema: z.ZodType<Prisma.RouteFindFirstArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereInputSchema.optional(),
  orderBy: z.union([ RouteOrderByWithRelationInputSchema.array(),RouteOrderByWithRelationInputSchema ]).optional(),
  cursor: RouteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RouteScalarFieldEnumSchema,RouteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RouteFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RouteFindFirstOrThrowArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereInputSchema.optional(),
  orderBy: z.union([ RouteOrderByWithRelationInputSchema.array(),RouteOrderByWithRelationInputSchema ]).optional(),
  cursor: RouteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RouteScalarFieldEnumSchema,RouteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RouteFindManyArgsSchema: z.ZodType<Prisma.RouteFindManyArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereInputSchema.optional(),
  orderBy: z.union([ RouteOrderByWithRelationInputSchema.array(),RouteOrderByWithRelationInputSchema ]).optional(),
  cursor: RouteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RouteScalarFieldEnumSchema,RouteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RouteAggregateArgsSchema: z.ZodType<Prisma.RouteAggregateArgs> = z.object({
  where: RouteWhereInputSchema.optional(),
  orderBy: z.union([ RouteOrderByWithRelationInputSchema.array(),RouteOrderByWithRelationInputSchema ]).optional(),
  cursor: RouteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RouteGroupByArgsSchema: z.ZodType<Prisma.RouteGroupByArgs> = z.object({
  where: RouteWhereInputSchema.optional(),
  orderBy: z.union([ RouteOrderByWithAggregationInputSchema.array(),RouteOrderByWithAggregationInputSchema ]).optional(),
  by: RouteScalarFieldEnumSchema.array(),
  having: RouteScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RouteFindUniqueArgsSchema: z.ZodType<Prisma.RouteFindUniqueArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereUniqueInputSchema,
}).strict() ;

export const RouteFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RouteFindUniqueOrThrowArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereUniqueInputSchema,
}).strict() ;

export const LegsOnRouteFindFirstArgsSchema: z.ZodType<Prisma.LegsOnRouteFindFirstArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereInputSchema.optional(),
  orderBy: z.union([ LegsOnRouteOrderByWithRelationInputSchema.array(),LegsOnRouteOrderByWithRelationInputSchema ]).optional(),
  cursor: LegsOnRouteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LegsOnRouteScalarFieldEnumSchema,LegsOnRouteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LegsOnRouteFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LegsOnRouteFindFirstOrThrowArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereInputSchema.optional(),
  orderBy: z.union([ LegsOnRouteOrderByWithRelationInputSchema.array(),LegsOnRouteOrderByWithRelationInputSchema ]).optional(),
  cursor: LegsOnRouteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LegsOnRouteScalarFieldEnumSchema,LegsOnRouteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LegsOnRouteFindManyArgsSchema: z.ZodType<Prisma.LegsOnRouteFindManyArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereInputSchema.optional(),
  orderBy: z.union([ LegsOnRouteOrderByWithRelationInputSchema.array(),LegsOnRouteOrderByWithRelationInputSchema ]).optional(),
  cursor: LegsOnRouteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LegsOnRouteScalarFieldEnumSchema,LegsOnRouteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LegsOnRouteAggregateArgsSchema: z.ZodType<Prisma.LegsOnRouteAggregateArgs> = z.object({
  where: LegsOnRouteWhereInputSchema.optional(),
  orderBy: z.union([ LegsOnRouteOrderByWithRelationInputSchema.array(),LegsOnRouteOrderByWithRelationInputSchema ]).optional(),
  cursor: LegsOnRouteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LegsOnRouteGroupByArgsSchema: z.ZodType<Prisma.LegsOnRouteGroupByArgs> = z.object({
  where: LegsOnRouteWhereInputSchema.optional(),
  orderBy: z.union([ LegsOnRouteOrderByWithAggregationInputSchema.array(),LegsOnRouteOrderByWithAggregationInputSchema ]).optional(),
  by: LegsOnRouteScalarFieldEnumSchema.array(),
  having: LegsOnRouteScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LegsOnRouteFindUniqueArgsSchema: z.ZodType<Prisma.LegsOnRouteFindUniqueArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereUniqueInputSchema,
}).strict() ;

export const LegsOnRouteFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LegsOnRouteFindUniqueOrThrowArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereUniqueInputSchema,
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

export const RouteCreateArgsSchema: z.ZodType<Prisma.RouteCreateArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  data: z.union([ RouteCreateInputSchema,RouteUncheckedCreateInputSchema ]),
}).strict() ;

export const RouteUpsertArgsSchema: z.ZodType<Prisma.RouteUpsertArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereUniqueInputSchema,
  create: z.union([ RouteCreateInputSchema,RouteUncheckedCreateInputSchema ]),
  update: z.union([ RouteUpdateInputSchema,RouteUncheckedUpdateInputSchema ]),
}).strict() ;

export const RouteCreateManyArgsSchema: z.ZodType<Prisma.RouteCreateManyArgs> = z.object({
  data: z.union([ RouteCreateManyInputSchema,RouteCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RouteDeleteArgsSchema: z.ZodType<Prisma.RouteDeleteArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereUniqueInputSchema,
}).strict() ;

export const RouteUpdateArgsSchema: z.ZodType<Prisma.RouteUpdateArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  data: z.union([ RouteUpdateInputSchema,RouteUncheckedUpdateInputSchema ]),
  where: RouteWhereUniqueInputSchema,
}).strict() ;

export const RouteUpdateManyArgsSchema: z.ZodType<Prisma.RouteUpdateManyArgs> = z.object({
  data: z.union([ RouteUpdateManyMutationInputSchema,RouteUncheckedUpdateManyInputSchema ]),
  where: RouteWhereInputSchema.optional(),
}).strict() ;

export const RouteDeleteManyArgsSchema: z.ZodType<Prisma.RouteDeleteManyArgs> = z.object({
  where: RouteWhereInputSchema.optional(),
}).strict() ;

export const LegsOnRouteCreateArgsSchema: z.ZodType<Prisma.LegsOnRouteCreateArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  data: z.union([ LegsOnRouteCreateInputSchema,LegsOnRouteUncheckedCreateInputSchema ]),
}).strict() ;

export const LegsOnRouteUpsertArgsSchema: z.ZodType<Prisma.LegsOnRouteUpsertArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereUniqueInputSchema,
  create: z.union([ LegsOnRouteCreateInputSchema,LegsOnRouteUncheckedCreateInputSchema ]),
  update: z.union([ LegsOnRouteUpdateInputSchema,LegsOnRouteUncheckedUpdateInputSchema ]),
}).strict() ;

export const LegsOnRouteCreateManyArgsSchema: z.ZodType<Prisma.LegsOnRouteCreateManyArgs> = z.object({
  data: z.union([ LegsOnRouteCreateManyInputSchema,LegsOnRouteCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LegsOnRouteDeleteArgsSchema: z.ZodType<Prisma.LegsOnRouteDeleteArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereUniqueInputSchema,
}).strict() ;

export const LegsOnRouteUpdateArgsSchema: z.ZodType<Prisma.LegsOnRouteUpdateArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  data: z.union([ LegsOnRouteUpdateInputSchema,LegsOnRouteUncheckedUpdateInputSchema ]),
  where: LegsOnRouteWhereUniqueInputSchema,
}).strict() ;

export const LegsOnRouteUpdateManyArgsSchema: z.ZodType<Prisma.LegsOnRouteUpdateManyArgs> = z.object({
  data: z.union([ LegsOnRouteUpdateManyMutationInputSchema,LegsOnRouteUncheckedUpdateManyInputSchema ]),
  where: LegsOnRouteWhereInputSchema.optional(),
}).strict() ;

export const LegsOnRouteDeleteManyArgsSchema: z.ZodType<Prisma.LegsOnRouteDeleteManyArgs> = z.object({
  where: LegsOnRouteWhereInputSchema.optional(),
}).strict() ;