import prisma from "../../config/prisma.config";
import { CreateUserPayload, UpdateUserPayload } from "./user.types";

export class UserRepository {
    static create(data: CreateUserPayload) {
        return prisma.user.create({data})
    }

    static findByEmail(email: string) {
        return prisma.user.findUnique({where: {email}});
    }

    static findAll() {
        return prisma.user.findMany({
            select: {id: true, name: true, email: true, role: true}
        });
    }

    static findById(id: string) {
        return prisma.user.findUnique({where: {id}})
    }

    static update(id: string, data: UpdateUserPayload) {
        return prisma.user.update({where: {id}, data})
    }

    static delete(id: string) {
        return prisma.user.delete({where: {id}})
    }
}