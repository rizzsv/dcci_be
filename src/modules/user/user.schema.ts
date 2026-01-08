import {z} from 'zod';
import { Role } from '@prisma/client';

export const createUserSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum([Role.ADMIN, Role.VOLUNTEER]),
    phone: z.string().optional()
})

export const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    phone: z.string().optional()
})