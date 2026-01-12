import {z} from 'zod';

export const subscribeSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({
        p256dh: z.string(),
        auth: z.string()
    }),
    latitude: z.number(),
    longitude: z.number(),
    radius: z.number().optional()
})