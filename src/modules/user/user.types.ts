import { Role } from "@prisma/client";

export interface CreateUserPayload {
    name: string
    email: string
    password: string
    role: Role
    phone?: string 
}

export interface UpdateUserPayload {
    
}