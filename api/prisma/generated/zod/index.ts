import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

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

export const RelationLoadStrategySchema = z.enum(['query','join']);

export const MapScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','isLocked','name','lat1','lng1','lat2','lng2']);

export const BuoyScalarFieldEnumSchema = z.enum(['id','name','lat','lng','mapId']);

export const LegScalarFieldEnumSchema = z.enum(['id','mapId','startBuoyId','endBuoyId']);

export const RouteScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','type','status','name','mapId','startBuoyId','endBuoyId','ownerId','planId']);

export const LegsOnRouteScalarFieldEnumSchema = z.enum(['routeId','legId','index']);

export const PlanScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','ownerId','mapId','startBuoyId','endBuoyId','raceSecondsRemaining']);

export const WindScalarFieldEnumSchema = z.enum(['timestamp','lat','lng','u','v']);

export const GeometryScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','mapId','name','geojson']);

export const ShipScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','sailNumber','ownerId','polar','lastFetchOfPolarData']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const StatusSchema = z.enum(['PENDING','FAILED','DONE']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

export const RouteTypeSchema = z.enum(['USER','SHORTEST','GENERATED']);

export type RouteTypeType = `${z.infer<typeof RouteTypeSchema>}`

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
// MAP SCHEMA
/////////////////////////////////////////

export const MapSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isLocked: z.boolean(),
  name: z.string(),
  lat1: z.instanceof(Prisma.Decimal, { message: "Field 'lat1' must be a Decimal. Location: ['Models', 'Map']"}),
  lng1: z.instanceof(Prisma.Decimal, { message: "Field 'lng1' must be a Decimal. Location: ['Models', 'Map']"}),
  lat2: z.instanceof(Prisma.Decimal, { message: "Field 'lat2' must be a Decimal. Location: ['Models', 'Map']"}),
  lng2: z.instanceof(Prisma.Decimal, { message: "Field 'lng2' must be a Decimal. Location: ['Models', 'Map']"}),
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
  type: RouteTypeSchema,
  status: StatusSchema,
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int(),
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
// PLAN SCHEMA
/////////////////////////////////////////

export const PlanSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  ownerId: z.number().int(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int(),
})

export type Plan = z.infer<typeof PlanSchema>

/////////////////////////////////////////
// WIND SCHEMA
/////////////////////////////////////////

export const WindSchema = z.object({
  timestamp: z.coerce.date(),
  lat: z.instanceof(Prisma.Decimal, { message: "Field 'lat' must be a Decimal. Location: ['Models', 'Wind']"}),
  lng: z.instanceof(Prisma.Decimal, { message: "Field 'lng' must be a Decimal. Location: ['Models', 'Wind']"}),
  u: z.number(),
  v: z.number(),
})

export type Wind = z.infer<typeof WindSchema>

/////////////////////////////////////////
// GEOMETRY SCHEMA
/////////////////////////////////////////

export const GeometrySchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  mapId: z.number().int(),
  name: z.string(),
  geojson: JsonValueSchema,
})

export type Geometry = z.infer<typeof GeometrySchema>

/////////////////////////////////////////
// SHIP SCHEMA
/////////////////////////////////////////

export const ShipSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  sailNumber: z.string(),
  ownerId: z.number().int(),
  polar: z.string(),
  lastFetchOfPolarData: z.coerce.date(),
})

export type Ship = z.infer<typeof ShipSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  Ships: z.union([z.boolean(),z.lazy(() => ShipFindManyArgsSchema)]).optional(),
  Routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  Plan: z.union([z.boolean(),z.lazy(() => PlanFindManyArgsSchema)]).optional(),
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
  Plan: z.boolean().optional(),
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
  Plan: z.union([z.boolean(),z.lazy(() => PlanFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MAP
//------------------------------------------------------

export const MapIncludeSchema: z.ZodType<Prisma.MapInclude> = z.object({
  Buoys: z.union([z.boolean(),z.lazy(() => BuoyFindManyArgsSchema)]).optional(),
  Legs: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  Routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  Plan: z.union([z.boolean(),z.lazy(() => PlanFindManyArgsSchema)]).optional(),
  Geometry: z.union([z.boolean(),z.lazy(() => GeometryFindManyArgsSchema)]).optional(),
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
  Plan: z.boolean().optional(),
  Geometry: z.boolean().optional(),
}).strict();

export const MapSelectSchema: z.ZodType<Prisma.MapSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isLocked: z.boolean().optional(),
  name: z.boolean().optional(),
  lat1: z.boolean().optional(),
  lng1: z.boolean().optional(),
  lat2: z.boolean().optional(),
  lng2: z.boolean().optional(),
  Buoys: z.union([z.boolean(),z.lazy(() => BuoyFindManyArgsSchema)]).optional(),
  Legs: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  Routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  Plan: z.union([z.boolean(),z.lazy(() => PlanFindManyArgsSchema)]).optional(),
  Geometry: z.union([z.boolean(),z.lazy(() => GeometryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MapCountOutputTypeArgsSchema)]).optional(),
}).strict()

// BUOY
//------------------------------------------------------

export const BuoyIncludeSchema: z.ZodType<Prisma.BuoyInclude> = z.object({
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  legsOut: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  legsIn: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  routeStarts: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  routeEnds: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  planStarts: z.union([z.boolean(),z.lazy(() => PlanFindManyArgsSchema)]).optional(),
  planEnds: z.union([z.boolean(),z.lazy(() => PlanFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BuoyCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const BuoyArgsSchema: z.ZodType<Prisma.BuoyDefaultArgs> = z.object({
  select: z.lazy(() => BuoySelectSchema).optional(),
  include: z.lazy(() => BuoyIncludeSchema).optional(),
}).strict();

export const BuoyCountOutputTypeArgsSchema: z.ZodType<Prisma.BuoyCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => BuoyCountOutputTypeSelectSchema).nullish(),
}).strict();

export const BuoyCountOutputTypeSelectSchema: z.ZodType<Prisma.BuoyCountOutputTypeSelect> = z.object({
  legsOut: z.boolean().optional(),
  legsIn: z.boolean().optional(),
  routeStarts: z.boolean().optional(),
  routeEnds: z.boolean().optional(),
  planStarts: z.boolean().optional(),
  planEnds: z.boolean().optional(),
}).strict();

export const BuoySelectSchema: z.ZodType<Prisma.BuoySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  lat: z.boolean().optional(),
  lng: z.boolean().optional(),
  mapId: z.boolean().optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  legsOut: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  legsIn: z.union([z.boolean(),z.lazy(() => LegFindManyArgsSchema)]).optional(),
  routeStarts: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  routeEnds: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  planStarts: z.union([z.boolean(),z.lazy(() => PlanFindManyArgsSchema)]).optional(),
  planEnds: z.union([z.boolean(),z.lazy(() => PlanFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BuoyCountOutputTypeArgsSchema)]).optional(),
}).strict()

// LEG
//------------------------------------------------------

export const LegIncludeSchema: z.ZodType<Prisma.LegInclude> = z.object({
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  startBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  endBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  LegsOnRoute: z.union([z.boolean(),z.lazy(() => LegsOnRouteFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LegCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const LegArgsSchema: z.ZodType<Prisma.LegDefaultArgs> = z.object({
  select: z.lazy(() => LegSelectSchema).optional(),
  include: z.lazy(() => LegIncludeSchema).optional(),
}).strict();

export const LegCountOutputTypeArgsSchema: z.ZodType<Prisma.LegCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => LegCountOutputTypeSelectSchema).nullish(),
}).strict();

export const LegCountOutputTypeSelectSchema: z.ZodType<Prisma.LegCountOutputTypeSelect> = z.object({
  LegsOnRoute: z.boolean().optional(),
}).strict();

export const LegSelectSchema: z.ZodType<Prisma.LegSelect> = z.object({
  id: z.boolean().optional(),
  mapId: z.boolean().optional(),
  startBuoyId: z.boolean().optional(),
  endBuoyId: z.boolean().optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  startBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  endBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  LegsOnRoute: z.union([z.boolean(),z.lazy(() => LegsOnRouteFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LegCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ROUTE
//------------------------------------------------------

export const RouteIncludeSchema: z.ZodType<Prisma.RouteInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  startBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  endBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  legs: z.union([z.boolean(),z.lazy(() => LegsOnRouteFindManyArgsSchema)]).optional(),
  plan: z.union([z.boolean(),z.lazy(() => PlanArgsSchema)]).optional(),
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
  type: z.boolean().optional(),
  status: z.boolean().optional(),
  name: z.boolean().optional(),
  mapId: z.boolean().optional(),
  startBuoyId: z.boolean().optional(),
  endBuoyId: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  planId: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  startBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  endBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  legs: z.union([z.boolean(),z.lazy(() => LegsOnRouteFindManyArgsSchema)]).optional(),
  plan: z.union([z.boolean(),z.lazy(() => PlanArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RouteCountOutputTypeArgsSchema)]).optional(),
}).strict()

// LEGS ON ROUTE
//------------------------------------------------------

export const LegsOnRouteIncludeSchema: z.ZodType<Prisma.LegsOnRouteInclude> = z.object({
  route: z.union([z.boolean(),z.lazy(() => RouteArgsSchema)]).optional(),
  leg: z.union([z.boolean(),z.lazy(() => LegArgsSchema)]).optional(),
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
  leg: z.union([z.boolean(),z.lazy(() => LegArgsSchema)]).optional(),
}).strict()

// PLAN
//------------------------------------------------------

export const PlanIncludeSchema: z.ZodType<Prisma.PlanInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  startBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  endBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PlanCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PlanArgsSchema: z.ZodType<Prisma.PlanDefaultArgs> = z.object({
  select: z.lazy(() => PlanSelectSchema).optional(),
  include: z.lazy(() => PlanIncludeSchema).optional(),
}).strict();

export const PlanCountOutputTypeArgsSchema: z.ZodType<Prisma.PlanCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PlanCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PlanCountOutputTypeSelectSchema: z.ZodType<Prisma.PlanCountOutputTypeSelect> = z.object({
  routes: z.boolean().optional(),
}).strict();

export const PlanSelectSchema: z.ZodType<Prisma.PlanSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  mapId: z.boolean().optional(),
  startBuoyId: z.boolean().optional(),
  endBuoyId: z.boolean().optional(),
  raceSecondsRemaining: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
  routes: z.union([z.boolean(),z.lazy(() => RouteFindManyArgsSchema)]).optional(),
  startBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  endBuoy: z.union([z.boolean(),z.lazy(() => BuoyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PlanCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WIND
//------------------------------------------------------

export const WindSelectSchema: z.ZodType<Prisma.WindSelect> = z.object({
  timestamp: z.boolean().optional(),
  lat: z.boolean().optional(),
  lng: z.boolean().optional(),
  u: z.boolean().optional(),
  v: z.boolean().optional(),
}).strict()

// GEOMETRY
//------------------------------------------------------

export const GeometryIncludeSchema: z.ZodType<Prisma.GeometryInclude> = z.object({
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
}).strict()

export const GeometryArgsSchema: z.ZodType<Prisma.GeometryDefaultArgs> = z.object({
  select: z.lazy(() => GeometrySelectSchema).optional(),
  include: z.lazy(() => GeometryIncludeSchema).optional(),
}).strict();

export const GeometrySelectSchema: z.ZodType<Prisma.GeometrySelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  mapId: z.boolean().optional(),
  name: z.boolean().optional(),
  geojson: z.boolean().optional(),
  map: z.union([z.boolean(),z.lazy(() => MapArgsSchema)]).optional(),
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
  sailNumber: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  polar: z.boolean().optional(),
  lastFetchOfPolarData: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
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
  Routes: z.lazy(() => RouteListRelationFilterSchema).optional(),
  Plan: z.lazy(() => PlanListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  salt: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  Ships: z.lazy(() => ShipOrderByRelationAggregateInputSchema).optional(),
  Routes: z.lazy(() => RouteOrderByRelationAggregateInputSchema).optional(),
  Plan: z.lazy(() => PlanOrderByRelationAggregateInputSchema).optional()
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
  Routes: z.lazy(() => RouteListRelationFilterSchema).optional(),
  Plan: z.lazy(() => PlanListRelationFilterSchema).optional()
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

export const MapWhereInputSchema: z.ZodType<Prisma.MapWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MapWhereInputSchema),z.lazy(() => MapWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MapWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MapWhereInputSchema),z.lazy(() => MapWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isLocked: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lat1: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng1: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lat2: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng2: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  Buoys: z.lazy(() => BuoyListRelationFilterSchema).optional(),
  Legs: z.lazy(() => LegListRelationFilterSchema).optional(),
  Routes: z.lazy(() => RouteListRelationFilterSchema).optional(),
  Plan: z.lazy(() => PlanListRelationFilterSchema).optional(),
  Geometry: z.lazy(() => GeometryListRelationFilterSchema).optional()
}).strict();

export const MapOrderByWithRelationInputSchema: z.ZodType<Prisma.MapOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat1: z.lazy(() => SortOrderSchema).optional(),
  lng1: z.lazy(() => SortOrderSchema).optional(),
  lat2: z.lazy(() => SortOrderSchema).optional(),
  lng2: z.lazy(() => SortOrderSchema).optional(),
  Buoys: z.lazy(() => BuoyOrderByRelationAggregateInputSchema).optional(),
  Legs: z.lazy(() => LegOrderByRelationAggregateInputSchema).optional(),
  Routes: z.lazy(() => RouteOrderByRelationAggregateInputSchema).optional(),
  Plan: z.lazy(() => PlanOrderByRelationAggregateInputSchema).optional(),
  Geometry: z.lazy(() => GeometryOrderByRelationAggregateInputSchema).optional()
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
  lat1: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng1: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lat2: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng2: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  Buoys: z.lazy(() => BuoyListRelationFilterSchema).optional(),
  Legs: z.lazy(() => LegListRelationFilterSchema).optional(),
  Routes: z.lazy(() => RouteListRelationFilterSchema).optional(),
  Plan: z.lazy(() => PlanListRelationFilterSchema).optional(),
  Geometry: z.lazy(() => GeometryListRelationFilterSchema).optional()
}).strict());

export const MapOrderByWithAggregationInputSchema: z.ZodType<Prisma.MapOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat1: z.lazy(() => SortOrderSchema).optional(),
  lng1: z.lazy(() => SortOrderSchema).optional(),
  lat2: z.lazy(() => SortOrderSchema).optional(),
  lng2: z.lazy(() => SortOrderSchema).optional(),
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
  lat1: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng1: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lat2: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng2: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
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
  legsOut: z.lazy(() => LegListRelationFilterSchema).optional(),
  legsIn: z.lazy(() => LegListRelationFilterSchema).optional(),
  routeStarts: z.lazy(() => RouteListRelationFilterSchema).optional(),
  routeEnds: z.lazy(() => RouteListRelationFilterSchema).optional(),
  planStarts: z.lazy(() => PlanListRelationFilterSchema).optional(),
  planEnds: z.lazy(() => PlanListRelationFilterSchema).optional()
}).strict();

export const BuoyOrderByWithRelationInputSchema: z.ZodType<Prisma.BuoyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional(),
  legsOut: z.lazy(() => LegOrderByRelationAggregateInputSchema).optional(),
  legsIn: z.lazy(() => LegOrderByRelationAggregateInputSchema).optional(),
  routeStarts: z.lazy(() => RouteOrderByRelationAggregateInputSchema).optional(),
  routeEnds: z.lazy(() => RouteOrderByRelationAggregateInputSchema).optional(),
  planStarts: z.lazy(() => PlanOrderByRelationAggregateInputSchema).optional(),
  planEnds: z.lazy(() => PlanOrderByRelationAggregateInputSchema).optional()
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
  legsOut: z.lazy(() => LegListRelationFilterSchema).optional(),
  legsIn: z.lazy(() => LegListRelationFilterSchema).optional(),
  routeStarts: z.lazy(() => RouteListRelationFilterSchema).optional(),
  routeEnds: z.lazy(() => RouteListRelationFilterSchema).optional(),
  planStarts: z.lazy(() => PlanListRelationFilterSchema).optional(),
  planEnds: z.lazy(() => PlanListRelationFilterSchema).optional()
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
  startBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  endBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteListRelationFilterSchema).optional()
}).strict();

export const LegOrderByWithRelationInputSchema: z.ZodType<Prisma.LegOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyOrderByWithRelationInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyOrderByWithRelationInputSchema).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteOrderByRelationAggregateInputSchema).optional()
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
  startBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  endBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteListRelationFilterSchema).optional()
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
  type: z.union([ z.lazy(() => EnumRouteTypeFilterSchema),z.lazy(() => RouteTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  planId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
  startBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  endBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteListRelationFilterSchema).optional(),
  plan: z.union([ z.lazy(() => PlanRelationFilterSchema),z.lazy(() => PlanWhereInputSchema) ]).optional(),
}).strict();

export const RouteOrderByWithRelationInputSchema: z.ZodType<Prisma.RouteOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyOrderByWithRelationInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyOrderByWithRelationInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteOrderByRelationAggregateInputSchema).optional(),
  plan: z.lazy(() => PlanOrderByWithRelationInputSchema).optional()
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
  type: z.union([ z.lazy(() => EnumRouteTypeFilterSchema),z.lazy(() => RouteTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  planId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
  startBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  endBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteListRelationFilterSchema).optional(),
  plan: z.union([ z.lazy(() => PlanRelationFilterSchema),z.lazy(() => PlanWhereInputSchema) ]).optional(),
}).strict());

export const RouteOrderByWithAggregationInputSchema: z.ZodType<Prisma.RouteOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
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
  type: z.union([ z.lazy(() => EnumRouteTypeWithAggregatesFilterSchema),z.lazy(() => RouteTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusWithAggregatesFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  mapId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  planId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const LegsOnRouteWhereInputSchema: z.ZodType<Prisma.LegsOnRouteWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LegsOnRouteWhereInputSchema),z.lazy(() => LegsOnRouteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegsOnRouteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegsOnRouteWhereInputSchema),z.lazy(() => LegsOnRouteWhereInputSchema).array() ]).optional(),
  routeId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  legId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  index: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  route: z.union([ z.lazy(() => RouteRelationFilterSchema),z.lazy(() => RouteWhereInputSchema) ]).optional(),
  leg: z.union([ z.lazy(() => LegRelationFilterSchema),z.lazy(() => LegWhereInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteOrderByWithRelationInputSchema: z.ZodType<Prisma.LegsOnRouteOrderByWithRelationInput> = z.object({
  routeId: z.lazy(() => SortOrderSchema).optional(),
  legId: z.lazy(() => SortOrderSchema).optional(),
  index: z.lazy(() => SortOrderSchema).optional(),
  route: z.lazy(() => RouteOrderByWithRelationInputSchema).optional(),
  leg: z.lazy(() => LegOrderByWithRelationInputSchema).optional()
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
  leg: z.union([ z.lazy(() => LegRelationFilterSchema),z.lazy(() => LegWhereInputSchema) ]).optional(),
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

export const PlanWhereInputSchema: z.ZodType<Prisma.PlanWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PlanWhereInputSchema),z.lazy(() => PlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlanWhereInputSchema),z.lazy(() => PlanWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  raceSecondsRemaining: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
  routes: z.lazy(() => RouteListRelationFilterSchema).optional(),
  startBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  endBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
}).strict();

export const PlanOrderByWithRelationInputSchema: z.ZodType<Prisma.PlanOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  raceSecondsRemaining: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional(),
  routes: z.lazy(() => RouteOrderByRelationAggregateInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyOrderByWithRelationInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyOrderByWithRelationInputSchema).optional()
}).strict();

export const PlanWhereUniqueInputSchema: z.ZodType<Prisma.PlanWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PlanWhereInputSchema),z.lazy(() => PlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlanWhereInputSchema),z.lazy(() => PlanWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  raceSecondsRemaining: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
  routes: z.lazy(() => RouteListRelationFilterSchema).optional(),
  startBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
  endBuoy: z.union([ z.lazy(() => BuoyRelationFilterSchema),z.lazy(() => BuoyWhereInputSchema) ]).optional(),
}).strict());

export const PlanOrderByWithAggregationInputSchema: z.ZodType<Prisma.PlanOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  raceSecondsRemaining: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PlanCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PlanAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PlanMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PlanMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PlanSumOrderByAggregateInputSchema).optional()
}).strict();

export const PlanScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PlanScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PlanScalarWhereWithAggregatesInputSchema),z.lazy(() => PlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlanScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlanScalarWhereWithAggregatesInputSchema),z.lazy(() => PlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  mapId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  raceSecondsRemaining: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const WindWhereInputSchema: z.ZodType<Prisma.WindWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WindWhereInputSchema),z.lazy(() => WindWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WindWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WindWhereInputSchema),z.lazy(() => WindWhereInputSchema).array() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  u: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  v: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
}).strict();

export const WindOrderByWithRelationInputSchema: z.ZodType<Prisma.WindOrderByWithRelationInput> = z.object({
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  u: z.lazy(() => SortOrderSchema).optional(),
  v: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WindWhereUniqueInputSchema: z.ZodType<Prisma.WindWhereUniqueInput> = z.object({
  timestamp_lat_lng: z.lazy(() => WindTimestampLatLngCompoundUniqueInputSchema)
})
.and(z.object({
  timestamp_lat_lng: z.lazy(() => WindTimestampLatLngCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => WindWhereInputSchema),z.lazy(() => WindWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WindWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WindWhereInputSchema),z.lazy(() => WindWhereInputSchema).array() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  u: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  v: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
}).strict());

export const WindOrderByWithAggregationInputSchema: z.ZodType<Prisma.WindOrderByWithAggregationInput> = z.object({
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  u: z.lazy(() => SortOrderSchema).optional(),
  v: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WindCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WindAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WindMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WindMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WindSumOrderByAggregateInputSchema).optional()
}).strict();

export const WindScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WindScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => WindScalarWhereWithAggregatesInputSchema),z.lazy(() => WindScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WindScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WindScalarWhereWithAggregatesInputSchema),z.lazy(() => WindScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  lat: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lng: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  u: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  v: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const GeometryWhereInputSchema: z.ZodType<Prisma.GeometryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GeometryWhereInputSchema),z.lazy(() => GeometryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GeometryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GeometryWhereInputSchema),z.lazy(() => GeometryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  geojson: z.lazy(() => JsonFilterSchema).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
}).strict();

export const GeometryOrderByWithRelationInputSchema: z.ZodType<Prisma.GeometryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  geojson: z.lazy(() => SortOrderSchema).optional(),
  map: z.lazy(() => MapOrderByWithRelationInputSchema).optional()
}).strict();

export const GeometryWhereUniqueInputSchema: z.ZodType<Prisma.GeometryWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => GeometryWhereInputSchema),z.lazy(() => GeometryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GeometryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GeometryWhereInputSchema),z.lazy(() => GeometryWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  geojson: z.lazy(() => JsonFilterSchema).optional(),
  map: z.union([ z.lazy(() => MapRelationFilterSchema),z.lazy(() => MapWhereInputSchema) ]).optional(),
}).strict());

export const GeometryOrderByWithAggregationInputSchema: z.ZodType<Prisma.GeometryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  geojson: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => GeometryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => GeometryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GeometryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GeometryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => GeometrySumOrderByAggregateInputSchema).optional()
}).strict();

export const GeometryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.GeometryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => GeometryScalarWhereWithAggregatesInputSchema),z.lazy(() => GeometryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => GeometryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GeometryScalarWhereWithAggregatesInputSchema),z.lazy(() => GeometryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  mapId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  geojson: z.lazy(() => JsonWithAggregatesFilterSchema).optional()
}).strict();

export const ShipWhereInputSchema: z.ZodType<Prisma.ShipWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShipWhereInputSchema),z.lazy(() => ShipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShipWhereInputSchema),z.lazy(() => ShipWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sailNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  polar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastFetchOfPolarData: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ShipOrderByWithRelationInputSchema: z.ZodType<Prisma.ShipOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sailNumber: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  polar: z.lazy(() => SortOrderSchema).optional(),
  lastFetchOfPolarData: z.lazy(() => SortOrderSchema).optional(),
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
  sailNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  polar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastFetchOfPolarData: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ShipOrderByWithAggregationInputSchema: z.ZodType<Prisma.ShipOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sailNumber: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  polar: z.lazy(() => SortOrderSchema).optional(),
  lastFetchOfPolarData: z.lazy(() => SortOrderSchema).optional(),
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
  sailNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  polar: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastFetchOfPolarData: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipCreateNestedManyWithoutOwnerInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutOwnerInputSchema).optional(),
  Plan: z.lazy(() => PlanCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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

export const MapCreateInputSchema: z.ZodType<Prisma.MapCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateInputSchema: z.ZodType<Prisma.MapUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUpdateInputSchema: z.ZodType<Prisma.MapUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateInputSchema: z.ZodType<Prisma.MapUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapCreateManyInputSchema: z.ZodType<Prisma.MapCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const MapUpdateManyMutationInputSchema: z.ZodType<Prisma.MapUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MapUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MapUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BuoyCreateInputSchema: z.ZodType<Prisma.BuoyCreateInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoysInputSchema),
  legsOut: z.lazy(() => LegCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyUncheckedCreateInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int(),
  legsOut: z.lazy(() => LegUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyUpdateInputSchema: z.ZodType<Prisma.BuoyUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoysNestedInputSchema).optional(),
  legsOut: z.lazy(() => LegUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legsOut: z.lazy(() => LegUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional()
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
  map: z.lazy(() => MapCreateNestedOneWithoutLegsInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutLegsOutInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutLegsInInputSchema),
  LegsOnRoute: z.lazy(() => LegsOnRouteCreateNestedManyWithoutLegInputSchema).optional()
}).strict();

export const LegUncheckedCreateInputSchema: z.ZodType<Prisma.LegUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutLegInputSchema).optional()
}).strict();

export const LegUpdateInputSchema: z.ZodType<Prisma.LegUpdateInput> = z.object({
  map: z.lazy(() => MapUpdateOneRequiredWithoutLegsNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutLegsOutNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutLegsInNestedInputSchema).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUpdateManyWithoutLegNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateInputSchema: z.ZodType<Prisma.LegUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutLegNestedInputSchema).optional()
}).strict();

export const LegCreateManyInputSchema: z.ZodType<Prisma.LegCreateManyInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int()
}).strict();

export const LegUpdateManyMutationInputSchema: z.ZodType<Prisma.LegUpdateManyMutationInput> = z.object({
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
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteEndsInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional(),
  plan: z.lazy(() => PlanCreateNestedOneWithoutRoutesInputSchema)
}).strict();

export const RouteUncheckedCreateInputSchema: z.ZodType<Prisma.RouteUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int(),
  legs: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteUpdateInputSchema: z.ZodType<Prisma.RouteUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteEndsNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional(),
  plan: z.lazy(() => PlanUpdateOneRequiredWithoutRoutesNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteCreateManyInputSchema: z.ZodType<Prisma.RouteCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int()
}).strict();

export const RouteUpdateManyMutationInputSchema: z.ZodType<Prisma.RouteUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RouteUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteCreateInputSchema: z.ZodType<Prisma.LegsOnRouteCreateInput> = z.object({
  index: z.number().int(),
  route: z.lazy(() => RouteCreateNestedOneWithoutLegsInputSchema),
  leg: z.lazy(() => LegCreateNestedOneWithoutLegsOnRouteInputSchema)
}).strict();

export const LegsOnRouteUncheckedCreateInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedCreateInput> = z.object({
  routeId: z.number().int(),
  legId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteUpdateInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateInput> = z.object({
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  route: z.lazy(() => RouteUpdateOneRequiredWithoutLegsNestedInputSchema).optional(),
  leg: z.lazy(() => LegUpdateOneRequiredWithoutLegsOnRouteNestedInputSchema).optional()
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
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateManyInput> = z.object({
  routeId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanCreateInputSchema: z.ZodType<Prisma.PlanCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  raceSecondsRemaining: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPlanInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutPlanInputSchema),
  routes: z.lazy(() => RouteCreateNestedManyWithoutPlanInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanEndsInputSchema)
}).strict();

export const PlanUncheckedCreateInputSchema: z.ZodType<Prisma.PlanUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int(),
  routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutPlanInputSchema).optional()
}).strict();

export const PlanUpdateInputSchema: z.ZodType<Prisma.PlanUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  routes: z.lazy(() => RouteUpdateManyWithoutPlanNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanEndsNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  routes: z.lazy(() => RouteUncheckedUpdateManyWithoutPlanNestedInputSchema).optional()
}).strict();

export const PlanCreateManyInputSchema: z.ZodType<Prisma.PlanCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int()
}).strict();

export const PlanUpdateManyMutationInputSchema: z.ZodType<Prisma.PlanUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WindCreateInputSchema: z.ZodType<Prisma.WindCreateInput> = z.object({
  timestamp: z.coerce.date(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  u: z.number(),
  v: z.number()
}).strict();

export const WindUncheckedCreateInputSchema: z.ZodType<Prisma.WindUncheckedCreateInput> = z.object({
  timestamp: z.coerce.date(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  u: z.number(),
  v: z.number()
}).strict();

export const WindUpdateInputSchema: z.ZodType<Prisma.WindUpdateInput> = z.object({
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  u: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  v: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WindUncheckedUpdateInputSchema: z.ZodType<Prisma.WindUncheckedUpdateInput> = z.object({
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  u: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  v: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WindCreateManyInputSchema: z.ZodType<Prisma.WindCreateManyInput> = z.object({
  timestamp: z.coerce.date(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  u: z.number(),
  v: z.number()
}).strict();

export const WindUpdateManyMutationInputSchema: z.ZodType<Prisma.WindUpdateManyMutationInput> = z.object({
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  u: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  v: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WindUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WindUncheckedUpdateManyInput> = z.object({
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  u: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  v: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GeometryCreateInputSchema: z.ZodType<Prisma.GeometryCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  map: z.lazy(() => MapCreateNestedOneWithoutGeometryInputSchema)
}).strict();

export const GeometryUncheckedCreateInputSchema: z.ZodType<Prisma.GeometryUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  mapId: z.number().int(),
  name: z.string(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const GeometryUpdateInputSchema: z.ZodType<Prisma.GeometryUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutGeometryNestedInputSchema).optional()
}).strict();

export const GeometryUncheckedUpdateInputSchema: z.ZodType<Prisma.GeometryUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const GeometryCreateManyInputSchema: z.ZodType<Prisma.GeometryCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  mapId: z.number().int(),
  name: z.string(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const GeometryUpdateManyMutationInputSchema: z.ZodType<Prisma.GeometryUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const GeometryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.GeometryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ShipCreateInputSchema: z.ZodType<Prisma.ShipCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  sailNumber: z.string().optional(),
  polar: z.string(),
  lastFetchOfPolarData: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutShipsInputSchema)
}).strict();

export const ShipUncheckedCreateInputSchema: z.ZodType<Prisma.ShipUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  sailNumber: z.string().optional(),
  ownerId: z.number().int(),
  polar: z.string(),
  lastFetchOfPolarData: z.coerce.date().optional()
}).strict();

export const ShipUpdateInputSchema: z.ZodType<Prisma.ShipUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sailNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  polar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetchOfPolarData: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutShipsNestedInputSchema).optional()
}).strict();

export const ShipUncheckedUpdateInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sailNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetchOfPolarData: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipCreateManyInputSchema: z.ZodType<Prisma.ShipCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  sailNumber: z.string().optional(),
  ownerId: z.number().int(),
  polar: z.string(),
  lastFetchOfPolarData: z.coerce.date().optional()
}).strict();

export const ShipUpdateManyMutationInputSchema: z.ZodType<Prisma.ShipUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sailNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  polar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetchOfPolarData: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sailNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetchOfPolarData: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const PlanListRelationFilterSchema: z.ZodType<Prisma.PlanListRelationFilter> = z.object({
  every: z.lazy(() => PlanWhereInputSchema).optional(),
  some: z.lazy(() => PlanWhereInputSchema).optional(),
  none: z.lazy(() => PlanWhereInputSchema).optional()
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

export const PlanOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PlanOrderByRelationAggregateInput> = z.object({
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

export const GeometryListRelationFilterSchema: z.ZodType<Prisma.GeometryListRelationFilter> = z.object({
  every: z.lazy(() => GeometryWhereInputSchema).optional(),
  some: z.lazy(() => GeometryWhereInputSchema).optional(),
  none: z.lazy(() => GeometryWhereInputSchema).optional()
}).strict();

export const BuoyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BuoyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LegOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LegOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GeometryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.GeometryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapCountOrderByAggregateInputSchema: z.ZodType<Prisma.MapCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat1: z.lazy(() => SortOrderSchema).optional(),
  lng1: z.lazy(() => SortOrderSchema).optional(),
  lat2: z.lazy(() => SortOrderSchema).optional(),
  lng2: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MapAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  lat1: z.lazy(() => SortOrderSchema).optional(),
  lng1: z.lazy(() => SortOrderSchema).optional(),
  lat2: z.lazy(() => SortOrderSchema).optional(),
  lng2: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MapMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat1: z.lazy(() => SortOrderSchema).optional(),
  lng1: z.lazy(() => SortOrderSchema).optional(),
  lat2: z.lazy(() => SortOrderSchema).optional(),
  lng2: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapMinOrderByAggregateInputSchema: z.ZodType<Prisma.MapMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isLocked: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lat1: z.lazy(() => SortOrderSchema).optional(),
  lng1: z.lazy(() => SortOrderSchema).optional(),
  lat2: z.lazy(() => SortOrderSchema).optional(),
  lng2: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MapSumOrderByAggregateInputSchema: z.ZodType<Prisma.MapSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  lat1: z.lazy(() => SortOrderSchema).optional(),
  lng1: z.lazy(() => SortOrderSchema).optional(),
  lat2: z.lazy(() => SortOrderSchema).optional(),
  lng2: z.lazy(() => SortOrderSchema).optional()
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

export const BuoyRelationFilterSchema: z.ZodType<Prisma.BuoyRelationFilter> = z.object({
  is: z.lazy(() => BuoyWhereInputSchema).optional(),
  isNot: z.lazy(() => BuoyWhereInputSchema).optional()
}).strict();

export const LegsOnRouteListRelationFilterSchema: z.ZodType<Prisma.LegsOnRouteListRelationFilter> = z.object({
  every: z.lazy(() => LegsOnRouteWhereInputSchema).optional(),
  some: z.lazy(() => LegsOnRouteWhereInputSchema).optional(),
  none: z.lazy(() => LegsOnRouteWhereInputSchema).optional()
}).strict();

export const LegsOnRouteOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LegsOnRouteOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
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

export const EnumRouteTypeFilterSchema: z.ZodType<Prisma.EnumRouteTypeFilter> = z.object({
  equals: z.lazy(() => RouteTypeSchema).optional(),
  in: z.lazy(() => RouteTypeSchema).array().optional(),
  notIn: z.lazy(() => RouteTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => NestedEnumRouteTypeFilterSchema) ]).optional(),
}).strict();

export const EnumStatusFilterSchema: z.ZodType<Prisma.EnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const PlanRelationFilterSchema: z.ZodType<Prisma.PlanRelationFilter> = z.object({
  is: z.lazy(() => PlanWhereInputSchema).optional(),
  isNot: z.lazy(() => PlanWhereInputSchema).optional()
}).strict();

export const RouteCountOrderByAggregateInputSchema: z.ZodType<Prisma.RouteCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RouteAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RouteMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteMinOrderByAggregateInputSchema: z.ZodType<Prisma.RouteMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RouteSumOrderByAggregateInputSchema: z.ZodType<Prisma.RouteSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumRouteTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRouteTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RouteTypeSchema).optional(),
  in: z.lazy(() => RouteTypeSchema).array().optional(),
  notIn: z.lazy(() => RouteTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => NestedEnumRouteTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRouteTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRouteTypeFilterSchema).optional()
}).strict();

export const EnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional()
}).strict();

export const RouteRelationFilterSchema: z.ZodType<Prisma.RouteRelationFilter> = z.object({
  is: z.lazy(() => RouteWhereInputSchema).optional(),
  isNot: z.lazy(() => RouteWhereInputSchema).optional()
}).strict();

export const LegRelationFilterSchema: z.ZodType<Prisma.LegRelationFilter> = z.object({
  is: z.lazy(() => LegWhereInputSchema).optional(),
  isNot: z.lazy(() => LegWhereInputSchema).optional()
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

export const PlanCountOrderByAggregateInputSchema: z.ZodType<Prisma.PlanCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  raceSecondsRemaining: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PlanAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  raceSecondsRemaining: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PlanMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  raceSecondsRemaining: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanMinOrderByAggregateInputSchema: z.ZodType<Prisma.PlanMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  raceSecondsRemaining: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanSumOrderByAggregateInputSchema: z.ZodType<Prisma.PlanSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  startBuoyId: z.lazy(() => SortOrderSchema).optional(),
  endBuoyId: z.lazy(() => SortOrderSchema).optional(),
  raceSecondsRemaining: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const WindTimestampLatLngCompoundUniqueInputSchema: z.ZodType<Prisma.WindTimestampLatLngCompoundUniqueInput> = z.object({
  timestamp: z.coerce.date(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const WindCountOrderByAggregateInputSchema: z.ZodType<Prisma.WindCountOrderByAggregateInput> = z.object({
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  u: z.lazy(() => SortOrderSchema).optional(),
  v: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WindAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WindAvgOrderByAggregateInput> = z.object({
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  u: z.lazy(() => SortOrderSchema).optional(),
  v: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WindMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WindMaxOrderByAggregateInput> = z.object({
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  u: z.lazy(() => SortOrderSchema).optional(),
  v: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WindMinOrderByAggregateInputSchema: z.ZodType<Prisma.WindMinOrderByAggregateInput> = z.object({
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  u: z.lazy(() => SortOrderSchema).optional(),
  v: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WindSumOrderByAggregateInputSchema: z.ZodType<Prisma.WindSumOrderByAggregateInput> = z.object({
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
  u: z.lazy(() => SortOrderSchema).optional(),
  v: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const GeometryCountOrderByAggregateInputSchema: z.ZodType<Prisma.GeometryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  geojson: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GeometryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.GeometryAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GeometryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.GeometryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GeometryMinOrderByAggregateInputSchema: z.ZodType<Prisma.GeometryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GeometrySumOrderByAggregateInputSchema: z.ZodType<Prisma.GeometrySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  mapId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const ShipCountOrderByAggregateInputSchema: z.ZodType<Prisma.ShipCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sailNumber: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  polar: z.lazy(() => SortOrderSchema).optional(),
  lastFetchOfPolarData: z.lazy(() => SortOrderSchema).optional()
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
  sailNumber: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  polar: z.lazy(() => SortOrderSchema).optional(),
  lastFetchOfPolarData: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShipMinOrderByAggregateInputSchema: z.ZodType<Prisma.ShipMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sailNumber: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  polar: z.lazy(() => SortOrderSchema).optional(),
  lastFetchOfPolarData: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShipSumOrderByAggregateInputSchema: z.ZodType<Prisma.ShipSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
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

export const PlanCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.PlanCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutOwnerInputSchema),z.lazy(() => PlanCreateWithoutOwnerInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => PlanCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
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

export const PlanUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.PlanUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutOwnerInputSchema),z.lazy(() => PlanCreateWithoutOwnerInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => PlanCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
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

export const PlanUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.PlanUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutOwnerInputSchema),z.lazy(() => PlanCreateWithoutOwnerInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => PlanCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlanUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => PlanUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlanUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => PlanUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlanUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => PlanUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
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

export const PlanUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutOwnerInputSchema),z.lazy(() => PlanCreateWithoutOwnerInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => PlanCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlanUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => PlanUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlanUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => PlanUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlanUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => PlanUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
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

export const PlanCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.PlanCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutMapInputSchema),z.lazy(() => PlanCreateWithoutMapInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutMapInputSchema),z.lazy(() => PlanCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GeometryCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.GeometryCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => GeometryCreateWithoutMapInputSchema),z.lazy(() => GeometryCreateWithoutMapInputSchema).array(),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeometryCreateOrConnectWithoutMapInputSchema),z.lazy(() => GeometryCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeometryCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
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

export const PlanUncheckedCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.PlanUncheckedCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutMapInputSchema),z.lazy(() => PlanCreateWithoutMapInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutMapInputSchema),z.lazy(() => PlanCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GeometryUncheckedCreateNestedManyWithoutMapInputSchema: z.ZodType<Prisma.GeometryUncheckedCreateNestedManyWithoutMapInput> = z.object({
  create: z.union([ z.lazy(() => GeometryCreateWithoutMapInputSchema),z.lazy(() => GeometryCreateWithoutMapInputSchema).array(),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeometryCreateOrConnectWithoutMapInputSchema),z.lazy(() => GeometryCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeometryCreateManyMapInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
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

export const PlanUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.PlanUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutMapInputSchema),z.lazy(() => PlanCreateWithoutMapInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutMapInputSchema),z.lazy(() => PlanCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlanUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => PlanUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlanUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => PlanUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlanUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => PlanUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GeometryUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.GeometryUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => GeometryCreateWithoutMapInputSchema),z.lazy(() => GeometryCreateWithoutMapInputSchema).array(),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeometryCreateOrConnectWithoutMapInputSchema),z.lazy(() => GeometryCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GeometryUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => GeometryUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeometryCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GeometryUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => GeometryUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GeometryUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => GeometryUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GeometryScalarWhereInputSchema),z.lazy(() => GeometryScalarWhereInputSchema).array() ]).optional(),
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

export const PlanUncheckedUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutMapInputSchema),z.lazy(() => PlanCreateWithoutMapInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutMapInputSchema),z.lazy(() => PlanCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlanUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => PlanUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlanUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => PlanUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlanUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => PlanUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GeometryUncheckedUpdateManyWithoutMapNestedInputSchema: z.ZodType<Prisma.GeometryUncheckedUpdateManyWithoutMapNestedInput> = z.object({
  create: z.union([ z.lazy(() => GeometryCreateWithoutMapInputSchema),z.lazy(() => GeometryCreateWithoutMapInputSchema).array(),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GeometryCreateOrConnectWithoutMapInputSchema),z.lazy(() => GeometryCreateOrConnectWithoutMapInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GeometryUpsertWithWhereUniqueWithoutMapInputSchema),z.lazy(() => GeometryUpsertWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GeometryCreateManyMapInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GeometryWhereUniqueInputSchema),z.lazy(() => GeometryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GeometryUpdateWithWhereUniqueWithoutMapInputSchema),z.lazy(() => GeometryUpdateWithWhereUniqueWithoutMapInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GeometryUpdateManyWithWhereWithoutMapInputSchema),z.lazy(() => GeometryUpdateManyWithWhereWithoutMapInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GeometryScalarWhereInputSchema),z.lazy(() => GeometryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MapCreateNestedOneWithoutBuoysInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutBuoysInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutBuoysInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const LegCreateNestedManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegCreateNestedManyWithoutStartBuoyInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutStartBuoyInputSchema),z.lazy(() => LegCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => LegCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyStartBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LegCreateNestedManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegCreateNestedManyWithoutEndBuoyInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutEndBuoyInputSchema),z.lazy(() => LegCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => LegCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyEndBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RouteCreateNestedManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteCreateNestedManyWithoutStartBuoyInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => RouteCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyStartBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RouteCreateNestedManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteCreateNestedManyWithoutEndBuoyInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => RouteCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyEndBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlanCreateNestedManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanCreateNestedManyWithoutStartBuoyInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => PlanCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyStartBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlanCreateNestedManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanCreateNestedManyWithoutEndBuoyInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => PlanCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyEndBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LegUncheckedCreateNestedManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegUncheckedCreateNestedManyWithoutStartBuoyInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutStartBuoyInputSchema),z.lazy(() => LegCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => LegCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyStartBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LegUncheckedCreateNestedManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegUncheckedCreateNestedManyWithoutEndBuoyInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutEndBuoyInputSchema),z.lazy(() => LegCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => LegCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyEndBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RouteUncheckedCreateNestedManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteUncheckedCreateNestedManyWithoutStartBuoyInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => RouteCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyStartBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RouteUncheckedCreateNestedManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteUncheckedCreateNestedManyWithoutEndBuoyInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => RouteCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyEndBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlanUncheckedCreateNestedManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanUncheckedCreateNestedManyWithoutStartBuoyInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => PlanCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyStartBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlanUncheckedCreateNestedManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanUncheckedCreateNestedManyWithoutEndBuoyInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => PlanCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyEndBuoyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MapUpdateOneRequiredWithoutBuoysNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutBuoysNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutBuoysInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutBuoysInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutBuoysInputSchema),z.lazy(() => MapUpdateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedUpdateWithoutBuoysInputSchema) ]).optional(),
}).strict();

export const LegUpdateManyWithoutStartBuoyNestedInputSchema: z.ZodType<Prisma.LegUpdateManyWithoutStartBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutStartBuoyInputSchema),z.lazy(() => LegCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => LegCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegUpsertWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => LegUpsertWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyStartBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegUpdateWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => LegUpdateWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegUpdateManyWithWhereWithoutStartBuoyInputSchema),z.lazy(() => LegUpdateManyWithWhereWithoutStartBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegScalarWhereInputSchema),z.lazy(() => LegScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LegUpdateManyWithoutEndBuoyNestedInputSchema: z.ZodType<Prisma.LegUpdateManyWithoutEndBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutEndBuoyInputSchema),z.lazy(() => LegCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => LegCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegUpsertWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => LegUpsertWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyEndBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegUpdateWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => LegUpdateWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegUpdateManyWithWhereWithoutEndBuoyInputSchema),z.lazy(() => LegUpdateManyWithWhereWithoutEndBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegScalarWhereInputSchema),z.lazy(() => LegScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RouteUpdateManyWithoutStartBuoyNestedInputSchema: z.ZodType<Prisma.RouteUpdateManyWithoutStartBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => RouteCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyStartBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutStartBuoyInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutStartBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RouteUpdateManyWithoutEndBuoyNestedInputSchema: z.ZodType<Prisma.RouteUpdateManyWithoutEndBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => RouteCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyEndBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutEndBuoyInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutEndBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlanUpdateManyWithoutStartBuoyNestedInputSchema: z.ZodType<Prisma.PlanUpdateManyWithoutStartBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => PlanCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlanUpsertWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => PlanUpsertWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyStartBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlanUpdateWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => PlanUpdateWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlanUpdateManyWithWhereWithoutStartBuoyInputSchema),z.lazy(() => PlanUpdateManyWithWhereWithoutStartBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlanUpdateManyWithoutEndBuoyNestedInputSchema: z.ZodType<Prisma.PlanUpdateManyWithoutEndBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => PlanCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlanUpsertWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => PlanUpsertWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyEndBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlanUpdateWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => PlanUpdateWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlanUpdateManyWithWhereWithoutEndBuoyInputSchema),z.lazy(() => PlanUpdateManyWithWhereWithoutEndBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LegUncheckedUpdateManyWithoutStartBuoyNestedInputSchema: z.ZodType<Prisma.LegUncheckedUpdateManyWithoutStartBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutStartBuoyInputSchema),z.lazy(() => LegCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => LegCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegUpsertWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => LegUpsertWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyStartBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegUpdateWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => LegUpdateWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegUpdateManyWithWhereWithoutStartBuoyInputSchema),z.lazy(() => LegUpdateManyWithWhereWithoutStartBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegScalarWhereInputSchema),z.lazy(() => LegScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LegUncheckedUpdateManyWithoutEndBuoyNestedInputSchema: z.ZodType<Prisma.LegUncheckedUpdateManyWithoutEndBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutEndBuoyInputSchema),z.lazy(() => LegCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => LegCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegUpsertWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => LegUpsertWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegCreateManyEndBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegWhereUniqueInputSchema),z.lazy(() => LegWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegUpdateWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => LegUpdateWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegUpdateManyWithWhereWithoutEndBuoyInputSchema),z.lazy(() => LegUpdateManyWithWhereWithoutEndBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegScalarWhereInputSchema),z.lazy(() => LegScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RouteUncheckedUpdateManyWithoutStartBuoyNestedInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutStartBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => RouteCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyStartBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutStartBuoyInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutStartBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RouteUncheckedUpdateManyWithoutEndBuoyNestedInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutEndBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => RouteCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyEndBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutEndBuoyInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutEndBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlanUncheckedUpdateManyWithoutStartBuoyNestedInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyWithoutStartBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanCreateWithoutStartBuoyInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutStartBuoyInputSchema),z.lazy(() => PlanCreateOrConnectWithoutStartBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlanUpsertWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => PlanUpsertWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyStartBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlanUpdateWithWhereUniqueWithoutStartBuoyInputSchema),z.lazy(() => PlanUpdateWithWhereUniqueWithoutStartBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlanUpdateManyWithWhereWithoutStartBuoyInputSchema),z.lazy(() => PlanUpdateManyWithWhereWithoutStartBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlanUncheckedUpdateManyWithoutEndBuoyNestedInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyWithoutEndBuoyNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanCreateWithoutEndBuoyInputSchema).array(),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlanCreateOrConnectWithoutEndBuoyInputSchema),z.lazy(() => PlanCreateOrConnectWithoutEndBuoyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlanUpsertWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => PlanUpsertWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlanCreateManyEndBuoyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlanWhereUniqueInputSchema),z.lazy(() => PlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlanUpdateWithWhereUniqueWithoutEndBuoyInputSchema),z.lazy(() => PlanUpdateWithWhereUniqueWithoutEndBuoyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlanUpdateManyWithWhereWithoutEndBuoyInputSchema),z.lazy(() => PlanUpdateManyWithWhereWithoutEndBuoyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MapCreateNestedOneWithoutLegsInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutLegsInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutLegsInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutLegsInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const BuoyCreateNestedOneWithoutLegsOutInputSchema: z.ZodType<Prisma.BuoyCreateNestedOneWithoutLegsOutInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutLegsOutInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutLegsOutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutLegsOutInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional()
}).strict();

export const BuoyCreateNestedOneWithoutLegsInInputSchema: z.ZodType<Prisma.BuoyCreateNestedOneWithoutLegsInInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutLegsInInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutLegsInInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutLegsInInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional()
}).strict();

export const LegsOnRouteCreateNestedManyWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteCreateNestedManyWithoutLegInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutLegInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutLegInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyLegInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LegsOnRouteUncheckedCreateNestedManyWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedCreateNestedManyWithoutLegInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutLegInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutLegInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyLegInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MapUpdateOneRequiredWithoutLegsNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutLegsNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutLegsInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutLegsInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutLegsInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutLegsInputSchema),z.lazy(() => MapUpdateWithoutLegsInputSchema),z.lazy(() => MapUncheckedUpdateWithoutLegsInputSchema) ]).optional(),
}).strict();

export const BuoyUpdateOneRequiredWithoutLegsOutNestedInputSchema: z.ZodType<Prisma.BuoyUpdateOneRequiredWithoutLegsOutNestedInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutLegsOutInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutLegsOutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutLegsOutInputSchema).optional(),
  upsert: z.lazy(() => BuoyUpsertWithoutLegsOutInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BuoyUpdateToOneWithWhereWithoutLegsOutInputSchema),z.lazy(() => BuoyUpdateWithoutLegsOutInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutLegsOutInputSchema) ]).optional(),
}).strict();

export const BuoyUpdateOneRequiredWithoutLegsInNestedInputSchema: z.ZodType<Prisma.BuoyUpdateOneRequiredWithoutLegsInNestedInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutLegsInInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutLegsInInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutLegsInInputSchema).optional(),
  upsert: z.lazy(() => BuoyUpsertWithoutLegsInInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BuoyUpdateToOneWithWhereWithoutLegsInInputSchema),z.lazy(() => BuoyUpdateWithoutLegsInInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutLegsInInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteUpdateManyWithoutLegNestedInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateManyWithoutLegNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutLegInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutLegInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegsOnRouteUpsertWithWhereUniqueWithoutLegInputSchema),z.lazy(() => LegsOnRouteUpsertWithWhereUniqueWithoutLegInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyLegInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegsOnRouteUpdateWithWhereUniqueWithoutLegInputSchema),z.lazy(() => LegsOnRouteUpdateWithWhereUniqueWithoutLegInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegsOnRouteUpdateManyWithWhereWithoutLegInputSchema),z.lazy(() => LegsOnRouteUpdateManyWithWhereWithoutLegInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegsOnRouteScalarWhereInputSchema),z.lazy(() => LegsOnRouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LegsOnRouteUncheckedUpdateManyWithoutLegNestedInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateManyWithoutLegNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutLegInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutLegInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LegsOnRouteUpsertWithWhereUniqueWithoutLegInputSchema),z.lazy(() => LegsOnRouteUpsertWithWhereUniqueWithoutLegInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyLegInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LegsOnRouteUpdateWithWhereUniqueWithoutLegInputSchema),z.lazy(() => LegsOnRouteUpdateWithWhereUniqueWithoutLegInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LegsOnRouteUpdateManyWithWhereWithoutLegInputSchema),z.lazy(() => LegsOnRouteUpdateManyWithWhereWithoutLegInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LegsOnRouteScalarWhereInputSchema),z.lazy(() => LegsOnRouteScalarWhereInputSchema).array() ]).optional(),
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

export const BuoyCreateNestedOneWithoutRouteStartsInputSchema: z.ZodType<Prisma.BuoyCreateNestedOneWithoutRouteStartsInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutRouteStartsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutRouteStartsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutRouteStartsInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional()
}).strict();

export const BuoyCreateNestedOneWithoutRouteEndsInputSchema: z.ZodType<Prisma.BuoyCreateNestedOneWithoutRouteEndsInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutRouteEndsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutRouteEndsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutRouteEndsInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional()
}).strict();

export const LegsOnRouteCreateNestedManyWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteCreateNestedManyWithoutRouteInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyRouteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlanCreateNestedOneWithoutRoutesInputSchema: z.ZodType<Prisma.PlanCreateNestedOneWithoutRoutesInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutRoutesInputSchema),z.lazy(() => PlanUncheckedCreateWithoutRoutesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlanCreateOrConnectWithoutRoutesInputSchema).optional(),
  connect: z.lazy(() => PlanWhereUniqueInputSchema).optional()
}).strict();

export const LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedCreateNestedManyWithoutRouteInput> = z.object({
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateWithoutRouteInputSchema).array(),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutRouteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema),z.lazy(() => LegsOnRouteCreateOrConnectWithoutRouteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LegsOnRouteCreateManyRouteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LegsOnRouteWhereUniqueInputSchema),z.lazy(() => LegsOnRouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumRouteTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRouteTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RouteTypeSchema).optional()
}).strict();

export const EnumStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => StatusSchema).optional()
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

export const BuoyUpdateOneRequiredWithoutRouteStartsNestedInputSchema: z.ZodType<Prisma.BuoyUpdateOneRequiredWithoutRouteStartsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutRouteStartsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutRouteStartsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutRouteStartsInputSchema).optional(),
  upsert: z.lazy(() => BuoyUpsertWithoutRouteStartsInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BuoyUpdateToOneWithWhereWithoutRouteStartsInputSchema),z.lazy(() => BuoyUpdateWithoutRouteStartsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutRouteStartsInputSchema) ]).optional(),
}).strict();

export const BuoyUpdateOneRequiredWithoutRouteEndsNestedInputSchema: z.ZodType<Prisma.BuoyUpdateOneRequiredWithoutRouteEndsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutRouteEndsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutRouteEndsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutRouteEndsInputSchema).optional(),
  upsert: z.lazy(() => BuoyUpsertWithoutRouteEndsInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BuoyUpdateToOneWithWhereWithoutRouteEndsInputSchema),z.lazy(() => BuoyUpdateWithoutRouteEndsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutRouteEndsInputSchema) ]).optional(),
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

export const PlanUpdateOneRequiredWithoutRoutesNestedInputSchema: z.ZodType<Prisma.PlanUpdateOneRequiredWithoutRoutesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutRoutesInputSchema),z.lazy(() => PlanUncheckedCreateWithoutRoutesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlanCreateOrConnectWithoutRoutesInputSchema).optional(),
  upsert: z.lazy(() => PlanUpsertWithoutRoutesInputSchema).optional(),
  connect: z.lazy(() => PlanWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PlanUpdateToOneWithWhereWithoutRoutesInputSchema),z.lazy(() => PlanUpdateWithoutRoutesInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutRoutesInputSchema) ]).optional(),
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

export const LegCreateNestedOneWithoutLegsOnRouteInputSchema: z.ZodType<Prisma.LegCreateNestedOneWithoutLegsOnRouteInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutLegsOnRouteInputSchema),z.lazy(() => LegUncheckedCreateWithoutLegsOnRouteInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LegCreateOrConnectWithoutLegsOnRouteInputSchema).optional(),
  connect: z.lazy(() => LegWhereUniqueInputSchema).optional()
}).strict();

export const RouteUpdateOneRequiredWithoutLegsNestedInputSchema: z.ZodType<Prisma.RouteUpdateOneRequiredWithoutLegsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedCreateWithoutLegsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RouteCreateOrConnectWithoutLegsInputSchema).optional(),
  upsert: z.lazy(() => RouteUpsertWithoutLegsInputSchema).optional(),
  connect: z.lazy(() => RouteWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RouteUpdateToOneWithWhereWithoutLegsInputSchema),z.lazy(() => RouteUpdateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutLegsInputSchema) ]).optional(),
}).strict();

export const LegUpdateOneRequiredWithoutLegsOnRouteNestedInputSchema: z.ZodType<Prisma.LegUpdateOneRequiredWithoutLegsOnRouteNestedInput> = z.object({
  create: z.union([ z.lazy(() => LegCreateWithoutLegsOnRouteInputSchema),z.lazy(() => LegUncheckedCreateWithoutLegsOnRouteInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LegCreateOrConnectWithoutLegsOnRouteInputSchema).optional(),
  upsert: z.lazy(() => LegUpsertWithoutLegsOnRouteInputSchema).optional(),
  connect: z.lazy(() => LegWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LegUpdateToOneWithWhereWithoutLegsOnRouteInputSchema),z.lazy(() => LegUpdateWithoutLegsOnRouteInputSchema),z.lazy(() => LegUncheckedUpdateWithoutLegsOnRouteInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPlanInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPlanInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPlanInputSchema),z.lazy(() => UserUncheckedCreateWithoutPlanInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPlanInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const MapCreateNestedOneWithoutPlanInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutPlanInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutPlanInputSchema),z.lazy(() => MapUncheckedCreateWithoutPlanInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutPlanInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const RouteCreateNestedManyWithoutPlanInputSchema: z.ZodType<Prisma.RouteCreateNestedManyWithoutPlanInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutPlanInputSchema),z.lazy(() => RouteCreateWithoutPlanInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutPlanInputSchema),z.lazy(() => RouteCreateOrConnectWithoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyPlanInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BuoyCreateNestedOneWithoutPlanStartsInputSchema: z.ZodType<Prisma.BuoyCreateNestedOneWithoutPlanStartsInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutPlanStartsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutPlanStartsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutPlanStartsInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional()
}).strict();

export const BuoyCreateNestedOneWithoutPlanEndsInputSchema: z.ZodType<Prisma.BuoyCreateNestedOneWithoutPlanEndsInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutPlanEndsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutPlanEndsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutPlanEndsInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional()
}).strict();

export const RouteUncheckedCreateNestedManyWithoutPlanInputSchema: z.ZodType<Prisma.RouteUncheckedCreateNestedManyWithoutPlanInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutPlanInputSchema),z.lazy(() => RouteCreateWithoutPlanInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutPlanInputSchema),z.lazy(() => RouteCreateOrConnectWithoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyPlanInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutPlanNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPlanNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPlanInputSchema),z.lazy(() => UserUncheckedCreateWithoutPlanInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPlanInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPlanInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPlanInputSchema),z.lazy(() => UserUpdateWithoutPlanInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPlanInputSchema) ]).optional(),
}).strict();

export const MapUpdateOneRequiredWithoutPlanNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutPlanNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutPlanInputSchema),z.lazy(() => MapUncheckedCreateWithoutPlanInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutPlanInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutPlanInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutPlanInputSchema),z.lazy(() => MapUpdateWithoutPlanInputSchema),z.lazy(() => MapUncheckedUpdateWithoutPlanInputSchema) ]).optional(),
}).strict();

export const RouteUpdateManyWithoutPlanNestedInputSchema: z.ZodType<Prisma.RouteUpdateManyWithoutPlanNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutPlanInputSchema),z.lazy(() => RouteCreateWithoutPlanInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutPlanInputSchema),z.lazy(() => RouteCreateOrConnectWithoutPlanInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutPlanInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyPlanInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutPlanInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutPlanInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutPlanInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutPlanInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BuoyUpdateOneRequiredWithoutPlanStartsNestedInputSchema: z.ZodType<Prisma.BuoyUpdateOneRequiredWithoutPlanStartsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutPlanStartsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutPlanStartsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutPlanStartsInputSchema).optional(),
  upsert: z.lazy(() => BuoyUpsertWithoutPlanStartsInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BuoyUpdateToOneWithWhereWithoutPlanStartsInputSchema),z.lazy(() => BuoyUpdateWithoutPlanStartsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutPlanStartsInputSchema) ]).optional(),
}).strict();

export const BuoyUpdateOneRequiredWithoutPlanEndsNestedInputSchema: z.ZodType<Prisma.BuoyUpdateOneRequiredWithoutPlanEndsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BuoyCreateWithoutPlanEndsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutPlanEndsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BuoyCreateOrConnectWithoutPlanEndsInputSchema).optional(),
  upsert: z.lazy(() => BuoyUpsertWithoutPlanEndsInputSchema).optional(),
  connect: z.lazy(() => BuoyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BuoyUpdateToOneWithWhereWithoutPlanEndsInputSchema),z.lazy(() => BuoyUpdateWithoutPlanEndsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutPlanEndsInputSchema) ]).optional(),
}).strict();

export const RouteUncheckedUpdateManyWithoutPlanNestedInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutPlanNestedInput> = z.object({
  create: z.union([ z.lazy(() => RouteCreateWithoutPlanInputSchema),z.lazy(() => RouteCreateWithoutPlanInputSchema).array(),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RouteCreateOrConnectWithoutPlanInputSchema),z.lazy(() => RouteCreateOrConnectWithoutPlanInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RouteUpsertWithWhereUniqueWithoutPlanInputSchema),z.lazy(() => RouteUpsertWithWhereUniqueWithoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RouteCreateManyPlanInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RouteWhereUniqueInputSchema),z.lazy(() => RouteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RouteUpdateWithWhereUniqueWithoutPlanInputSchema),z.lazy(() => RouteUpdateWithWhereUniqueWithoutPlanInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RouteUpdateManyWithWhereWithoutPlanInputSchema),z.lazy(() => RouteUpdateManyWithWhereWithoutPlanInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RouteScalarWhereInputSchema),z.lazy(() => RouteScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const MapCreateNestedOneWithoutGeometryInputSchema: z.ZodType<Prisma.MapCreateNestedOneWithoutGeometryInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutGeometryInputSchema),z.lazy(() => MapUncheckedCreateWithoutGeometryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutGeometryInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional()
}).strict();

export const MapUpdateOneRequiredWithoutGeometryNestedInputSchema: z.ZodType<Prisma.MapUpdateOneRequiredWithoutGeometryNestedInput> = z.object({
  create: z.union([ z.lazy(() => MapCreateWithoutGeometryInputSchema),z.lazy(() => MapUncheckedCreateWithoutGeometryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MapCreateOrConnectWithoutGeometryInputSchema).optional(),
  upsert: z.lazy(() => MapUpsertWithoutGeometryInputSchema).optional(),
  connect: z.lazy(() => MapWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MapUpdateToOneWithWhereWithoutGeometryInputSchema),z.lazy(() => MapUpdateWithoutGeometryInputSchema),z.lazy(() => MapUncheckedUpdateWithoutGeometryInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutShipsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutShipsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutShipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutShipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutShipsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutShipsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutShipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutShipsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutShipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutShipsInputSchema),z.lazy(() => UserUpdateWithoutShipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShipsInputSchema) ]).optional(),
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

export const NestedEnumRouteTypeFilterSchema: z.ZodType<Prisma.NestedEnumRouteTypeFilter> = z.object({
  equals: z.lazy(() => RouteTypeSchema).optional(),
  in: z.lazy(() => RouteTypeSchema).array().optional(),
  notIn: z.lazy(() => RouteTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => NestedEnumRouteTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumStatusFilterSchema: z.ZodType<Prisma.NestedEnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRouteTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRouteTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RouteTypeSchema).optional(),
  in: z.lazy(() => RouteTypeSchema).array().optional(),
  notIn: z.lazy(() => RouteTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => NestedEnumRouteTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRouteTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRouteTypeFilterSchema).optional()
}).strict();

export const NestedEnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const ShipCreateWithoutOwnerInputSchema: z.ZodType<Prisma.ShipCreateWithoutOwnerInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  sailNumber: z.string().optional(),
  polar: z.string(),
  lastFetchOfPolarData: z.coerce.date().optional()
}).strict();

export const ShipUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  sailNumber: z.string().optional(),
  polar: z.string(),
  lastFetchOfPolarData: z.coerce.date().optional()
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
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteEndsInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional(),
  plan: z.lazy(() => PlanCreateNestedOneWithoutRoutesInputSchema)
}).strict();

export const RouteUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  planId: z.number().int(),
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

export const PlanCreateWithoutOwnerInputSchema: z.ZodType<Prisma.PlanCreateWithoutOwnerInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  raceSecondsRemaining: z.number().int(),
  map: z.lazy(() => MapCreateNestedOneWithoutPlanInputSchema),
  routes: z.lazy(() => RouteCreateNestedManyWithoutPlanInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanEndsInputSchema)
}).strict();

export const PlanUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.PlanUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int(),
  routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutPlanInputSchema).optional()
}).strict();

export const PlanCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.PlanCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlanCreateWithoutOwnerInputSchema),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const PlanCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.PlanCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PlanCreateManyOwnerInputSchema),z.lazy(() => PlanCreateManyOwnerInputSchema).array() ]),
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
  sailNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  polar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastFetchOfPolarData: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
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
  type: z.union([ z.lazy(() => EnumRouteTypeFilterSchema),z.lazy(() => RouteTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  planId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const PlanUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.PlanUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PlanUpdateWithoutOwnerInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => PlanCreateWithoutOwnerInputSchema),z.lazy(() => PlanUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const PlanUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.PlanUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PlanUpdateWithoutOwnerInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const PlanUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.PlanUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => PlanScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PlanUpdateManyMutationInputSchema),z.lazy(() => PlanUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const PlanScalarWhereInputSchema: z.ZodType<Prisma.PlanScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlanScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlanScalarWhereInputSchema),z.lazy(() => PlanScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endBuoyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  raceSecondsRemaining: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const BuoyCreateWithoutMapInputSchema: z.ZodType<Prisma.BuoyCreateWithoutMapInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  legsOut: z.lazy(() => LegCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  legsOut: z.lazy(() => LegUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional()
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
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutLegsOutInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutLegsInInputSchema),
  LegsOnRoute: z.lazy(() => LegsOnRouteCreateNestedManyWithoutLegInputSchema).optional()
}).strict();

export const LegUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.LegUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutLegInputSchema).optional()
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
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteEndsInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional(),
  plan: z.lazy(() => PlanCreateNestedOneWithoutRoutesInputSchema)
}).strict();

export const RouteUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int(),
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

export const PlanCreateWithoutMapInputSchema: z.ZodType<Prisma.PlanCreateWithoutMapInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  raceSecondsRemaining: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPlanInputSchema),
  routes: z.lazy(() => RouteCreateNestedManyWithoutPlanInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanEndsInputSchema)
}).strict();

export const PlanUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.PlanUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int(),
  routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutPlanInputSchema).optional()
}).strict();

export const PlanCreateOrConnectWithoutMapInputSchema: z.ZodType<Prisma.PlanCreateOrConnectWithoutMapInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlanCreateWithoutMapInputSchema),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const PlanCreateManyMapInputEnvelopeSchema: z.ZodType<Prisma.PlanCreateManyMapInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PlanCreateManyMapInputSchema),z.lazy(() => PlanCreateManyMapInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const GeometryCreateWithoutMapInputSchema: z.ZodType<Prisma.GeometryCreateWithoutMapInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const GeometryUncheckedCreateWithoutMapInputSchema: z.ZodType<Prisma.GeometryUncheckedCreateWithoutMapInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const GeometryCreateOrConnectWithoutMapInputSchema: z.ZodType<Prisma.GeometryCreateOrConnectWithoutMapInput> = z.object({
  where: z.lazy(() => GeometryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GeometryCreateWithoutMapInputSchema),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const GeometryCreateManyMapInputEnvelopeSchema: z.ZodType<Prisma.GeometryCreateManyMapInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => GeometryCreateManyMapInputSchema),z.lazy(() => GeometryCreateManyMapInputSchema).array() ]),
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

export const PlanUpsertWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.PlanUpsertWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PlanUpdateWithoutMapInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutMapInputSchema) ]),
  create: z.union([ z.lazy(() => PlanCreateWithoutMapInputSchema),z.lazy(() => PlanUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const PlanUpdateWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.PlanUpdateWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PlanUpdateWithoutMapInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutMapInputSchema) ]),
}).strict();

export const PlanUpdateManyWithWhereWithoutMapInputSchema: z.ZodType<Prisma.PlanUpdateManyWithWhereWithoutMapInput> = z.object({
  where: z.lazy(() => PlanScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PlanUpdateManyMutationInputSchema),z.lazy(() => PlanUncheckedUpdateManyWithoutMapInputSchema) ]),
}).strict();

export const GeometryUpsertWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.GeometryUpsertWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => GeometryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => GeometryUpdateWithoutMapInputSchema),z.lazy(() => GeometryUncheckedUpdateWithoutMapInputSchema) ]),
  create: z.union([ z.lazy(() => GeometryCreateWithoutMapInputSchema),z.lazy(() => GeometryUncheckedCreateWithoutMapInputSchema) ]),
}).strict();

export const GeometryUpdateWithWhereUniqueWithoutMapInputSchema: z.ZodType<Prisma.GeometryUpdateWithWhereUniqueWithoutMapInput> = z.object({
  where: z.lazy(() => GeometryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => GeometryUpdateWithoutMapInputSchema),z.lazy(() => GeometryUncheckedUpdateWithoutMapInputSchema) ]),
}).strict();

export const GeometryUpdateManyWithWhereWithoutMapInputSchema: z.ZodType<Prisma.GeometryUpdateManyWithWhereWithoutMapInput> = z.object({
  where: z.lazy(() => GeometryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => GeometryUpdateManyMutationInputSchema),z.lazy(() => GeometryUncheckedUpdateManyWithoutMapInputSchema) ]),
}).strict();

export const GeometryScalarWhereInputSchema: z.ZodType<Prisma.GeometryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GeometryScalarWhereInputSchema),z.lazy(() => GeometryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GeometryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GeometryScalarWhereInputSchema),z.lazy(() => GeometryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  mapId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  geojson: z.lazy(() => JsonFilterSchema).optional()
}).strict();

export const MapCreateWithoutBuoysInputSchema: z.ZodType<Prisma.MapCreateWithoutBuoysInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Legs: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutBuoysInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutBuoysInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Legs: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutBuoysInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutBuoysInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutBuoysInputSchema),z.lazy(() => MapUncheckedCreateWithoutBuoysInputSchema) ]),
}).strict();

export const LegCreateWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegCreateWithoutStartBuoyInput> = z.object({
  map: z.lazy(() => MapCreateNestedOneWithoutLegsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutLegsInInputSchema),
  LegsOnRoute: z.lazy(() => LegsOnRouteCreateNestedManyWithoutLegInputSchema).optional()
}).strict();

export const LegUncheckedCreateWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegUncheckedCreateWithoutStartBuoyInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  endBuoyId: z.number().int(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutLegInputSchema).optional()
}).strict();

export const LegCreateOrConnectWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegCreateOrConnectWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LegCreateWithoutStartBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema) ]),
}).strict();

export const LegCreateManyStartBuoyInputEnvelopeSchema: z.ZodType<Prisma.LegCreateManyStartBuoyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LegCreateManyStartBuoyInputSchema),z.lazy(() => LegCreateManyStartBuoyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const LegCreateWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegCreateWithoutEndBuoyInput> = z.object({
  map: z.lazy(() => MapCreateNestedOneWithoutLegsInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutLegsOutInputSchema),
  LegsOnRoute: z.lazy(() => LegsOnRouteCreateNestedManyWithoutLegInputSchema).optional()
}).strict();

export const LegUncheckedCreateWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegUncheckedCreateWithoutEndBuoyInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutLegInputSchema).optional()
}).strict();

export const LegCreateOrConnectWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegCreateOrConnectWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LegCreateWithoutEndBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema) ]),
}).strict();

export const LegCreateManyEndBuoyInputEnvelopeSchema: z.ZodType<Prisma.LegCreateManyEndBuoyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LegCreateManyEndBuoyInputSchema),z.lazy(() => LegCreateManyEndBuoyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RouteCreateWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteCreateWithoutStartBuoyInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteEndsInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional(),
  plan: z.lazy(() => PlanCreateNestedOneWithoutRoutesInputSchema)
}).strict();

export const RouteUncheckedCreateWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutStartBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int(),
  legs: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteCreateOrConnectWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteCreateOrConnectWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RouteCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema) ]),
}).strict();

export const RouteCreateManyStartBuoyInputEnvelopeSchema: z.ZodType<Prisma.RouteCreateManyStartBuoyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RouteCreateManyStartBuoyInputSchema),z.lazy(() => RouteCreateManyStartBuoyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RouteCreateWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteCreateWithoutEndBuoyInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteStartsInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional(),
  plan: z.lazy(() => PlanCreateNestedOneWithoutRoutesInputSchema)
}).strict();

export const RouteUncheckedCreateWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutEndBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int(),
  legs: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteCreateOrConnectWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteCreateOrConnectWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RouteCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema) ]),
}).strict();

export const RouteCreateManyEndBuoyInputEnvelopeSchema: z.ZodType<Prisma.RouteCreateManyEndBuoyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RouteCreateManyEndBuoyInputSchema),z.lazy(() => RouteCreateManyEndBuoyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PlanCreateWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanCreateWithoutStartBuoyInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  raceSecondsRemaining: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPlanInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutPlanInputSchema),
  routes: z.lazy(() => RouteCreateNestedManyWithoutPlanInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanEndsInputSchema)
}).strict();

export const PlanUncheckedCreateWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanUncheckedCreateWithoutStartBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  mapId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int(),
  routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutPlanInputSchema).optional()
}).strict();

export const PlanCreateOrConnectWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanCreateOrConnectWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlanCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema) ]),
}).strict();

export const PlanCreateManyStartBuoyInputEnvelopeSchema: z.ZodType<Prisma.PlanCreateManyStartBuoyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PlanCreateManyStartBuoyInputSchema),z.lazy(() => PlanCreateManyStartBuoyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PlanCreateWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanCreateWithoutEndBuoyInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  raceSecondsRemaining: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPlanInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutPlanInputSchema),
  routes: z.lazy(() => RouteCreateNestedManyWithoutPlanInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanStartsInputSchema)
}).strict();

export const PlanUncheckedCreateWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanUncheckedCreateWithoutEndBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int(),
  routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutPlanInputSchema).optional()
}).strict();

export const PlanCreateOrConnectWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanCreateOrConnectWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlanCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema) ]),
}).strict();

export const PlanCreateManyEndBuoyInputEnvelopeSchema: z.ZodType<Prisma.PlanCreateManyEndBuoyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PlanCreateManyEndBuoyInputSchema),z.lazy(() => PlanCreateManyEndBuoyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
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
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Legs: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutBuoysInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutBuoysInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Legs: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const LegUpsertWithWhereUniqueWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegUpsertWithWhereUniqueWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LegUpdateWithoutStartBuoyInputSchema),z.lazy(() => LegUncheckedUpdateWithoutStartBuoyInputSchema) ]),
  create: z.union([ z.lazy(() => LegCreateWithoutStartBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutStartBuoyInputSchema) ]),
}).strict();

export const LegUpdateWithWhereUniqueWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegUpdateWithWhereUniqueWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LegUpdateWithoutStartBuoyInputSchema),z.lazy(() => LegUncheckedUpdateWithoutStartBuoyInputSchema) ]),
}).strict();

export const LegUpdateManyWithWhereWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegUpdateManyWithWhereWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => LegScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LegUpdateManyMutationInputSchema),z.lazy(() => LegUncheckedUpdateManyWithoutStartBuoyInputSchema) ]),
}).strict();

export const LegUpsertWithWhereUniqueWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegUpsertWithWhereUniqueWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LegUpdateWithoutEndBuoyInputSchema),z.lazy(() => LegUncheckedUpdateWithoutEndBuoyInputSchema) ]),
  create: z.union([ z.lazy(() => LegCreateWithoutEndBuoyInputSchema),z.lazy(() => LegUncheckedCreateWithoutEndBuoyInputSchema) ]),
}).strict();

export const LegUpdateWithWhereUniqueWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegUpdateWithWhereUniqueWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LegUpdateWithoutEndBuoyInputSchema),z.lazy(() => LegUncheckedUpdateWithoutEndBuoyInputSchema) ]),
}).strict();

export const LegUpdateManyWithWhereWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegUpdateManyWithWhereWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => LegScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LegUpdateManyMutationInputSchema),z.lazy(() => LegUncheckedUpdateManyWithoutEndBuoyInputSchema) ]),
}).strict();

export const RouteUpsertWithWhereUniqueWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteUpsertWithWhereUniqueWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RouteUpdateWithoutStartBuoyInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutStartBuoyInputSchema) ]),
  create: z.union([ z.lazy(() => RouteCreateWithoutStartBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutStartBuoyInputSchema) ]),
}).strict();

export const RouteUpdateWithWhereUniqueWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteUpdateWithWhereUniqueWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateWithoutStartBuoyInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutStartBuoyInputSchema) ]),
}).strict();

export const RouteUpdateManyWithWhereWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteUpdateManyWithWhereWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => RouteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateManyMutationInputSchema),z.lazy(() => RouteUncheckedUpdateManyWithoutStartBuoyInputSchema) ]),
}).strict();

export const RouteUpsertWithWhereUniqueWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteUpsertWithWhereUniqueWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RouteUpdateWithoutEndBuoyInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutEndBuoyInputSchema) ]),
  create: z.union([ z.lazy(() => RouteCreateWithoutEndBuoyInputSchema),z.lazy(() => RouteUncheckedCreateWithoutEndBuoyInputSchema) ]),
}).strict();

export const RouteUpdateWithWhereUniqueWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteUpdateWithWhereUniqueWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateWithoutEndBuoyInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutEndBuoyInputSchema) ]),
}).strict();

export const RouteUpdateManyWithWhereWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteUpdateManyWithWhereWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => RouteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateManyMutationInputSchema),z.lazy(() => RouteUncheckedUpdateManyWithoutEndBuoyInputSchema) ]),
}).strict();

export const PlanUpsertWithWhereUniqueWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanUpsertWithWhereUniqueWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PlanUpdateWithoutStartBuoyInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutStartBuoyInputSchema) ]),
  create: z.union([ z.lazy(() => PlanCreateWithoutStartBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutStartBuoyInputSchema) ]),
}).strict();

export const PlanUpdateWithWhereUniqueWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanUpdateWithWhereUniqueWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PlanUpdateWithoutStartBuoyInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutStartBuoyInputSchema) ]),
}).strict();

export const PlanUpdateManyWithWhereWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanUpdateManyWithWhereWithoutStartBuoyInput> = z.object({
  where: z.lazy(() => PlanScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PlanUpdateManyMutationInputSchema),z.lazy(() => PlanUncheckedUpdateManyWithoutStartBuoyInputSchema) ]),
}).strict();

export const PlanUpsertWithWhereUniqueWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanUpsertWithWhereUniqueWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PlanUpdateWithoutEndBuoyInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutEndBuoyInputSchema) ]),
  create: z.union([ z.lazy(() => PlanCreateWithoutEndBuoyInputSchema),z.lazy(() => PlanUncheckedCreateWithoutEndBuoyInputSchema) ]),
}).strict();

export const PlanUpdateWithWhereUniqueWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanUpdateWithWhereUniqueWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PlanUpdateWithoutEndBuoyInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutEndBuoyInputSchema) ]),
}).strict();

export const PlanUpdateManyWithWhereWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanUpdateManyWithWhereWithoutEndBuoyInput> = z.object({
  where: z.lazy(() => PlanScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PlanUpdateManyMutationInputSchema),z.lazy(() => PlanUncheckedUpdateManyWithoutEndBuoyInputSchema) ]),
}).strict();

export const MapCreateWithoutLegsInputSchema: z.ZodType<Prisma.MapCreateWithoutLegsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutLegsInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutLegsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutLegsInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutLegsInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutLegsInputSchema),z.lazy(() => MapUncheckedCreateWithoutLegsInputSchema) ]),
}).strict();

export const BuoyCreateWithoutLegsOutInputSchema: z.ZodType<Prisma.BuoyCreateWithoutLegsOutInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoysInputSchema),
  legsIn: z.lazy(() => LegCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyUncheckedCreateWithoutLegsOutInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateWithoutLegsOutInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int(),
  legsIn: z.lazy(() => LegUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyCreateOrConnectWithoutLegsOutInputSchema: z.ZodType<Prisma.BuoyCreateOrConnectWithoutLegsOutInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BuoyCreateWithoutLegsOutInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutLegsOutInputSchema) ]),
}).strict();

export const BuoyCreateWithoutLegsInInputSchema: z.ZodType<Prisma.BuoyCreateWithoutLegsInInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoysInputSchema),
  legsOut: z.lazy(() => LegCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyUncheckedCreateWithoutLegsInInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateWithoutLegsInInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int(),
  legsOut: z.lazy(() => LegUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyCreateOrConnectWithoutLegsInInputSchema: z.ZodType<Prisma.BuoyCreateOrConnectWithoutLegsInInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BuoyCreateWithoutLegsInInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutLegsInInputSchema) ]),
}).strict();

export const LegsOnRouteCreateWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteCreateWithoutLegInput> = z.object({
  index: z.number().int(),
  route: z.lazy(() => RouteCreateNestedOneWithoutLegsInputSchema)
}).strict();

export const LegsOnRouteUncheckedCreateWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedCreateWithoutLegInput> = z.object({
  routeId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteCreateOrConnectWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteCreateOrConnectWithoutLegInput> = z.object({
  where: z.lazy(() => LegsOnRouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema) ]),
}).strict();

export const LegsOnRouteCreateManyLegInputEnvelopeSchema: z.ZodType<Prisma.LegsOnRouteCreateManyLegInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LegsOnRouteCreateManyLegInputSchema),z.lazy(() => LegsOnRouteCreateManyLegInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
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
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutLegsInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutLegsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const BuoyUpsertWithoutLegsOutInputSchema: z.ZodType<Prisma.BuoyUpsertWithoutLegsOutInput> = z.object({
  update: z.union([ z.lazy(() => BuoyUpdateWithoutLegsOutInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutLegsOutInputSchema) ]),
  create: z.union([ z.lazy(() => BuoyCreateWithoutLegsOutInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutLegsOutInputSchema) ]),
  where: z.lazy(() => BuoyWhereInputSchema).optional()
}).strict();

export const BuoyUpdateToOneWithWhereWithoutLegsOutInputSchema: z.ZodType<Prisma.BuoyUpdateToOneWithWhereWithoutLegsOutInput> = z.object({
  where: z.lazy(() => BuoyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BuoyUpdateWithoutLegsOutInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutLegsOutInputSchema) ]),
}).strict();

export const BuoyUpdateWithoutLegsOutInputSchema: z.ZodType<Prisma.BuoyUpdateWithoutLegsOutInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoysNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateWithoutLegsOutInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateWithoutLegsOutInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legsIn: z.lazy(() => LegUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUpsertWithoutLegsInInputSchema: z.ZodType<Prisma.BuoyUpsertWithoutLegsInInput> = z.object({
  update: z.union([ z.lazy(() => BuoyUpdateWithoutLegsInInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutLegsInInputSchema) ]),
  create: z.union([ z.lazy(() => BuoyCreateWithoutLegsInInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutLegsInInputSchema) ]),
  where: z.lazy(() => BuoyWhereInputSchema).optional()
}).strict();

export const BuoyUpdateToOneWithWhereWithoutLegsInInputSchema: z.ZodType<Prisma.BuoyUpdateToOneWithWhereWithoutLegsInInput> = z.object({
  where: z.lazy(() => BuoyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BuoyUpdateWithoutLegsInInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutLegsInInputSchema) ]),
}).strict();

export const BuoyUpdateWithoutLegsInInputSchema: z.ZodType<Prisma.BuoyUpdateWithoutLegsInInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoysNestedInputSchema).optional(),
  legsOut: z.lazy(() => LegUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateWithoutLegsInInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateWithoutLegsInInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legsOut: z.lazy(() => LegUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const LegsOnRouteUpsertWithWhereUniqueWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteUpsertWithWhereUniqueWithoutLegInput> = z.object({
  where: z.lazy(() => LegsOnRouteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LegsOnRouteUpdateWithoutLegInputSchema),z.lazy(() => LegsOnRouteUncheckedUpdateWithoutLegInputSchema) ]),
  create: z.union([ z.lazy(() => LegsOnRouteCreateWithoutLegInputSchema),z.lazy(() => LegsOnRouteUncheckedCreateWithoutLegInputSchema) ]),
}).strict();

export const LegsOnRouteUpdateWithWhereUniqueWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateWithWhereUniqueWithoutLegInput> = z.object({
  where: z.lazy(() => LegsOnRouteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LegsOnRouteUpdateWithoutLegInputSchema),z.lazy(() => LegsOnRouteUncheckedUpdateWithoutLegInputSchema) ]),
}).strict();

export const LegsOnRouteUpdateManyWithWhereWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateManyWithWhereWithoutLegInput> = z.object({
  where: z.lazy(() => LegsOnRouteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LegsOnRouteUpdateManyMutationInputSchema),z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutLegInputSchema) ]),
}).strict();

export const LegsOnRouteScalarWhereInputSchema: z.ZodType<Prisma.LegsOnRouteScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LegsOnRouteScalarWhereInputSchema),z.lazy(() => LegsOnRouteScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LegsOnRouteScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LegsOnRouteScalarWhereInputSchema),z.lazy(() => LegsOnRouteScalarWhereInputSchema).array() ]).optional(),
  routeId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  legId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  index: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const UserCreateWithoutRoutesInputSchema: z.ZodType<Prisma.UserCreateWithoutRoutesInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipCreateNestedManyWithoutOwnerInputSchema).optional(),
  Plan: z.lazy(() => PlanCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutRoutesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRoutesInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
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
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutRoutesInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutRoutesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutRoutesInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutRoutesInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutRoutesInputSchema),z.lazy(() => MapUncheckedCreateWithoutRoutesInputSchema) ]),
}).strict();

export const BuoyCreateWithoutRouteStartsInputSchema: z.ZodType<Prisma.BuoyCreateWithoutRouteStartsInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoysInputSchema),
  legsOut: z.lazy(() => LegCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyUncheckedCreateWithoutRouteStartsInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateWithoutRouteStartsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int(),
  legsOut: z.lazy(() => LegUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyCreateOrConnectWithoutRouteStartsInputSchema: z.ZodType<Prisma.BuoyCreateOrConnectWithoutRouteStartsInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BuoyCreateWithoutRouteStartsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutRouteStartsInputSchema) ]),
}).strict();

export const BuoyCreateWithoutRouteEndsInputSchema: z.ZodType<Prisma.BuoyCreateWithoutRouteEndsInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoysInputSchema),
  legsOut: z.lazy(() => LegCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyUncheckedCreateWithoutRouteEndsInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateWithoutRouteEndsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int(),
  legsOut: z.lazy(() => LegUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyCreateOrConnectWithoutRouteEndsInputSchema: z.ZodType<Prisma.BuoyCreateOrConnectWithoutRouteEndsInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BuoyCreateWithoutRouteEndsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutRouteEndsInputSchema) ]),
}).strict();

export const LegsOnRouteCreateWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteCreateWithoutRouteInput> = z.object({
  index: z.number().int(),
  leg: z.lazy(() => LegCreateNestedOneWithoutLegsOnRouteInputSchema)
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

export const PlanCreateWithoutRoutesInputSchema: z.ZodType<Prisma.PlanCreateWithoutRoutesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  raceSecondsRemaining: z.number().int(),
  owner: z.lazy(() => UserCreateNestedOneWithoutPlanInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutPlanInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutPlanEndsInputSchema)
}).strict();

export const PlanUncheckedCreateWithoutRoutesInputSchema: z.ZodType<Prisma.PlanUncheckedCreateWithoutRoutesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int()
}).strict();

export const PlanCreateOrConnectWithoutRoutesInputSchema: z.ZodType<Prisma.PlanCreateOrConnectWithoutRoutesInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlanCreateWithoutRoutesInputSchema),z.lazy(() => PlanUncheckedCreateWithoutRoutesInputSchema) ]),
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
  Ships: z.lazy(() => ShipUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutRoutesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRoutesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutRoutesInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutRoutesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const BuoyUpsertWithoutRouteStartsInputSchema: z.ZodType<Prisma.BuoyUpsertWithoutRouteStartsInput> = z.object({
  update: z.union([ z.lazy(() => BuoyUpdateWithoutRouteStartsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutRouteStartsInputSchema) ]),
  create: z.union([ z.lazy(() => BuoyCreateWithoutRouteStartsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutRouteStartsInputSchema) ]),
  where: z.lazy(() => BuoyWhereInputSchema).optional()
}).strict();

export const BuoyUpdateToOneWithWhereWithoutRouteStartsInputSchema: z.ZodType<Prisma.BuoyUpdateToOneWithWhereWithoutRouteStartsInput> = z.object({
  where: z.lazy(() => BuoyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BuoyUpdateWithoutRouteStartsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutRouteStartsInputSchema) ]),
}).strict();

export const BuoyUpdateWithoutRouteStartsInputSchema: z.ZodType<Prisma.BuoyUpdateWithoutRouteStartsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoysNestedInputSchema).optional(),
  legsOut: z.lazy(() => LegUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateWithoutRouteStartsInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateWithoutRouteStartsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legsOut: z.lazy(() => LegUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUpsertWithoutRouteEndsInputSchema: z.ZodType<Prisma.BuoyUpsertWithoutRouteEndsInput> = z.object({
  update: z.union([ z.lazy(() => BuoyUpdateWithoutRouteEndsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutRouteEndsInputSchema) ]),
  create: z.union([ z.lazy(() => BuoyCreateWithoutRouteEndsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutRouteEndsInputSchema) ]),
  where: z.lazy(() => BuoyWhereInputSchema).optional()
}).strict();

export const BuoyUpdateToOneWithWhereWithoutRouteEndsInputSchema: z.ZodType<Prisma.BuoyUpdateToOneWithWhereWithoutRouteEndsInput> = z.object({
  where: z.lazy(() => BuoyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BuoyUpdateWithoutRouteEndsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutRouteEndsInputSchema) ]),
}).strict();

export const BuoyUpdateWithoutRouteEndsInputSchema: z.ZodType<Prisma.BuoyUpdateWithoutRouteEndsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoysNestedInputSchema).optional(),
  legsOut: z.lazy(() => LegUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateWithoutRouteEndsInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateWithoutRouteEndsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legsOut: z.lazy(() => LegUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional()
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

export const PlanUpsertWithoutRoutesInputSchema: z.ZodType<Prisma.PlanUpsertWithoutRoutesInput> = z.object({
  update: z.union([ z.lazy(() => PlanUpdateWithoutRoutesInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutRoutesInputSchema) ]),
  create: z.union([ z.lazy(() => PlanCreateWithoutRoutesInputSchema),z.lazy(() => PlanUncheckedCreateWithoutRoutesInputSchema) ]),
  where: z.lazy(() => PlanWhereInputSchema).optional()
}).strict();

export const PlanUpdateToOneWithWhereWithoutRoutesInputSchema: z.ZodType<Prisma.PlanUpdateToOneWithWhereWithoutRoutesInput> = z.object({
  where: z.lazy(() => PlanWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PlanUpdateWithoutRoutesInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutRoutesInputSchema) ]),
}).strict();

export const PlanUpdateWithoutRoutesInputSchema: z.ZodType<Prisma.PlanUpdateWithoutRoutesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanEndsNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateWithoutRoutesInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateWithoutRoutesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RouteCreateWithoutLegsInputSchema: z.ZodType<Prisma.RouteCreateWithoutLegsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteEndsInputSchema),
  plan: z.lazy(() => PlanCreateNestedOneWithoutRoutesInputSchema)
}).strict();

export const RouteUncheckedCreateWithoutLegsInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutLegsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int()
}).strict();

export const RouteCreateOrConnectWithoutLegsInputSchema: z.ZodType<Prisma.RouteCreateOrConnectWithoutLegsInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RouteCreateWithoutLegsInputSchema),z.lazy(() => RouteUncheckedCreateWithoutLegsInputSchema) ]),
}).strict();

export const LegCreateWithoutLegsOnRouteInputSchema: z.ZodType<Prisma.LegCreateWithoutLegsOnRouteInput> = z.object({
  map: z.lazy(() => MapCreateNestedOneWithoutLegsInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutLegsOutInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutLegsInInputSchema)
}).strict();

export const LegUncheckedCreateWithoutLegsOnRouteInputSchema: z.ZodType<Prisma.LegUncheckedCreateWithoutLegsOnRouteInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int()
}).strict();

export const LegCreateOrConnectWithoutLegsOnRouteInputSchema: z.ZodType<Prisma.LegCreateOrConnectWithoutLegsOnRouteInput> = z.object({
  where: z.lazy(() => LegWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LegCreateWithoutLegsOnRouteInputSchema),z.lazy(() => LegUncheckedCreateWithoutLegsOnRouteInputSchema) ]),
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
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteEndsNestedInputSchema).optional(),
  plan: z.lazy(() => PlanUpdateOneRequiredWithoutRoutesNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutLegsInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutLegsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegUpsertWithoutLegsOnRouteInputSchema: z.ZodType<Prisma.LegUpsertWithoutLegsOnRouteInput> = z.object({
  update: z.union([ z.lazy(() => LegUpdateWithoutLegsOnRouteInputSchema),z.lazy(() => LegUncheckedUpdateWithoutLegsOnRouteInputSchema) ]),
  create: z.union([ z.lazy(() => LegCreateWithoutLegsOnRouteInputSchema),z.lazy(() => LegUncheckedCreateWithoutLegsOnRouteInputSchema) ]),
  where: z.lazy(() => LegWhereInputSchema).optional()
}).strict();

export const LegUpdateToOneWithWhereWithoutLegsOnRouteInputSchema: z.ZodType<Prisma.LegUpdateToOneWithWhereWithoutLegsOnRouteInput> = z.object({
  where: z.lazy(() => LegWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LegUpdateWithoutLegsOnRouteInputSchema),z.lazy(() => LegUncheckedUpdateWithoutLegsOnRouteInputSchema) ]),
}).strict();

export const LegUpdateWithoutLegsOnRouteInputSchema: z.ZodType<Prisma.LegUpdateWithoutLegsOnRouteInput> = z.object({
  map: z.lazy(() => MapUpdateOneRequiredWithoutLegsNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutLegsOutNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutLegsInNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateWithoutLegsOnRouteInputSchema: z.ZodType<Prisma.LegUncheckedUpdateWithoutLegsOnRouteInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateWithoutPlanInputSchema: z.ZodType<Prisma.UserCreateWithoutPlanInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipCreateNestedManyWithoutOwnerInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPlanInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPlanInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Ships: z.lazy(() => ShipUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPlanInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPlanInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPlanInputSchema),z.lazy(() => UserUncheckedCreateWithoutPlanInputSchema) ]),
}).strict();

export const MapCreateWithoutPlanInputSchema: z.ZodType<Prisma.MapCreateWithoutPlanInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutPlanInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutPlanInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutPlanInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutPlanInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutPlanInputSchema),z.lazy(() => MapUncheckedCreateWithoutPlanInputSchema) ]),
}).strict();

export const RouteCreateWithoutPlanInputSchema: z.ZodType<Prisma.RouteCreateWithoutPlanInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutRoutesInputSchema),
  map: z.lazy(() => MapCreateNestedOneWithoutRoutesInputSchema),
  startBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteStartsInputSchema),
  endBuoy: z.lazy(() => BuoyCreateNestedOneWithoutRouteEndsInputSchema),
  legs: z.lazy(() => LegsOnRouteCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteUncheckedCreateWithoutPlanInputSchema: z.ZodType<Prisma.RouteUncheckedCreateWithoutPlanInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  legs: z.lazy(() => LegsOnRouteUncheckedCreateNestedManyWithoutRouteInputSchema).optional()
}).strict();

export const RouteCreateOrConnectWithoutPlanInputSchema: z.ZodType<Prisma.RouteCreateOrConnectWithoutPlanInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RouteCreateWithoutPlanInputSchema),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema) ]),
}).strict();

export const RouteCreateManyPlanInputEnvelopeSchema: z.ZodType<Prisma.RouteCreateManyPlanInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RouteCreateManyPlanInputSchema),z.lazy(() => RouteCreateManyPlanInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BuoyCreateWithoutPlanStartsInputSchema: z.ZodType<Prisma.BuoyCreateWithoutPlanStartsInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoysInputSchema),
  legsOut: z.lazy(() => LegCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyUncheckedCreateWithoutPlanStartsInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateWithoutPlanStartsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int(),
  legsOut: z.lazy(() => LegUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional()
}).strict();

export const BuoyCreateOrConnectWithoutPlanStartsInputSchema: z.ZodType<Prisma.BuoyCreateOrConnectWithoutPlanStartsInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BuoyCreateWithoutPlanStartsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutPlanStartsInputSchema) ]),
}).strict();

export const BuoyCreateWithoutPlanEndsInputSchema: z.ZodType<Prisma.BuoyCreateWithoutPlanEndsInput> = z.object({
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  map: z.lazy(() => MapCreateNestedOneWithoutBuoysInputSchema),
  legsOut: z.lazy(() => LegCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanCreateNestedManyWithoutStartBuoyInputSchema).optional()
}).strict();

export const BuoyUncheckedCreateWithoutPlanEndsInputSchema: z.ZodType<Prisma.BuoyUncheckedCreateWithoutPlanEndsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lat: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lng: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  mapId: z.number().int(),
  legsOut: z.lazy(() => LegUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedCreateNestedManyWithoutEndBuoyInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedCreateNestedManyWithoutStartBuoyInputSchema).optional()
}).strict();

export const BuoyCreateOrConnectWithoutPlanEndsInputSchema: z.ZodType<Prisma.BuoyCreateOrConnectWithoutPlanEndsInput> = z.object({
  where: z.lazy(() => BuoyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BuoyCreateWithoutPlanEndsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutPlanEndsInputSchema) ]),
}).strict();

export const UserUpsertWithoutPlanInputSchema: z.ZodType<Prisma.UserUpsertWithoutPlanInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPlanInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPlanInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPlanInputSchema),z.lazy(() => UserUncheckedCreateWithoutPlanInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPlanInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPlanInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPlanInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPlanInputSchema) ]),
}).strict();

export const UserUpdateWithoutPlanInputSchema: z.ZodType<Prisma.UserUpdateWithoutPlanInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPlanInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPlanInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Ships: z.lazy(() => ShipUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const MapUpsertWithoutPlanInputSchema: z.ZodType<Prisma.MapUpsertWithoutPlanInput> = z.object({
  update: z.union([ z.lazy(() => MapUpdateWithoutPlanInputSchema),z.lazy(() => MapUncheckedUpdateWithoutPlanInputSchema) ]),
  create: z.union([ z.lazy(() => MapCreateWithoutPlanInputSchema),z.lazy(() => MapUncheckedCreateWithoutPlanInputSchema) ]),
  where: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const MapUpdateToOneWithWhereWithoutPlanInputSchema: z.ZodType<Prisma.MapUpdateToOneWithWhereWithoutPlanInput> = z.object({
  where: z.lazy(() => MapWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MapUpdateWithoutPlanInputSchema),z.lazy(() => MapUncheckedUpdateWithoutPlanInputSchema) ]),
}).strict();

export const MapUpdateWithoutPlanInputSchema: z.ZodType<Prisma.MapUpdateWithoutPlanInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutPlanInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutPlanInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Geometry: z.lazy(() => GeometryUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const RouteUpsertWithWhereUniqueWithoutPlanInputSchema: z.ZodType<Prisma.RouteUpsertWithWhereUniqueWithoutPlanInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RouteUpdateWithoutPlanInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutPlanInputSchema) ]),
  create: z.union([ z.lazy(() => RouteCreateWithoutPlanInputSchema),z.lazy(() => RouteUncheckedCreateWithoutPlanInputSchema) ]),
}).strict();

export const RouteUpdateWithWhereUniqueWithoutPlanInputSchema: z.ZodType<Prisma.RouteUpdateWithWhereUniqueWithoutPlanInput> = z.object({
  where: z.lazy(() => RouteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateWithoutPlanInputSchema),z.lazy(() => RouteUncheckedUpdateWithoutPlanInputSchema) ]),
}).strict();

export const RouteUpdateManyWithWhereWithoutPlanInputSchema: z.ZodType<Prisma.RouteUpdateManyWithWhereWithoutPlanInput> = z.object({
  where: z.lazy(() => RouteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RouteUpdateManyMutationInputSchema),z.lazy(() => RouteUncheckedUpdateManyWithoutPlanInputSchema) ]),
}).strict();

export const BuoyUpsertWithoutPlanStartsInputSchema: z.ZodType<Prisma.BuoyUpsertWithoutPlanStartsInput> = z.object({
  update: z.union([ z.lazy(() => BuoyUpdateWithoutPlanStartsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutPlanStartsInputSchema) ]),
  create: z.union([ z.lazy(() => BuoyCreateWithoutPlanStartsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutPlanStartsInputSchema) ]),
  where: z.lazy(() => BuoyWhereInputSchema).optional()
}).strict();

export const BuoyUpdateToOneWithWhereWithoutPlanStartsInputSchema: z.ZodType<Prisma.BuoyUpdateToOneWithWhereWithoutPlanStartsInput> = z.object({
  where: z.lazy(() => BuoyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BuoyUpdateWithoutPlanStartsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutPlanStartsInputSchema) ]),
}).strict();

export const BuoyUpdateWithoutPlanStartsInputSchema: z.ZodType<Prisma.BuoyUpdateWithoutPlanStartsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoysNestedInputSchema).optional(),
  legsOut: z.lazy(() => LegUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateWithoutPlanStartsInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateWithoutPlanStartsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legsOut: z.lazy(() => LegUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUpsertWithoutPlanEndsInputSchema: z.ZodType<Prisma.BuoyUpsertWithoutPlanEndsInput> = z.object({
  update: z.union([ z.lazy(() => BuoyUpdateWithoutPlanEndsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutPlanEndsInputSchema) ]),
  create: z.union([ z.lazy(() => BuoyCreateWithoutPlanEndsInputSchema),z.lazy(() => BuoyUncheckedCreateWithoutPlanEndsInputSchema) ]),
  where: z.lazy(() => BuoyWhereInputSchema).optional()
}).strict();

export const BuoyUpdateToOneWithWhereWithoutPlanEndsInputSchema: z.ZodType<Prisma.BuoyUpdateToOneWithWhereWithoutPlanEndsInput> = z.object({
  where: z.lazy(() => BuoyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BuoyUpdateWithoutPlanEndsInputSchema),z.lazy(() => BuoyUncheckedUpdateWithoutPlanEndsInputSchema) ]),
}).strict();

export const BuoyUpdateWithoutPlanEndsInputSchema: z.ZodType<Prisma.BuoyUpdateWithoutPlanEndsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutBuoysNestedInputSchema).optional(),
  legsOut: z.lazy(() => LegUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUpdateManyWithoutStartBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateWithoutPlanEndsInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateWithoutPlanEndsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legsOut: z.lazy(() => LegUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional()
}).strict();

export const MapCreateWithoutGeometryInputSchema: z.ZodType<Prisma.MapCreateWithoutGeometryInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapUncheckedCreateWithoutGeometryInputSchema: z.ZodType<Prisma.MapUncheckedCreateWithoutGeometryInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isLocked: z.boolean().optional(),
  name: z.string(),
  lat1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng1: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lat2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lng2: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  Buoys: z.lazy(() => BuoyUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutMapInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedCreateNestedManyWithoutMapInputSchema).optional()
}).strict();

export const MapCreateOrConnectWithoutGeometryInputSchema: z.ZodType<Prisma.MapCreateOrConnectWithoutGeometryInput> = z.object({
  where: z.lazy(() => MapWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MapCreateWithoutGeometryInputSchema),z.lazy(() => MapUncheckedCreateWithoutGeometryInputSchema) ]),
}).strict();

export const MapUpsertWithoutGeometryInputSchema: z.ZodType<Prisma.MapUpsertWithoutGeometryInput> = z.object({
  update: z.union([ z.lazy(() => MapUpdateWithoutGeometryInputSchema),z.lazy(() => MapUncheckedUpdateWithoutGeometryInputSchema) ]),
  create: z.union([ z.lazy(() => MapCreateWithoutGeometryInputSchema),z.lazy(() => MapUncheckedCreateWithoutGeometryInputSchema) ]),
  where: z.lazy(() => MapWhereInputSchema).optional()
}).strict();

export const MapUpdateToOneWithWhereWithoutGeometryInputSchema: z.ZodType<Prisma.MapUpdateToOneWithWhereWithoutGeometryInput> = z.object({
  where: z.lazy(() => MapWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MapUpdateWithoutGeometryInputSchema),z.lazy(() => MapUncheckedUpdateWithoutGeometryInputSchema) ]),
}).strict();

export const MapUpdateWithoutGeometryInputSchema: z.ZodType<Prisma.MapUpdateWithoutGeometryInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const MapUncheckedUpdateWithoutGeometryInputSchema: z.ZodType<Prisma.MapUncheckedUpdateWithoutGeometryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isLocked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng1: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lat2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng2: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  Buoys: z.lazy(() => BuoyUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Legs: z.lazy(() => LegUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutMapNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedUpdateManyWithoutMapNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutShipsInputSchema: z.ZodType<Prisma.UserCreateWithoutShipsInput> = z.object({
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Routes: z.lazy(() => RouteCreateNestedManyWithoutOwnerInputSchema).optional(),
  Plan: z.lazy(() => PlanCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutShipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutShipsInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  salt: z.string(),
  isAdmin: z.boolean().optional(),
  Routes: z.lazy(() => RouteUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
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
  Routes: z.lazy(() => RouteUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutShipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutShipsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Routes: z.lazy(() => RouteUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Plan: z.lazy(() => PlanUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const ShipCreateManyOwnerInputSchema: z.ZodType<Prisma.ShipCreateManyOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  sailNumber: z.string().optional(),
  polar: z.string(),
  lastFetchOfPolarData: z.coerce.date().optional()
}).strict();

export const RouteCreateManyOwnerInputSchema: z.ZodType<Prisma.RouteCreateManyOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  planId: z.number().int()
}).strict();

export const PlanCreateManyOwnerInputSchema: z.ZodType<Prisma.PlanCreateManyOwnerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int()
}).strict();

export const ShipUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUpdateWithoutOwnerInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sailNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  polar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetchOfPolarData: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sailNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  polar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetchOfPolarData: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShipUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.ShipUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sailNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  polar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastFetchOfPolarData: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RouteUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUpdateWithoutOwnerInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteEndsNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional(),
  plan: z.lazy(() => PlanUpdateOneRequiredWithoutRoutesNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.PlanUpdateWithoutOwnerInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  routes: z.lazy(() => RouteUpdateManyWithoutPlanNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanEndsNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  routes: z.lazy(() => RouteUncheckedUpdateManyWithoutPlanNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int()
}).strict();

export const PlanCreateManyMapInputSchema: z.ZodType<Prisma.PlanCreateManyMapInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int()
}).strict();

export const GeometryCreateManyMapInputSchema: z.ZodType<Prisma.GeometryCreateManyMapInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const BuoyUpdateWithoutMapInputSchema: z.ZodType<Prisma.BuoyUpdateWithoutMapInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  legsOut: z.lazy(() => LegUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  legsOut: z.lazy(() => LegUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  legsIn: z.lazy(() => LegUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  routeStarts: z.lazy(() => RouteUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  routeEnds: z.lazy(() => RouteUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional(),
  planStarts: z.lazy(() => PlanUncheckedUpdateManyWithoutStartBuoyNestedInputSchema).optional(),
  planEnds: z.lazy(() => PlanUncheckedUpdateManyWithoutEndBuoyNestedInputSchema).optional()
}).strict();

export const BuoyUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.BuoyUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lat: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lng: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegUpdateWithoutMapInputSchema: z.ZodType<Prisma.LegUpdateWithoutMapInput> = z.object({
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutLegsOutNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutLegsInNestedInputSchema).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUpdateManyWithoutLegNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.LegUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutLegNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.LegUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RouteUpdateWithoutMapInputSchema: z.ZodType<Prisma.RouteUpdateWithoutMapInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteEndsNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional(),
  plan: z.lazy(() => PlanUpdateOneRequiredWithoutRoutesNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanUpdateWithoutMapInputSchema: z.ZodType<Prisma.PlanUpdateWithoutMapInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  routes: z.lazy(() => RouteUpdateManyWithoutPlanNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanEndsNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  routes: z.lazy(() => RouteUncheckedUpdateManyWithoutPlanNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GeometryUpdateWithoutMapInputSchema: z.ZodType<Prisma.GeometryUpdateWithoutMapInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const GeometryUncheckedUpdateWithoutMapInputSchema: z.ZodType<Prisma.GeometryUncheckedUpdateWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const GeometryUncheckedUpdateManyWithoutMapInputSchema: z.ZodType<Prisma.GeometryUncheckedUpdateManyWithoutMapInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  geojson: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const LegCreateManyStartBuoyInputSchema: z.ZodType<Prisma.LegCreateManyStartBuoyInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  endBuoyId: z.number().int()
}).strict();

export const LegCreateManyEndBuoyInputSchema: z.ZodType<Prisma.LegCreateManyEndBuoyInput> = z.object({
  id: z.number().int().optional(),
  mapId: z.number().int(),
  startBuoyId: z.number().int()
}).strict();

export const RouteCreateManyStartBuoyInputSchema: z.ZodType<Prisma.RouteCreateManyStartBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int()
}).strict();

export const RouteCreateManyEndBuoyInputSchema: z.ZodType<Prisma.RouteCreateManyEndBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  ownerId: z.number().int(),
  planId: z.number().int()
}).strict();

export const PlanCreateManyStartBuoyInputSchema: z.ZodType<Prisma.PlanCreateManyStartBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  mapId: z.number().int(),
  endBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int()
}).strict();

export const PlanCreateManyEndBuoyInputSchema: z.ZodType<Prisma.PlanCreateManyEndBuoyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  raceSecondsRemaining: z.number().int()
}).strict();

export const LegUpdateWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegUpdateWithoutStartBuoyInput> = z.object({
  map: z.lazy(() => MapUpdateOneRequiredWithoutLegsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutLegsInNestedInputSchema).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUpdateManyWithoutLegNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegUncheckedUpdateWithoutStartBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutLegNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.LegUncheckedUpdateManyWithoutStartBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegUpdateWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegUpdateWithoutEndBuoyInput> = z.object({
  map: z.lazy(() => MapUpdateOneRequiredWithoutLegsNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutLegsOutNestedInputSchema).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUpdateManyWithoutLegNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegUncheckedUpdateWithoutEndBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  LegsOnRoute: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutLegNestedInputSchema).optional()
}).strict();

export const LegUncheckedUpdateManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.LegUncheckedUpdateManyWithoutEndBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RouteUpdateWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteUpdateWithoutStartBuoyInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteEndsNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional(),
  plan: z.lazy(() => PlanUpdateOneRequiredWithoutRoutesNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutStartBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutStartBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RouteUpdateWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteUpdateWithoutEndBuoyInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteStartsNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional(),
  plan: z.lazy(() => PlanUpdateOneRequiredWithoutRoutesNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutEndBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutEndBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanUpdateWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanUpdateWithoutStartBuoyInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  routes: z.lazy(() => RouteUpdateManyWithoutPlanNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanEndsNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateWithoutStartBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  routes: z.lazy(() => RouteUncheckedUpdateManyWithoutPlanNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateManyWithoutStartBuoyInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyWithoutStartBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanUpdateWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanUpdateWithoutEndBuoyInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutPlanNestedInputSchema).optional(),
  routes: z.lazy(() => RouteUpdateManyWithoutPlanNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutPlanStartsNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateWithoutEndBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  routes: z.lazy(() => RouteUncheckedUpdateManyWithoutPlanNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateManyWithoutEndBuoyInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyWithoutEndBuoyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raceSecondsRemaining: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteCreateManyLegInputSchema: z.ZodType<Prisma.LegsOnRouteCreateManyLegInput> = z.object({
  routeId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteUpdateWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateWithoutLegInput> = z.object({
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  route: z.lazy(() => RouteUpdateOneRequiredWithoutLegsNestedInputSchema).optional()
}).strict();

export const LegsOnRouteUncheckedUpdateWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateWithoutLegInput> = z.object({
  routeId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteUncheckedUpdateManyWithoutLegInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateManyWithoutLegInput> = z.object({
  routeId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteCreateManyRouteInputSchema: z.ZodType<Prisma.LegsOnRouteCreateManyRouteInput> = z.object({
  legId: z.number().int(),
  index: z.number().int()
}).strict();

export const LegsOnRouteUpdateWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUpdateWithoutRouteInput> = z.object({
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  leg: z.lazy(() => LegUpdateOneRequiredWithoutLegsOnRouteNestedInputSchema).optional()
}).strict();

export const LegsOnRouteUncheckedUpdateWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateWithoutRouteInput> = z.object({
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LegsOnRouteUncheckedUpdateManyWithoutRouteInputSchema: z.ZodType<Prisma.LegsOnRouteUncheckedUpdateManyWithoutRouteInput> = z.object({
  legId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  index: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RouteCreateManyPlanInputSchema: z.ZodType<Prisma.RouteCreateManyPlanInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => RouteTypeSchema),
  status: z.lazy(() => StatusSchema).optional(),
  name: z.string(),
  mapId: z.number().int(),
  startBuoyId: z.number().int(),
  endBuoyId: z.number().int(),
  ownerId: z.number().int()
}).strict();

export const RouteUpdateWithoutPlanInputSchema: z.ZodType<Prisma.RouteUpdateWithoutPlanInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  map: z.lazy(() => MapUpdateOneRequiredWithoutRoutesNestedInputSchema).optional(),
  startBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteStartsNestedInputSchema).optional(),
  endBuoy: z.lazy(() => BuoyUpdateOneRequiredWithoutRouteEndsNestedInputSchema).optional(),
  legs: z.lazy(() => LegsOnRouteUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateWithoutPlanInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateWithoutPlanInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  legs: z.lazy(() => LegsOnRouteUncheckedUpdateManyWithoutRouteNestedInputSchema).optional()
}).strict();

export const RouteUncheckedUpdateManyWithoutPlanInputSchema: z.ZodType<Prisma.RouteUncheckedUpdateManyWithoutPlanInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => RouteTypeSchema),z.lazy(() => EnumRouteTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mapId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endBuoyId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const MapFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MapFindUniqueOrThrowArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BuoyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BuoyFindUniqueOrThrowArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LegFindUniqueOrThrowArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const RouteFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RouteFindUniqueOrThrowArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegsOnRouteFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LegsOnRouteFindUniqueOrThrowArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanFindFirstArgsSchema: z.ZodType<Prisma.PlanFindFirstArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithRelationInputSchema.array(),PlanOrderByWithRelationInputSchema ]).optional(),
  cursor: PlanWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlanScalarFieldEnumSchema,PlanScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PlanFindFirstOrThrowArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithRelationInputSchema.array(),PlanOrderByWithRelationInputSchema ]).optional(),
  cursor: PlanWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlanScalarFieldEnumSchema,PlanScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanFindManyArgsSchema: z.ZodType<Prisma.PlanFindManyArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithRelationInputSchema.array(),PlanOrderByWithRelationInputSchema ]).optional(),
  cursor: PlanWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlanScalarFieldEnumSchema,PlanScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanAggregateArgsSchema: z.ZodType<Prisma.PlanAggregateArgs> = z.object({
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithRelationInputSchema.array(),PlanOrderByWithRelationInputSchema ]).optional(),
  cursor: PlanWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PlanGroupByArgsSchema: z.ZodType<Prisma.PlanGroupByArgs> = z.object({
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithAggregationInputSchema.array(),PlanOrderByWithAggregationInputSchema ]).optional(),
  by: PlanScalarFieldEnumSchema.array(),
  having: PlanScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PlanFindUniqueArgsSchema: z.ZodType<Prisma.PlanFindUniqueArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PlanFindUniqueOrThrowArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindFindFirstArgsSchema: z.ZodType<Prisma.WindFindFirstArgs> = z.object({
  select: WindSelectSchema.optional(),
  where: WindWhereInputSchema.optional(),
  orderBy: z.union([ WindOrderByWithRelationInputSchema.array(),WindOrderByWithRelationInputSchema ]).optional(),
  cursor: WindWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WindScalarFieldEnumSchema,WindScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WindFindFirstOrThrowArgs> = z.object({
  select: WindSelectSchema.optional(),
  where: WindWhereInputSchema.optional(),
  orderBy: z.union([ WindOrderByWithRelationInputSchema.array(),WindOrderByWithRelationInputSchema ]).optional(),
  cursor: WindWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WindScalarFieldEnumSchema,WindScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindFindManyArgsSchema: z.ZodType<Prisma.WindFindManyArgs> = z.object({
  select: WindSelectSchema.optional(),
  where: WindWhereInputSchema.optional(),
  orderBy: z.union([ WindOrderByWithRelationInputSchema.array(),WindOrderByWithRelationInputSchema ]).optional(),
  cursor: WindWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WindScalarFieldEnumSchema,WindScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindAggregateArgsSchema: z.ZodType<Prisma.WindAggregateArgs> = z.object({
  where: WindWhereInputSchema.optional(),
  orderBy: z.union([ WindOrderByWithRelationInputSchema.array(),WindOrderByWithRelationInputSchema ]).optional(),
  cursor: WindWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WindGroupByArgsSchema: z.ZodType<Prisma.WindGroupByArgs> = z.object({
  where: WindWhereInputSchema.optional(),
  orderBy: z.union([ WindOrderByWithAggregationInputSchema.array(),WindOrderByWithAggregationInputSchema ]).optional(),
  by: WindScalarFieldEnumSchema.array(),
  having: WindScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WindFindUniqueArgsSchema: z.ZodType<Prisma.WindFindUniqueArgs> = z.object({
  select: WindSelectSchema.optional(),
  where: WindWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WindFindUniqueOrThrowArgs> = z.object({
  select: WindSelectSchema.optional(),
  where: WindWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryFindFirstArgsSchema: z.ZodType<Prisma.GeometryFindFirstArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  where: GeometryWhereInputSchema.optional(),
  orderBy: z.union([ GeometryOrderByWithRelationInputSchema.array(),GeometryOrderByWithRelationInputSchema ]).optional(),
  cursor: GeometryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GeometryScalarFieldEnumSchema,GeometryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.GeometryFindFirstOrThrowArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  where: GeometryWhereInputSchema.optional(),
  orderBy: z.union([ GeometryOrderByWithRelationInputSchema.array(),GeometryOrderByWithRelationInputSchema ]).optional(),
  cursor: GeometryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GeometryScalarFieldEnumSchema,GeometryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryFindManyArgsSchema: z.ZodType<Prisma.GeometryFindManyArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  where: GeometryWhereInputSchema.optional(),
  orderBy: z.union([ GeometryOrderByWithRelationInputSchema.array(),GeometryOrderByWithRelationInputSchema ]).optional(),
  cursor: GeometryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GeometryScalarFieldEnumSchema,GeometryScalarFieldEnumSchema.array() ]).optional(),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryAggregateArgsSchema: z.ZodType<Prisma.GeometryAggregateArgs> = z.object({
  where: GeometryWhereInputSchema.optional(),
  orderBy: z.union([ GeometryOrderByWithRelationInputSchema.array(),GeometryOrderByWithRelationInputSchema ]).optional(),
  cursor: GeometryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GeometryGroupByArgsSchema: z.ZodType<Prisma.GeometryGroupByArgs> = z.object({
  where: GeometryWhereInputSchema.optional(),
  orderBy: z.union([ GeometryOrderByWithAggregationInputSchema.array(),GeometryOrderByWithAggregationInputSchema ]).optional(),
  by: GeometryScalarFieldEnumSchema.array(),
  having: GeometryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GeometryFindUniqueArgsSchema: z.ZodType<Prisma.GeometryFindUniqueArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  where: GeometryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.GeometryFindUniqueOrThrowArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  where: GeometryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const ShipFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ShipFindUniqueOrThrowArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const MapCreateArgsSchema: z.ZodType<Prisma.MapCreateArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  data: z.union([ MapCreateInputSchema,MapUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const MapUpsertArgsSchema: z.ZodType<Prisma.MapUpsertArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereUniqueInputSchema,
  create: z.union([ MapCreateInputSchema,MapUncheckedCreateInputSchema ]),
  update: z.union([ MapUpdateInputSchema,MapUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const MapCreateManyArgsSchema: z.ZodType<Prisma.MapCreateManyArgs> = z.object({
  data: z.union([ MapCreateManyInputSchema,MapCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MapDeleteArgsSchema: z.ZodType<Prisma.MapDeleteArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  where: MapWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const MapUpdateArgsSchema: z.ZodType<Prisma.MapUpdateArgs> = z.object({
  select: MapSelectSchema.optional(),
  include: MapIncludeSchema.optional(),
  data: z.union([ MapUpdateInputSchema,MapUncheckedUpdateInputSchema ]),
  where: MapWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BuoyUpsertArgsSchema: z.ZodType<Prisma.BuoyUpsertArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereUniqueInputSchema,
  create: z.union([ BuoyCreateInputSchema,BuoyUncheckedCreateInputSchema ]),
  update: z.union([ BuoyUpdateInputSchema,BuoyUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BuoyCreateManyArgsSchema: z.ZodType<Prisma.BuoyCreateManyArgs> = z.object({
  data: z.union([ BuoyCreateManyInputSchema,BuoyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BuoyDeleteArgsSchema: z.ZodType<Prisma.BuoyDeleteArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  where: BuoyWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const BuoyUpdateArgsSchema: z.ZodType<Prisma.BuoyUpdateArgs> = z.object({
  select: BuoySelectSchema.optional(),
  include: BuoyIncludeSchema.optional(),
  data: z.union([ BuoyUpdateInputSchema,BuoyUncheckedUpdateInputSchema ]),
  where: BuoyWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegUpsertArgsSchema: z.ZodType<Prisma.LegUpsertArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereUniqueInputSchema,
  create: z.union([ LegCreateInputSchema,LegUncheckedCreateInputSchema ]),
  update: z.union([ LegUpdateInputSchema,LegUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegCreateManyArgsSchema: z.ZodType<Prisma.LegCreateManyArgs> = z.object({
  data: z.union([ LegCreateManyInputSchema,LegCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LegDeleteArgsSchema: z.ZodType<Prisma.LegDeleteArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  where: LegWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegUpdateArgsSchema: z.ZodType<Prisma.LegUpdateArgs> = z.object({
  select: LegSelectSchema.optional(),
  include: LegIncludeSchema.optional(),
  data: z.union([ LegUpdateInputSchema,LegUncheckedUpdateInputSchema ]),
  where: LegWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const RouteUpsertArgsSchema: z.ZodType<Prisma.RouteUpsertArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereUniqueInputSchema,
  create: z.union([ RouteCreateInputSchema,RouteUncheckedCreateInputSchema ]),
  update: z.union([ RouteUpdateInputSchema,RouteUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const RouteCreateManyArgsSchema: z.ZodType<Prisma.RouteCreateManyArgs> = z.object({
  data: z.union([ RouteCreateManyInputSchema,RouteCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RouteDeleteArgsSchema: z.ZodType<Prisma.RouteDeleteArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  where: RouteWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const RouteUpdateArgsSchema: z.ZodType<Prisma.RouteUpdateArgs> = z.object({
  select: RouteSelectSchema.optional(),
  include: RouteIncludeSchema.optional(),
  data: z.union([ RouteUpdateInputSchema,RouteUncheckedUpdateInputSchema ]),
  where: RouteWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
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
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegsOnRouteUpsertArgsSchema: z.ZodType<Prisma.LegsOnRouteUpsertArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereUniqueInputSchema,
  create: z.union([ LegsOnRouteCreateInputSchema,LegsOnRouteUncheckedCreateInputSchema ]),
  update: z.union([ LegsOnRouteUpdateInputSchema,LegsOnRouteUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegsOnRouteCreateManyArgsSchema: z.ZodType<Prisma.LegsOnRouteCreateManyArgs> = z.object({
  data: z.union([ LegsOnRouteCreateManyInputSchema,LegsOnRouteCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LegsOnRouteDeleteArgsSchema: z.ZodType<Prisma.LegsOnRouteDeleteArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  where: LegsOnRouteWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegsOnRouteUpdateArgsSchema: z.ZodType<Prisma.LegsOnRouteUpdateArgs> = z.object({
  select: LegsOnRouteSelectSchema.optional(),
  include: LegsOnRouteIncludeSchema.optional(),
  data: z.union([ LegsOnRouteUpdateInputSchema,LegsOnRouteUncheckedUpdateInputSchema ]),
  where: LegsOnRouteWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const LegsOnRouteUpdateManyArgsSchema: z.ZodType<Prisma.LegsOnRouteUpdateManyArgs> = z.object({
  data: z.union([ LegsOnRouteUpdateManyMutationInputSchema,LegsOnRouteUncheckedUpdateManyInputSchema ]),
  where: LegsOnRouteWhereInputSchema.optional(),
}).strict() ;

export const LegsOnRouteDeleteManyArgsSchema: z.ZodType<Prisma.LegsOnRouteDeleteManyArgs> = z.object({
  where: LegsOnRouteWhereInputSchema.optional(),
}).strict() ;

export const PlanCreateArgsSchema: z.ZodType<Prisma.PlanCreateArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  data: z.union([ PlanCreateInputSchema,PlanUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanUpsertArgsSchema: z.ZodType<Prisma.PlanUpsertArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereUniqueInputSchema,
  create: z.union([ PlanCreateInputSchema,PlanUncheckedCreateInputSchema ]),
  update: z.union([ PlanUpdateInputSchema,PlanUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanCreateManyArgsSchema: z.ZodType<Prisma.PlanCreateManyArgs> = z.object({
  data: z.union([ PlanCreateManyInputSchema,PlanCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PlanDeleteArgsSchema: z.ZodType<Prisma.PlanDeleteArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanUpdateArgsSchema: z.ZodType<Prisma.PlanUpdateArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  data: z.union([ PlanUpdateInputSchema,PlanUncheckedUpdateInputSchema ]),
  where: PlanWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const PlanUpdateManyArgsSchema: z.ZodType<Prisma.PlanUpdateManyArgs> = z.object({
  data: z.union([ PlanUpdateManyMutationInputSchema,PlanUncheckedUpdateManyInputSchema ]),
  where: PlanWhereInputSchema.optional(),
}).strict() ;

export const PlanDeleteManyArgsSchema: z.ZodType<Prisma.PlanDeleteManyArgs> = z.object({
  where: PlanWhereInputSchema.optional(),
}).strict() ;

export const WindCreateArgsSchema: z.ZodType<Prisma.WindCreateArgs> = z.object({
  select: WindSelectSchema.optional(),
  data: z.union([ WindCreateInputSchema,WindUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindUpsertArgsSchema: z.ZodType<Prisma.WindUpsertArgs> = z.object({
  select: WindSelectSchema.optional(),
  where: WindWhereUniqueInputSchema,
  create: z.union([ WindCreateInputSchema,WindUncheckedCreateInputSchema ]),
  update: z.union([ WindUpdateInputSchema,WindUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindCreateManyArgsSchema: z.ZodType<Prisma.WindCreateManyArgs> = z.object({
  data: z.union([ WindCreateManyInputSchema,WindCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const WindDeleteArgsSchema: z.ZodType<Prisma.WindDeleteArgs> = z.object({
  select: WindSelectSchema.optional(),
  where: WindWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindUpdateArgsSchema: z.ZodType<Prisma.WindUpdateArgs> = z.object({
  select: WindSelectSchema.optional(),
  data: z.union([ WindUpdateInputSchema,WindUncheckedUpdateInputSchema ]),
  where: WindWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const WindUpdateManyArgsSchema: z.ZodType<Prisma.WindUpdateManyArgs> = z.object({
  data: z.union([ WindUpdateManyMutationInputSchema,WindUncheckedUpdateManyInputSchema ]),
  where: WindWhereInputSchema.optional(),
}).strict() ;

export const WindDeleteManyArgsSchema: z.ZodType<Prisma.WindDeleteManyArgs> = z.object({
  where: WindWhereInputSchema.optional(),
}).strict() ;

export const GeometryCreateArgsSchema: z.ZodType<Prisma.GeometryCreateArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  data: z.union([ GeometryCreateInputSchema,GeometryUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryUpsertArgsSchema: z.ZodType<Prisma.GeometryUpsertArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  where: GeometryWhereUniqueInputSchema,
  create: z.union([ GeometryCreateInputSchema,GeometryUncheckedCreateInputSchema ]),
  update: z.union([ GeometryUpdateInputSchema,GeometryUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryCreateManyArgsSchema: z.ZodType<Prisma.GeometryCreateManyArgs> = z.object({
  data: z.union([ GeometryCreateManyInputSchema,GeometryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const GeometryDeleteArgsSchema: z.ZodType<Prisma.GeometryDeleteArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  where: GeometryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryUpdateArgsSchema: z.ZodType<Prisma.GeometryUpdateArgs> = z.object({
  select: GeometrySelectSchema.optional(),
  include: GeometryIncludeSchema.optional(),
  data: z.union([ GeometryUpdateInputSchema,GeometryUncheckedUpdateInputSchema ]),
  where: GeometryWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const GeometryUpdateManyArgsSchema: z.ZodType<Prisma.GeometryUpdateManyArgs> = z.object({
  data: z.union([ GeometryUpdateManyMutationInputSchema,GeometryUncheckedUpdateManyInputSchema ]),
  where: GeometryWhereInputSchema.optional(),
}).strict() ;

export const GeometryDeleteManyArgsSchema: z.ZodType<Prisma.GeometryDeleteManyArgs> = z.object({
  where: GeometryWhereInputSchema.optional(),
}).strict() ;

export const ShipCreateArgsSchema: z.ZodType<Prisma.ShipCreateArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  data: z.union([ ShipCreateInputSchema,ShipUncheckedCreateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const ShipUpsertArgsSchema: z.ZodType<Prisma.ShipUpsertArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereUniqueInputSchema,
  create: z.union([ ShipCreateInputSchema,ShipUncheckedCreateInputSchema ]),
  update: z.union([ ShipUpdateInputSchema,ShipUncheckedUpdateInputSchema ]),
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const ShipCreateManyArgsSchema: z.ZodType<Prisma.ShipCreateManyArgs> = z.object({
  data: z.union([ ShipCreateManyInputSchema,ShipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ShipDeleteArgsSchema: z.ZodType<Prisma.ShipDeleteArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  where: ShipWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const ShipUpdateArgsSchema: z.ZodType<Prisma.ShipUpdateArgs> = z.object({
  select: ShipSelectSchema.optional(),
  include: ShipIncludeSchema.optional(),
  data: z.union([ ShipUpdateInputSchema,ShipUncheckedUpdateInputSchema ]),
  where: ShipWhereUniqueInputSchema,
  relationLoadStrategy: RelationLoadStrategySchema.optional(),
}).strict() ;

export const ShipUpdateManyArgsSchema: z.ZodType<Prisma.ShipUpdateManyArgs> = z.object({
  data: z.union([ ShipUpdateManyMutationInputSchema,ShipUncheckedUpdateManyInputSchema ]),
  where: ShipWhereInputSchema.optional(),
}).strict() ;

export const ShipDeleteManyArgsSchema: z.ZodType<Prisma.ShipDeleteManyArgs> = z.object({
  where: ShipWhereInputSchema.optional(),
}).strict() ;