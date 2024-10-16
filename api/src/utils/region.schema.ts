import { z } from "zod"

export const RegionSchema = z.object({
    lat1: z.coerce.number(),    
    lng1: z.coerce.number(),    
    lat2: z.coerce.number(),    
    lng2: z.coerce.number(),    
})

export type Region = z.infer<typeof RegionSchema>
