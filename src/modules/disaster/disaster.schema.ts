    import {z} from 'zod';
    import { DisasterSource, DisasterType } from '@prisma/client';

    export const createDisasterSchema = z.object({
        reportId: z.string().uuid('Invalid report ID'),
        type: z.nativeEnum(DisasterType),
        latitude: z.number(),
        longitude: z.number(),
        magnitude: z.number().optional(),
        source: z.nativeEnum(DisasterSource)
    })

    export const resolveDisasterSchema = z.object({
        resolvedAt: z.date().optional()
    })